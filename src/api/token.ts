import { axiosInstance } from './axiosInstance'

export interface Credentials {
	username: string
	password: string
}

interface GetTokenResponse {
	refresh: string
	access: string
}
/**
 * Retourne un token d'accès et un token de rafraîchissement en cas de succès.
 *
 * @param credentials - Nom d'utilisateur et mot de passe
 */
export function getToken(credentials: Credentials) {
	return axiosInstance.postForm<GetTokenResponse>('/token/', credentials)
}

export function refreshToken(refreshToken: string) {
	return axiosInstance.post<GetTokenResponse>('/token/refresh/', { refresh: refreshToken })
}
