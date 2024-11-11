import axios from 'axios'

import { getCookie } from '@utils/getCookie'

const API_HOST = import.meta.env.VITE_API_HOST

const axiosInstance = axios.create({
	baseURL: API_HOST ?? 'http://127.0.0.1:8000',
	withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
	const token = getCookie('csrftoken')

	if (token.length > 0) {
		config.headers['X-CSRFToken'] = token
	}

	return config
})

export { axiosInstance }
