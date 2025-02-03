import { Outlet } from 'react-router-dom'

import { Route } from '@types'

import { Calendar } from './Calendar'

export const calendarRoute: Route = {
	path: 'calendar',
	element: <Outlet />,
	handle: {
		crumb: {
			label: 'Calendrier',
			path: 'calendar',
		},
	},
	children: [
		{
			index: true,
			element: <Calendar />,
		},
	],
}
