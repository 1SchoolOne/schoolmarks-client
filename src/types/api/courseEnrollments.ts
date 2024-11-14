import { components, paths } from '../api-schema'

/* - - - Model - - - */
export type CourseEnrollment = components['schemas']['CourseEnrollment']

/* - - - GET - - - */

export type GetCourseEnrollmentsResponse =
	paths['/course_enrollments/']['get']['responses']['200']['content']['application/json']
export type GetCourseEnrollmentByIdResponse =
	paths['/course_enrollments/{id}/']['get']['responses']['200']['content']['application/json']

/* - - - POST - - - */

export type PostCourseEnrollmentBody = Omit<CourseEnrollment, 'id'>
export type PostCourseEnrollmentResponse =
	paths['/course_enrollments/']['post']['responses']['201']['content']['application/json']

/* - - - PUT - - - */

export type PutCourseEnrollmentByIdBody = Omit<CourseEnrollment, 'id'>
export type PutCourseEnrollmentByIdResponse =
	paths['/course_enrollments/{id}/']['put']['responses']['200']['content']['application/json']

/* - - - PATCH - - - */

export type PatchCourseEnrollmentByIdBody = Partial<Omit<CourseEnrollment, 'id'>>
export type PatchCourseEnrollmentByIdResponse =
	paths['/course_enrollments/{id}/']['patch']['responses']['200']['content']['application/json']
