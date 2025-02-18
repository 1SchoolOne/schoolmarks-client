import axios from 'axios'

import { GetUserByIdResponse, GetUsersResponse } from '@apiSchema/users'

import { AXIOS_DEFAULT_CONFIG } from './axios'

/* - - - GET - - - */

export async function getUser(userId: string) {
	const { data } = await axios.get<GetUserByIdResponse>(`/users/${userId}/`, AXIOS_DEFAULT_CONFIG)
	return data
}

export async function getUsers(classId?: string) {
	const { data } = await axios.get<GetUsersResponse>(
		`/users/?role=student${classId ? `&class_id=${classId}` : ''}`,
		AXIOS_DEFAULT_CONFIG,
	)
	return data
}
