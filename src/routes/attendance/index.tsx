import { Outlet } from 'react-router-dom'

import { getCourses } from '@api/courses'

import { Route } from '@types'

import { queryClient } from '../../main'
import { Attendance } from './Attendance'
import { courseRoute } from './courseId'

export const attendanceRoute: Route = {
	path: 'attendance',
	element: <Outlet />,
	handle: {
		crumb: {
			label: 'Assiduité',
			path: 'attendance',
		},
	},
	children: [{ index: true, element: <Attendance />, loader }, courseRoute],
}

export async function loader() {
	return queryClient.fetchQuery({
		queryKey: ['courses'],
		queryFn: getCourses,
	})
}
