import { create } from 'zustand'
import api from '../api/axiosInstance'

interface IUser {
  id: string
  username: string
  email: string
  createdAt?: string
}

interface ILoginCredentials {
  email: string
  password?: string // OAuth 登入可能不需要 password
}

interface IRegisterData extends ILoginCredentials {
  username: string
}

interface IAuthError {
  message: string
  code?: string
}

interface IAuthState {
  user: IUser | null
  isInitialized: boolean
  checkAuth: () => Promise<void>
  registerAction: (
    userData: IRegisterData,
  ) => Promise<{ success: boolean; error?: IAuthError }>
  loginAction: (
    credentials: ILoginCredentials,
  ) => Promise<{ success: boolean; error?: IAuthError }>
  logout: () => Promise<void>
}

export const useAuthStore = create<IAuthState>((set) => ({
  user: null, // 初始值為 null，等 App 啟動後去打 API 拿最新的
  isInitialized: false,

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me')
      set({
        user: res.data.user,
        isInitialized: true,
      })
    } catch {
      set({
        user: null,
        isInitialized: true,
      })
    }
  },

  registerAction: async (userData) => {
    try {
      await api.post('/auth/register', userData)
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || '註冊失敗',
      }
    }
  },

  loginAction: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials)
      set({
        user: res.data.user,
        isInitialized: true,
      })
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || '登入失敗，請稍後再試',
      }
    }
  },

  logout: async () => {
    // 登出時清空狀態
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout API failed', err)
    } finally {
      set({ user: null, isInitialized: true })
      // 注意：後端清除 Cookie (Set-Cookie: token=; Max-Age=0)，前端只要清空狀態
    }
  },
}))
