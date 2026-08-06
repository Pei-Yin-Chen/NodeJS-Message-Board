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
  isFetching: boolean
  error: string | null
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

export const useMessageStore = create<IMessageState>((set, get) => ({
  messages: [],
  isFetching: false,
  error: null,

  fetchMessages: async () => {
    if (get().isFetching) return

    set((state) => ({
      isFetching: true,
      error: null,
      // 已有快取時不先清空，避免閃爍
      messages: state.messages,
    }))

    try {
      const res = await api.get('/messages')
      set({ messages: res.data, isFetching: false })
    } catch (err: any) {
      set({
        error: err.response?.data?.message || '無法載入留言',
        isFetching: false,
      })
    }
  },

  addMessage: async (content: string) => {
    try {
      const res = await api.post('/messages', { content })
      const newMessage = res.data
      set((state) => ({
        messages: [newMessage, ...state.messages],
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
