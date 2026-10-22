import axios from 'axios'

// 自動抓取當前瀏覽器網址的「協定」與「網域」
// 如果目前網址是 https://localhost -> 就發往 https://localhost/api
// 如果目前網址是 http://localhost   -> 就發往 http://localhost/api
// 如果是舊的開發模式 http://localhost:5173 -> 就發往舊的 http://localhost:5000/api

export const getCurrentBaseURL = () => {
  const { protocol, hostname, port } = window.location;
  
  // 情況 A：如果是在舊的 Vite 直連環境下開發 (port 是 5173)
  if (port === '5173') {
    return 'http://localhost:5000/api'; 
  }
  
  // 情況 B：如果是走 Nginx 大門 (不管是 http 還是 https)
  return `${protocol}//${hostname}/api`;
};

const api = axios.create({
  baseURL: getCurrentBaseURL(),
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
