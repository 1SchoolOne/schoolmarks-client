import { components, paths } from '../api-schema'

/* - - - Model - - - */
export type ClassSession = components['schemas']['ClassSession']

/* - - - GET - - - */

export type GetClassSessionsResponse =
	paths['/class_sessions/']['get']['responses']['200']['content']['application/json']
export type GetClassSessionByIdResponse =
	paths['/class_sessions/{id}/']['get']['responses']['200']['content']['application/json']

/* - - - POST - - - */

export type PostClassSessionBody = Omit<ClassSession, 'id'>
export type PostClassSessionResponse =
	paths['/class_sessions/']['post']['responses']['201']['content']['application/json']

/* - - - PUT - - - */

export type PutClassSessionByIdBody = Omit<ClassSession, 'id'>
export type PutClassSessionByIdResponse =
	paths['/class_sessions/{id}/']['put']['responses']['200']['content']['application/json']

/* - - - PATCH - - - */

export type PatchClassSessionByIdBody = Partial<Omit<ClassSession, 'id'>>
export type PatchCheckinSessionByIdResponse =
	paths['/class_sessions/{id}/']['patch']['responses']['200']['content']['application/json']
