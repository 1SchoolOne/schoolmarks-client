import axios from 'axios'

const API_HOST = import.meta.env.VITE_API_HOST

const axiosInstance = axios.create({
	baseURL: API_HOST ?? 'http://127.0.0.1:8000',
	withCredentials: true,
})

export { axiosInstance }
