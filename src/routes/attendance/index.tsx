import { QueryClient } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'

import { getCourses } from '@api/courses'

import { Route } from '@types'

import { Attendance } from './Attendance'
import { getCourseRoute } from './courseId'

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
		children: [
			{ index: true, element: <Attendance />, loader: () => attendanceLoader(queryClient) },
			getCourseRoute(queryClient),
		],
	}
}

export async function attendanceLoader(queryClient: QueryClient) {
	return queryClient.fetchQuery({
		queryKey: ['courses'],
		queryFn: getCourses,
	})
}
