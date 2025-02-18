import { Outlet } from 'react-router-dom'

import { Route } from '@types'

import { EvaluationPage } from './EvaluationPage'
import { Grades } from './Grades'

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
			element: <Grades />,
		},
		{
			path: 'evaluation/new',
			element: <EvaluationPage />,
		},
	],
}
