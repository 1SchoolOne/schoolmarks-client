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

import { GradeWithUser } from './useGradesData'

interface FilterParams {
	subject?: string
	class?: string
	month?: string
	year?: string
}

let cachedData: {
	grades: Grade[]
	courses: Course[]
	studentGrades: StudentGrade[]
	enrollments: CourseEnrollment[]
	classes: Class[]
	timestamp: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000

const fetchDataWithCache = async () => {
	const now = Date.now()

	if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
		return cachedData
	}

	const [grades, courses, studentGrades, enrollments, classes] = await Promise.all([
		getGrades(),
		getCourses(),
		getStudentGrades(),
		getCourseEnrollments(),
		getClasses(),
	])

	cachedData = {
		grades,
		courses,
		studentGrades,
		enrollments,
		classes,
		timestamp: now,
	}

	return cachedData
}

export const filterGrades = async (filters: FilterParams): Promise<GradeWithUser[]> => {
	const { grades, courses, studentGrades, enrollments, classes } = await fetchDataWithCache()

	const gradesWithData = grades.map((grade) => {
		const course = courses.find((course) => course.id === grade.course)
		const gradeStudentGrades = studentGrades.filter((sg) => sg.grade === grade.id)
		const enrollment = enrollments.find((enrollment) => enrollment.course_id === grade.course)
		const classData = classes.find((cls) => cls.id === enrollment?.class_group_id)

		return {
			...grade,
			courseName: course ? course.name : 'Matière inconnue',
			studentGrades: gradeStudentGrades,
			className: classData ? classData.name : 'Classe inconnue',
		}
	})

	return gradesWithData.filter((grade) => {
		if (filters.subject && grade.courseName !== filters.subject) {
			return false
		}

		if (filters.class && grade.className !== filters.class) {
			return false
		}

		if (filters.month) {
			if (!grade.created_at) return false

			const gradeDate = new Date(grade.created_at)
			const monthNames = [
				'Janvier',
				'Février',
				'Mars',
				'Avril',
				'Mai',
				'Juin',
				'Juillet',
				'Aout',
				'Septembre',
				'Octobre',
				'Novembre',
				'Décembre',
			]

			if (monthNames[gradeDate.getMonth()] !== filters.month) {
				return false
			}
		}

		if (filters.year) {
			if (!grade.created_at) return false

			const gradeDate = new Date(grade.created_at)
			if (gradeDate.getFullYear().toString() !== filters.year) {
				return false
			}
		}

		return true
	})
}
