import { GetAttendanceRecordsResponse } from '../types/api/attendanceRecords'
import { axiosInstance } from './axiosInstance'

export const ATTENDANCE_RECORDS_API_URL = '/attendance_records/'

export async function getAttendanceRecords() {
	const { data } = await axiosInstance.get<GetAttendanceRecordsResponse>(ATTENDANCE_RECORDS_API_URL)
	return data
}
