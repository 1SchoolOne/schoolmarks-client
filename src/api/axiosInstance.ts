import axios, { isAxiosError } from 'axios'

import { localStorage } from '@utils/localStorage'

import { refreshToken } from './token'

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_HOST ?? 'http://127.0.0.1:8000',
})

/** Ajoute l'header "Authorization" à chaque requête si le token d'accès existe */
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.get('accessToken')

		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}

		return config
	},
	(error) => Promise.reject(error),
)

/** Rafraîchit le token d'accès en cas d'erreur 401 */
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest._stop &&
			originalRequest.url !== '/token/'
		) {
			originalRequest._retry = true
			originalRequest._stop = true

			try {
				const reToken = localStorage.get('refreshToken')

				if (!reToken) {
					throw 'No refresh token'
				}

				const response = await refreshToken(reToken)

				const { access, refresh } = response.data

				localStorage.setAll({ accessToken: access, refreshToken: refresh })

				originalRequest.headers.Authorization = `Bearer ${access}`

				return axios(originalRequest)
			} catch (err) {
				if (isAxiosError(err)) {
					localStorage.setAll({ accessToken: null, refreshToken: null })
					window.location.replace('/authenticate?notify=session_expired')
				}

				if (err === 'No refresh token') {
					window.location.replace('/authenticate')
				}

				throw err
			}
		}

		return Promise.reject(error)
	},
)

export { axiosInstance }
