import axios from 'axios'

import { GetCourseByIdResponse, GetCoursesResponse } from '@apiSchema/courses'

import { AXIOS_DEFAULT_CONFIG } from './axios'

/* - - - GET - - - */

export async function getCourse(courseId: string) {
	const { data } = await axios.get<GetCourseByIdResponse>(
		`/courses/${courseId}/`,
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}

export async function getCourses() {
	const { data } = await axios.get<GetCoursesResponse>('/courses/', AXIOS_DEFAULT_CONFIG)
	return data
}
