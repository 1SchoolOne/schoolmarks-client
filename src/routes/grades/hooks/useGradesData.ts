import { useState } from 'react'

import { SessionUserData, getSession } from '@api/auth'
import { getClasses } from '@api/classes'
import { getCourseEnrollments } from '@api/courseEnrollments'
import { getCourses } from '@api/courses'
import { getGrades } from '@api/grades'
import { getStudentGrades } from '@api/studentGrade'
import { Class } from '@apiSchema/classes'
import { CourseEnrollment } from '@apiSchema/courseEnrollments'
import { Course } from '@apiSchema/courses'
import { Grade } from '@apiSchema/grades'
import { StudentGrade } from '@apiSchema/studentGrades'

export const useGradesData = () => {
	const [grades, setGrades] = useState<GradeWithUser[]>([])
	const [loading, setLoading] = useState(true)
	const [courses, setCourses] = useState<Course[]>([])
	const [error, setError] = useState<string | null>(null)
	const [classes, setClasses] = useState<Class[]>([])
	const [userSession, setUserSession] = useState<SessionUserData>()
	const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])

	const fetchGradesData = async () => {
		try {
			setLoading(true)
			const [gradesData, courseData, studentGradesData, enrollmentsData, classesData, sessionData] =
				await Promise.all([
					getGrades(),
					getCourses(),
					getStudentGrades(),
					getCourseEnrollments(),
					getClasses(),
					getSession(),
				])

			setEnrollments(enrollmentsData)
			setUserSession(sessionData.data.user)
			setCourses(courseData)

			const user = sessionData.data.user
			console.log('User session:', user)

			let filteredGrades = gradesData
			console.log('Tous les grades avant filtrage:', gradesData.length)

			// Filtrage spécifique selon le rôle de l'utilisateur
			if (user?.role === 'student') {
				// Filtrer pour n'afficher que les grades pertinents pour l'étudiant
				filteredGrades = gradesData.filter((grade) =>
					studentGradesData.some((sg) => sg.grade === grade.id && sg.student === user?.id),
				)
			} else if (user?.role === 'teacher') {
				const teacherCourses = courseData.filter((course) => course.professor?.id === user?.id)
				console.log("Cours de l'enseignant:", teacherCourses)

				const teacherCourseIds = teacherCourses.map((course) => course.id)
				console.log("IDs des cours de l'enseignant:", teacherCourseIds)

				filteredGrades = gradesData.filter((grade) => {
					const includes = teacherCourseIds.includes(grade.course)
					console.log(`Grade ${grade.id}, course ${grade.course}, inclus: ${includes}`)
					return includes
				})
				console.log("Grades filtrés pour l'enseignant:", filteredGrades.length)
			}

			// Enrichir les grades avec les informations complémentaires
			const gradesWithCourses = filteredGrades.map((grade) => {
				const course = courseData.find((course) => course.id === grade.course)
				const studentGrades = studentGradesData.filter((sg) => sg.grade === grade.id)
				const enrollment = enrollmentsData.find(
					(enrollment) => enrollment.course_id === grade.course,
				)
				const classData = classesData.find((cls) => cls.id === enrollment?.class_group_id)
				return {
					...grade,
					courseName: course ? course.name : 'Matière inconnue',
					studentGrades,
					className: classData ? classData.name : 'Classe inconnue',
				}
			})

			setGrades(gradesWithCourses)
			setError(null)
		} catch (err) {
			setError('Erreur lors du chargement des données')
			console.error('Erreur:', err)
		} finally {
			setLoading(false)
		}
	}

	const fetchClassesAndCourses = async () => {
		try {
			const [classesData, coursesData] = await Promise.all([getClasses(), getCourses()])
			setClasses(classesData)
			setCourses(coursesData)
		} catch (err) {
			console.error('Erreur lors du chargement des données:', err)
		}
	}

	return {
		grades,
		setGrades,
		loading,
		courses,
		error,
		classes,
		enrollments,
		fetchGradesData,
		fetchClassesAndCourses,
		userSession,
	}
}

export interface GradeWithUser extends Grade {
	courseName?: string
	studentGrades?: StudentGrade[]
	className?: string
}
