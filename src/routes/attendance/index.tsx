import { QueryClient } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'

import { classSessionsQueryOptions, getClassSessionQueryOptions } from '@api/classSessions'

import { Route } from '@types'

import { Attendance } from './Attendance'
import { AttendanceWithModal } from './classSessionId/AttendanceWithModal'

export function getAttendanceRoute(queryClient: QueryClient): Route {
	return {
		path: 'attendance',
		element: <Outlet />,
		handle: {
			crumb: {
				label: 'Assiduité',
				path: 'attendance',
			},
		},
		loader: () => attendanceLoader(queryClient),
		children: [
			{
				index: true,
				element: <Attendance />,
			},
			{
				path: 'class-session/:classSessionId',
				element: <AttendanceWithModal />,
				loader: ({ params }) =>
					classSessionloader({ queryClient, classSessionId: params.classSessionId }),
			},
		],
	}
}

export async function attendanceLoader(queryClient: QueryClient) {
	return queryClient.fetchQuery(classSessionsQueryOptions)
}

export async function classSessionloader(params: {
	queryClient: QueryClient
	classSessionId: string | undefined
}) {
	const { queryClient, classSessionId } = params

	const classSessionQueryOptions = getClassSessionQueryOptions(classSessionId)

	return queryClient.fetchQuery(classSessionQueryOptions)
}
