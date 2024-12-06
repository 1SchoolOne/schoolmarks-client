import { axiosInstance } from './axiosInstance'

export interface Course {
	id: string
	name: string
	code: string
	professor: string
	created_at: string
	updated_at: string
}

export async function getCourse(courseId: string) {
	const { data } = await axiosInstance.get<Course>(`/courses/${courseId}/`)
	return data
}

export async function getCourses() {
	const { data } = await axiosInstance.get<Array<Course>>('/courses/')
	return data
}
