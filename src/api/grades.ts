import axios from 'axios'

import { Class } from '@apiSchema/classes'
import { CourseEnrollment } from '@apiSchema/courseEnrollments'
import { Course } from '@apiSchema/courses'
import {
	GetGradeByIdResponse,
	GetGradesResponse,
	PostGradeBody,
	PostGradeResponse,
} from '@apiSchema/grades'
import { StudentGrade } from '@apiSchema/studentGrade'
import { GetUsersResponse } from '@apiSchema/users'

import { AXIOS_DEFAULT_CONFIG } from './axios'

/* - - - GET - - - */

export async function getGrade(gradeId: string) {
	const { data } = await axios.get<GetGradeByIdResponse>(
		`/grades/${gradeId}/`,
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}

export async function getGrades() {
	const { data } = await axios.get<GetGradesResponse>('/grades/', AXIOS_DEFAULT_CONFIG)
	return data
}

export async function getUsers() {
	const { data } = await axios.get<GetUsersResponse>(`/users/`, AXIOS_DEFAULT_CONFIG)
	return data
}

/* - - - POST - - - */

export async function postGrade(GradeData: PostGradeBody) {
	const { data } = await axios.post<PostGradeResponse>('/grades/', GradeData, AXIOS_DEFAULT_CONFIG)
	return data
}

export const COURSES_API_URL = '/courses/'

export async function getCourses(): Promise<Course[]> {
	const { data } = await axios.get<Course[]>(COURSES_API_URL, AXIOS_DEFAULT_CONFIG)
	return Array.isArray(data) ? data : [data]
}

export const CLASSES_API_URL = '/classes/'

export async function getClasses(): Promise<Class[]> {
	const { data } = await axios.get<Class[]>(CLASSES_API_URL, AXIOS_DEFAULT_CONFIG)
	return Array.isArray(data) ? data : [data]
}

export const STUDENT_GRADES_API_URL = '/student_grades/' // Corrected URL
export const COURSE_ENROLLMENTS_API_URL = '/course_enrollments/' // Corrected URL

export async function getStudentGrades(): Promise<StudentGrade[]> {
	const { data } = await axios.get<StudentGrade[]>(STUDENT_GRADES_API_URL, AXIOS_DEFAULT_CONFIG)
	return Array.isArray(data) ? data : [data]
}

export async function getCourseEnrollments(): Promise<CourseEnrollment[]> {
	const { data } = await axios.get<CourseEnrollment[]>(
		COURSE_ENROLLMENTS_API_URL,
		AXIOS_DEFAULT_CONFIG,
	)
	return Array.isArray(data) ? data : [data]
}
