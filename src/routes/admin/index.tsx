import { QueryClient } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'

import { getClassById, getClasses } from '@api/classes'
import { getCourseEnrollments } from '@api/courseEnrollments'
import { getCourseById, getCourses } from '@api/courses'
import { getUsers } from '@api/users'

import { ProtectedRoute } from '@components'

import { Route } from '@types'

import { AddStudents } from './classes/AddStudents'
import { ClassAdminTable } from './classes/ClassAdminTable'
import { CreateClass } from './classes/CreateClass'
import { EditClassModal } from './classes/EditClassModal'
import { EnrollCourses } from './classes/EnrollCourses'
import { CourseAdminTable } from './courses/CourseAdminTable'
import { CreateCourse } from './courses/CreateCourse'
import { EditCourseModal } from './courses/EditCourseModal'
import { UserAdminTable } from './users/UserAdminTable'

export function getAdminRoute(queryClient: QueryClient): Route {
	return {
		path: 'admin',
		element: (
			<ProtectedRoute restrictedTo={['admin']}>
				<Outlet />
			</ProtectedRoute>
		),
		handle: {
			crumb: {
				label: 'Administration',
				path: 'admin',
				disabled: true,
			},
		},
		children: [
			{ index: true, element: <Navigate to="/app/admin/users" /> },
			{
				path: 'users',
				loader: () => userAdminTableLoader(queryClient),
				element: <UserAdminTable />,
				handle: {
					crumb: {
						label: 'Utilisateurs',
						path: 'users',
					},
				},
			},
			{
				path: 'classes',
				loader: () => classAdminTableLoader(queryClient),
				handle: {
					crumb: {
						label: 'Classes',
						path: 'classes',
					},
				},
				children: [
					{
						index: true,
						element: <ClassAdminTable />,
					},
					{
						path: 'new',
						loader: () => studentsLoader(queryClient),
						element: <CreateClass />,
					},
					{
						path: 'edit/:classId',
						loader: ({ params }) => classLoader({ queryClient, classId: params.classId }),
						element: (
							<>
								<ClassAdminTable />
								<EditClassModal />
							</>
						),
					},
					{
						path: ':classId/add-students',
						loader: ({ params }) => classLoader({ queryClient, classId: params.classId }),
						element: <AddStudents />,
					},
					{
						path: ':classId/enroll-courses',
						loader: ({ params }) => classCoursesLoader({ queryClient, classId: params.classId }),
						element: <EnrollCourses />,
						errorElement: <EnrollCourses.ErrorBoundary />,
					},
				],
			},
			{
				path: 'courses',
				loader: () => coursesLoader(queryClient),
				element: <Outlet />,
				handle: {
					crumb: {
						label: 'Cours',
						path: 'courses',
					},
				},
				children: [
					{
						index: true,
						element: <CourseAdminTable />,
					},
					{
						path: 'new',
						loader: () => teachersLoader(queryClient),
						element: <CreateCourse />,
					},
					{
						path: 'edit/:courseId',
						loader: ({ params }) => editCourseLoader({ queryClient, courseId: params.courseId }),
						element: (
							<>
								<CourseAdminTable />
								<EditCourseModal />
							</>
						),
					},
				],
			},
		],
	}
}

export function userAdminTableLoader(queryClient: QueryClient) {
	return queryClient.fetchQuery({
		queryKey: ['users'],
		queryFn: () => getUsers(),
	})
}

export function classAdminTableLoader(queryClient: QueryClient) {
	return queryClient.fetchQuery({
		queryKey: ['classes'],
		queryFn: getClasses,
	})
}

export function studentsLoader(queryClient: QueryClient) {
	return queryClient.fetchQuery({
		queryKey: ['users', { role: 'student' }],
		queryFn: () => getUsers({ role: 'student' }),
	})
}

export function classLoader(params: { queryClient: QueryClient; classId: string | undefined }) {
	const { queryClient, classId } = params

	if (!classId) throw new Error('classId is undefined')

	return queryClient.fetchQuery({
		queryKey: ['class', classId],
		queryFn: () => getClassById(classId),
	})
}

export async function classCoursesLoader(params: {
	queryClient: QueryClient
	classId: string | undefined
}) {
	const { queryClient, classId } = params

	if (!classId) throw new Error('classId is undefined')

	const [courseEnrollments, courses] = await Promise.all([
		queryClient.fetchQuery({
			queryKey: ['courses', classId],
			queryFn: () => getCourseEnrollments({ class_group: classId }),
		}),
		queryClient.fetchQuery({
			queryKey: ['courses'],
			queryFn: getCourses,
		}),
	])

	return { courses, courseEnrollments }
}

export function coursesLoader(queryClient: QueryClient) {
	return queryClient.fetchQuery({
		queryKey: ['courses'],
		queryFn: getCourses,
	})
}

export function teachersLoader(queryClient: QueryClient) {
	return queryClient.fetchQuery({
		queryKey: ['users', { role: 'teacher' }],
		queryFn: () => getUsers({ role: 'teacher' }),
	})
}

export async function editCourseLoader(params: {
	queryClient: QueryClient
	courseId: string | undefined
}) {
	const { queryClient, courseId } = params

	if (!courseId) throw new Error('courseId is undefined')

	const [course, teachers] = await Promise.all([
		queryClient.fetchQuery({
			queryKey: ['courses', courseId],
			queryFn: () => getCourseById(courseId),
		}),
		queryClient.fetchQuery({
			queryKey: ['users', { role: 'teacher' }],
			queryFn: () => getUsers({ role: 'teacher' }),
		}),
	])

	return { course, teachers }
}
