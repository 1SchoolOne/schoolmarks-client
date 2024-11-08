import axios from 'axios'

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_HOST ?? 'http://127.0.0.1:8000',
})

export { axiosInstance }
