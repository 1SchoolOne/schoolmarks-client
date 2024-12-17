import { QueryClient } from '@tanstack/react-query'
import { redirect } from 'react-router-dom'

import { getAttendanceRecords } from '@api/attendanceRecords'
import { getSession } from '@api/auth'
import { axiosInstance } from '@api/axiosInstance'
import { CLASS_SESSIONS_API_URL } from '@api/classSessions'

import { Route } from '@types'

import { ClassSessionDetail } from '../../types/api/classSessions'
import { RegisterAttendance } from './RegisterAttendance'
import { RegisterError } from './RegisterError'

export function getRegisterAttendanceRoute(queryClient: QueryClient): Route {
	return {
		path: 'register-attendance/:checkinSessionId',
		element: <RegisterAttendance />,
		errorElement: <RegisterError />,
		loader: async ({ params }) => {
			const session = await queryClient.fetchQuery({
				queryKey: ['auth-status'],
				queryFn: getSession,
			})

			if (session.data.user?.role !== 'student') {
				return redirect('/app')
			}

			return registerAttendanceLoader(queryClient, params.checkinSessionId)
		},
	}
}

export async function registerAttendanceLoader(
	queryClient: QueryClient,
	checkinSessionId: string | undefined,
) {
	const [classSession, attendance] = await Promise.all([
		queryClient.fetchQuery({
			queryKey: ['classSession', { checkinSessionId: checkinSessionId }],
			queryFn: async () => {
				const { data } = await axiosInstance.get<ClassSessionDetail>(
					`${CLASS_SESSIONS_API_URL}?checkin_session_id=${checkinSessionId}`,
				)
				return data
			},
		}),
		queryClient.fetchQuery({
			queryKey: ['attendanceRecords', checkinSessionId],
			queryFn: async () => {
				const records = await getAttendanceRecords()

				return records.filter((a) => a.checkin_session === checkinSessionId)[0] ?? null
			},
		}),
	])

	return { classSession, attendance }
}
