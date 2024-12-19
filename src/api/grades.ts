import axios from 'axios'

import { GetGradesResponse, Grade } from '../types/api/grades'
import { GetUsersResponse, User } from '../types/api/users'
import { AXIOS_DEFAULT_CONFIG } from './axios'

export const GRADES_API_URL = '/grades/'

export async function getGrades(): Promise<Grade[]> {
	const { data } = await axios.get<GetGradesResponse>(GRADES_API_URL, AXIOS_DEFAULT_CONFIG)
	return Array.isArray(data) ? data : [data]
}

export const USERS_API_URL = '/users/'

export async function getUsers(): Promise<User[]> {
	const { data } = await axios.get<GetUsersResponse>(USERS_API_URL, AXIOS_DEFAULT_CONFIG)
	return Array.isArray(data) ? data : [data]
}
