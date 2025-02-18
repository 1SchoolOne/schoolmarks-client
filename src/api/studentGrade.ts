import axios from 'axios'

import {
	GetStudentGradeByIdResponse,
	GetStudentGradeResponse,
	PostStudentGradeBody,
} from '@apiSchema/studentGrades'

import { AXIOS_DEFAULT_CONFIG } from './axios'

/* - - - GET - - - */

export async function getStudentGrade(studentGradeId: string) {
	const { data } = await axios.get<GetStudentGradeByIdResponse>(
		`/classes/${studentGradeId}/`,
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}

export async function getStudentGrades() {
	const { data } = await axios.get<GetStudentGradeResponse>(
		'/student_grades/',
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}

/* - - - POST - - - */

export async function postStudentGrade(studentGradeData: PostStudentGradeBody) {
	const { data } = await axios.post<PostStudentGradeBody>(
		'/student_grades/',
		studentGradeData,
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}
