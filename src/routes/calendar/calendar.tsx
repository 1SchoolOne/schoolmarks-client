import { Route } from '@types'

export const calendarRoute: Route = {
	path: 'calendar',
	element: 'Calendrier',
	handle: {
		crumb: {
			label: 'Calendrier',
			path: 'calendar',
		},
	},
}
