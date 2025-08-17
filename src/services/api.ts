import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// interceptor para meter XSRF-TOKEN en todas las peticiones
api.interceptors.request.use((config) => {
  const token = Cookies.get('XSRF-TOKEN')
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers['X-XSRF-TOKEN'] = token;
  }
  return config
})

export default api