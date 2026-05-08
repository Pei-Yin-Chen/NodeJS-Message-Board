import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// 請求攔截器：自動帶入 Token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default api
