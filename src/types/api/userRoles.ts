import { components, paths } from '../api-schema'

/* - - - Model - - - */
export type UserRole = components['schemas']['UserRole']

/* - - - GET - - - */

export type GetUserRolesResponse =
	paths['/user_roles/']['get']['responses']['200']['content']['application/json']
export type GetUserRoleByIdResponse =
	paths['/user_roles/{id}/']['get']['responses']['200']['content']['application/json']

/* - - - POST - - - */

export type PostUserRoleBody = Omit<UserRole, 'id'>
export type PostUserRoleResponse =
	paths['/user_roles/']['post']['responses']['201']['content']['application/json']

/* - - - PUT - - - */

export type PutUserRoleByIdBody = Omit<UserRole, 'id'>
export type PutUserRoleByIdResponse =
	paths['/user_roles/{id}/']['put']['responses']['200']['content']['application/json']

/* - - - PATCH - - - */

export type PatchUserRoleByIdBody = Partial<Omit<UserRole, 'id'>>
export type PatchUserRoleByIdResponse =
	paths['/user_roles/{id}/']['patch']['responses']['200']['content']['application/json']
