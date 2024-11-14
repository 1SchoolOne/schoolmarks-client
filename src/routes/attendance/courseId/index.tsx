import { QueryClient } from '@tanstack/react-query'

import { getCourse } from '@api/courses'

import { Route } from '@types'

import { AttendanceWithModal } from './AttendanceWithModal'

export function getCourseRoute(queryClient: QueryClient): Route {
	return {
		path: 'course/:courseId',
		element: <AttendanceWithModal />,
		loader: ({ params }) => classSessionloader({ queryClient, courseId: params.courseId }),
	}
}

export async function classSessionloader(params: {
	queryClient: QueryClient
	courseId: string | undefined
}) {
	const { queryClient, courseId } = params

	return queryClient.fetchQuery({
		queryKey: ['courses', courseId],
		queryFn: () => getCourse(String(courseId)),
	})
}
