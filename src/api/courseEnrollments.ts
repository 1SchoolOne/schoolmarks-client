import axios from 'axios'

import {
	GetCourseEnrollmentByIdResponse,
	GetCourseEnrollmentsResponse,
} from '@apiSchema/courseEnrollments'

import { AXIOS_DEFAULT_CONFIG } from './axios'

/* - - - GET - - - */

export async function getCourseEnrollment(courseEnrollmentsId: string) {
	const { data } = await axios.get<GetCourseEnrollmentByIdResponse>(
		`/course_enrollments/${courseEnrollmentsId}/`,
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}

export async function getCourseEnrollments() {
	const { data } = await axios.get<GetCourseEnrollmentsResponse>(
		'/course_enrollments/',
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}
