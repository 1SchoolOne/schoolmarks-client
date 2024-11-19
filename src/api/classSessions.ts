import { GetClassSessionByIdResponse, GetClassSessionsResponse } from '../types/api/classSessions'
import { axiosInstance } from './axiosInstance'

export const CLASS_SESSIONS_API_URL = '/class_sessions/'

export async function getClassSessions() {
	const { data } = await axiosInstance.get<GetClassSessionsResponse>(CLASS_SESSIONS_API_URL)
	return data
}

export async function getClassSession(classSessionId: string) {
	const { data } = await axiosInstance.get<GetClassSessionByIdResponse>(
		`${CLASS_SESSIONS_API_URL}${classSessionId}/`,
	)
	return data
}
