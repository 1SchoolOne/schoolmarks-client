import axios from 'axios'

import { GetClassByIdResponse, GetClassesResponse } from '@apiSchema/classes'

import { AXIOS_DEFAULT_CONFIG } from './axios'

/* - - - GET - - - */

export async function getClasse(classId: string) {
	const { data } = await axios.get<GetClassByIdResponse>(
		`/classes/${classId}/`,
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}

export async function getClasses() {
	const { data } = await axios.get<GetClassesResponse>('/classes/', AXIOS_DEFAULT_CONFIG)
	return data
}
