import { Outlet } from 'react-router-dom'

import { Route } from '@types'

import { GradesTeacher } from './componants/GradesTeacher'

export const gradesRoute: Route = {
	path: 'grades',
	element: <Outlet />,
	handle: {
		crumb: {
			label: 'Notes',
			path: 'grades',
		},
	},
	children: [
		{
			index: true,
			element: <GradesTeacher />,
		},
	],
}
