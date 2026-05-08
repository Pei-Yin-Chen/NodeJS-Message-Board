import { create } from 'zustand'
import api from '../api/axiosInstance'

interface IUser {
  id: string
  username: string
  email: string
}

interface IAuthState {
  user: IUser | null
  isInitialized: boolean
  setUser: (user: IUser | null) => void
  registerAction: (userData: any) => Promise<{ success: boolean; error?: any }>
  loginAction: (credentials: any) => Promise<{ success: boolean; error?: any }>
  logout: () => Promise<void>
}

export const useAuthStore = create<IAuthState>((set) => ({
  user: null, // 初始值為 null，等 App 啟動後去打 API 拿最新的
  isInitialized: false,

  registerAction: async (userData) => {
    try {
      await api.post('/auth/register', userData)
      return { success: true }
    } catch (err) {
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
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || '登入失敗，請稍後再試',
      }
    }
  },

  setUser: (user) =>
    set({
      user,
      isInitialized: true,
    }),

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
