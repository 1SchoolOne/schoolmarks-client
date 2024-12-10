import { Route } from '@types'

import { Calendar } from './Calendar'

export const calendarRoute: Route = {
	path: 'calendar',
	element: <Calendar />,
	handle: {
		crumb: {
			label: 'Calendrier',
			path: 'calendar',
		},
	},
}
