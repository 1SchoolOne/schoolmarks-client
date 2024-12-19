import axios from 'axios'

import { AXIOS_DEFAULT_CONFIG } from './axios'

export interface Course {
	id: string
	name: string
	code: string
	professor: string
	created_at: string
	updated_at: string
}

export async function getCourse(courseId: string) {
	const { data } = await axios.get<Course>(`/courses/${courseId}/`, AXIOS_DEFAULT_CONFIG)
	return data
}

export async function getCourses() {
	const { data } = await axios.get<Array<Course>>('/courses/', AXIOS_DEFAULT_CONFIG)
	return data
}
