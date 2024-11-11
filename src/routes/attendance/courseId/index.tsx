import { Params } from 'react-router-dom'

import { getCourse } from '@api/courses'

import { Route } from '@types'

import { queryClient } from '../../../main'
import { AttendanceWithModal } from './AttendanceWithModal'

export interface Course {
	id: number
	name: string
}

export const courseRoute: Route = {
	path: 'course/:courseId',
	element: <AttendanceWithModal />,
	loader,
}

export async function loader({ params }: { params: Params }) {
	return queryClient.fetchQuery({
		queryKey: ['courses', params.courseId],
		queryFn: () => getCourse(String(params.courseId)),
	})
}
