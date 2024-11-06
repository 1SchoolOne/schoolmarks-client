import { Route } from '@types'

export const gradesRoute: Route = {
	path: 'grades',
	element: 'Notes',
	handle: {
		crumb: {
			label: 'Notes',
			path: 'grades',
		},
	},
}
