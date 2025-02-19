import { useCallback, useMemo, useState } from 'react'

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

export interface GradeWithUser extends Grade {
	courseName?: string
	studentGrades?: StudentGrade[]
	className?: string
}

export const useGradesData = () => {
	const [grades, setGrades] = useState<GradeWithUser[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [courses, setCourses] = useState<Course[]>([])
	const [error, setError] = useState<string | null>(null)
	const [classes, setClasses] = useState<Class[]>([])
	const [userSession, setUserSession] = useState<SessionUserData>()
	const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
	const [studentGrades, setStudentGrades] = useState<StudentGrade[]>([])

	const fetchGradesData = useCallback(async (): Promise<void> => {
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

			const user = sessionData.data.user
			setUserSession(user)
			setEnrollments(enrollmentsData)
			setCourses(courseData)
			setClasses(classesData)
			setStudentGrades(studentGradesData)

			let filteredGrades = gradesData

			if (user?.role === 'student') {
				const relevantGradeIds = new Set(
					studentGradesData.filter((sg) => sg.student === user.id).map((sg) => sg.grade),
				)

				filteredGrades = gradesData.filter((grade) => grade.id && relevantGradeIds.has(grade.id))
			}

			if (user?.role === 'student') {
				const relevantGradeIds = new Set(
					studentGradesData.filter((sg) => sg.student === user.id).map((sg) => sg.grade),
				)

				filteredGrades = gradesData.filter((grade) => grade.id && relevantGradeIds.has(grade.id))
			} else if (user?.role === 'teacher') {
				const teacherIdStr = String(user.id)
				const teacherIdNum = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id

				const teacherCoursesStrComp = courseData.filter((course) => {
					if (!course.professor) return false
					const match = String(course.professor.id) === teacherIdStr
					if (match) console.log(`Match string trouvé: Cours ${course.name} (${course.id})`)
					return match
				})

				const teacherCoursesNumComp = courseData.filter((course) => {
					if (!course.professor) return false
					let profId = course.professor.id
					if (typeof profId === 'string') profId = parseInt(profId, 10)
					const match = profId === teacherIdNum
					if (match) console.log(`Match number trouvé: Cours ${course.name} (${course.id})`)
					return match
				})

				let teacherCourses =
					teacherCoursesStrComp.length > 0
						? teacherCoursesStrComp
						: teacherCoursesNumComp.length > 0
							? teacherCoursesNumComp
							: courseData.filter((course) => {
									if (!course.professor) return false
									return course.professor.id == user.id
								})

				if (teacherCourses.length === 0) {
					const allProfIds = new Set()
					courseData.forEach((course) => {
						if (course.professor) allProfIds.add(String(course.professor.id))
					})

					teacherCourses = courseData.filter((course) => {
						if (!course.professor) return false
						const profIdStr = String(course.professor.id)
						const match = [teacherIdStr, String(teacherIdNum)].some((id) => id === profIdStr)
						return match
					})
				}

				const teacherCourseIds = teacherCourses.map((course) => course.id)

				filteredGrades = gradesData.filter((grade) => {
					const gradeStr = String(grade.course)
					const includesStr = teacherCourseIds.map(String).includes(gradeStr)
					const includesObj = teacherCourseIds.includes(grade.course)

					if (includesStr || includesObj) {
						console.log(`Grade inclus: ${grade.id} pour cours ${grade.course}`)
						return true
					}
					return false
				})
			}

			const gradesWithCourses = filteredGrades.map((grade) => {
				const course = courseData.find((course) => course.id === grade.course)
				const gradeStudentGrades = studentGradesData.filter((sg) => sg.grade === grade.id)
				const enrollment = enrollmentsData.find(
					(enrollment) => enrollment.course_id === grade.course,
				)
				const classData = classesData.find((cls) => cls.id === enrollment?.class_group_id)

				return {
					...grade,
					courseName: course ? course.name : 'Matière inconnue',
					studentGrades: gradeStudentGrades,
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
	}, [])

	const fetchClassesAndCourses = async (): Promise<void> => {
		try {
			const [classesData, coursesData] = await Promise.all([getClasses(), getCourses()])
			setClasses(classesData)
			setCourses(coursesData)
		} catch (err) {
			console.error('Erreur lors du chargement des données:', err)
		}
	}

	const getStudentGradesForUser = useCallback(
		(userId: string | number | undefined): GradeWithUser[] => {
			if (!userId) return []
			return grades.filter((grade) => grade.studentGrades?.some((sg) => sg.student === userId))
		},
		[grades],
	)

	const getTeacherGrades = useCallback((): GradeWithUser[] => {
		if (!userSession?.id || userSession.role !== 'teacher' || !courses.length) {
			return []
		}

		const teacherId = userSession.id

		const teacherCourses = courses.filter((course) => course.professor?.id === teacherId)
		const teacherCourseIds = new Set(teacherCourses.map((course) => course.id))

		return grades.filter((grade) => teacherCourseIds.has(grade.course))
	}, [grades, courses, userSession])

	const getTeacherCourses = useCallback((): Course[] => {
		if (!userSession?.id || userSession.role !== 'teacher' || !courses.length) {
			return []
		}

		const teacherId =
			typeof userSession.id === 'string' ? parseInt(userSession.id, 10) : userSession.id

		return courses.filter((course) => course.professor?.id === teacherId)
	}, [courses, userSession])

	const teacherGrades = useMemo(() => getTeacherGrades(), [getTeacherGrades])
	const teacherCourses = useMemo(() => getTeacherCourses(), [getTeacherCourses])

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
		studentGrades,
		getStudentGradesForUser,
		getTeacherGrades,
		getTeacherCourses,
		teacherGrades,
		teacherCourses,
	}
}
