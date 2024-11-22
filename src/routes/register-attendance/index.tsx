import { axiosInstance } from '@api/axiosInstance'

import { Route } from '@types'

import { PostAttendanceRecordResponse } from '../../types/api/attendanceRecords'
import { RegisterAttendance } from './RegisterAttendance'
import { RegisterError } from './RegisterError'

export const registerAttendanceRoute: Route = {
	path: 'register-attendance/:checkinSessionId',
	element: <RegisterAttendance />,
	errorElement: <RegisterError />,
	loader: ({ params }) => registerAttendanceLoader(params.checkinSessionId),
}

export async function registerAttendanceLoader(checkinSessionId: string | undefined) {
	const uuidRegex = new RegExp(
		/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
	)

	if (!uuidRegex.test(String(checkinSessionId))) {
		throw Error('checkinSessionId is not a valid UUID')
	}

	const { data } = await axiosInstance.post<PostAttendanceRecordResponse>(`/attendance_records/`, {
		checkin_session_id: checkinSessionId,
	})

	return data
}
