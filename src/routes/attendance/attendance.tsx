import { Route } from '@types'

export const attendanceRoute: Route = {
	path: 'attendance',
	element: 'Assiduité',
	handle: {
		crumb: {
			label: 'Assiduité',
			path: 'attendance',
		},
	},
}
