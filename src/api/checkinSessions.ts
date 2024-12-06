import { CheckinSession, PostCheckinSessionBody } from '../types/api/checkinSessions'
import { axiosInstance } from './axiosInstance'

export const CHECKIN_SESSIONS_API_URL = '/checkin_sessions/'

export function createCheckinSession(values: PostCheckinSessionBody) {
	return axiosInstance.post(CHECKIN_SESSIONS_API_URL, values)
}

export function getCheckinSession(checkinSessionId: string | number) {
	return axiosInstance.get<CheckinSession>(`${CHECKIN_SESSIONS_API_URL}${checkinSessionId}`)
}
