import { create } from 'zustand'
import api from '../api/axiosInstance'

interface IMessage {
  _id: string
  content: string
  user: {
    username: string
  }
  createdAt: string
  updatedAt: string
}

interface IMessageState {
  messages: IMessage[]
  loading: boolean
  error: string | null
  // Actions
  fetchMessages: () => Promise<void>
  addMessage: (
    content: string,
  ) => Promise<{ success: boolean; message?: string }>
  updateMessage: (
    id: string,
    content: string,
  ) => Promise<{ success: boolean; message?: string }>
  deleteMessage: (id: string) => Promise<{ success: boolean; message?: string }>
}

export const useMessageStore = create<IMessageState>((set) => ({
  messages: [],
  loading: false,
  error: null,

  // 取得所有留言
  fetchMessages: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/messages')
      set({ messages: res.data, loading: false })
    } catch (err: any) {
      set({
        error: err.response?.data?.message || '無法載入留言',
        loading: false,
      })
    }
  },

  // 新增留言 (順便更新狀態，讓 UI 即時反映)
  addMessage: async (content: string) => {
    try {
      const res = await api.post('/messages', { content })
      const newMessage = res.data
      set((state) => ({
        messages: [newMessage, ...state.messages], // 把新留言放在最上面
      }))
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || '發布失敗',
      }
    }
  },

  updateMessage: async (id: string, content: string) => {
    try {
      const res = await api.put(`/messages/${id}`, { content })
      const updatedData = res.data

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === id ? updatedData : msg,
        ),
      }))
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data.message || '更新失敗',
      }
    }
  },

  deleteMessage: async (id: string) => {
    try {
      await api.delete(`/messages/${id}`)

      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== id),
      }))
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || '刪除失敗',
      }
    }
  },
}))
