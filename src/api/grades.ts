import axios from 'axios'

import { GetGradeByIdResponse, GetGradesResponse, PostGradeBody } from '@apiSchema/grades'
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
	const { data } = await axios.post<PostGradeBody>('/grades/', GradeData, AXIOS_DEFAULT_CONFIG)
	return data
}
