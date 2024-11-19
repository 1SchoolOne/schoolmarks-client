import { PostCheckinSessionBody } from '../types/api/checkinSessions'
import { axiosInstance } from './axiosInstance'

const CHECKIN_SESSIONS_API_URL = '/checkin_sessions/'

export function createCheckinSession(values: PostCheckinSessionBody) {
	return axiosInstance.post(CHECKIN_SESSIONS_API_URL, values)
}
