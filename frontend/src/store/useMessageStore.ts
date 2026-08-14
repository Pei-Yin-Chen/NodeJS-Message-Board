import { create } from 'zustand'
import api from '../api/axiosInstance'
const PAGE_SIZE = 10

interface IMessage {
  _id: string
  content: string
  user: {
    _id: string
    username: string
  }
  createdAt: string
  updatedAt: string
}

interface IMessagePageResponse {
  messages: IMessage[]
  nextCursor: string | null
  hasMore: boolean
}

interface IMessageState {
  messages: IMessage[]
  isFetching: boolean
  error: string | null
  nextCursor: string | null
  hasMore: boolean
  isLoadingMore: boolean
  newMessagesAvailable: boolean
  checkForNewMessages: () => Promise<void>
  loadMoreMessages: () => Promise<void>
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
  nextCursor: null,
  hasMore: false,
  isLoadingMore: false,
  newMessagesAvailable: false,

  checkForNewMessages: async () => {
    const { messages, isFetching, isLoadingMore } = get()

    if (messages.length === 0) return
    if (isFetching || isLoadingMore) return
    try {
      const res = await api.get<IMessagePageResponse>('/messages', {
        params: { limit: 1 },
      })

      const serverTopId = res.data.messages[0]?._id
      const localTopId = messages[0]?._id

      set({
        newMessagesAvailable: Boolean(serverTopId && serverTopId !== localTopId),
      })
    } catch {
      set({ newMessagesAvailable: false })
    }
  },

  loadMoreMessages: async () => {
    const { hasMore, isLoadingMore, nextCursor, isFetching } = get()

    if (!hasMore || isLoadingMore || !nextCursor || isFetching) return

    set({ isLoadingMore: true, error: null })

    try {
      const res = await api.get<IMessagePageResponse>('/messages', {
        params: { limit: PAGE_SIZE, cursor: nextCursor },
      })

      const { messages, nextCursor: newCursor, hasMore: more } = res.data

      set((state) => ({
        messages: [...state.messages, ...messages],
        nextCursor: newCursor,
        hasMore: more,
        isLoadingMore: false,
      }))
    } catch (err: any) {
      set({
        error: err.response?.data?.message || '無法載入更多留言',
        isLoadingMore: false,
      })
    }
  },

  fetchMessages: async () => {
    if (get().isFetching) return

    set((state) => ({
      isFetching: true,
      error: null,
      // 已有快取時不先清空，避免閃爍
      messages: state.messages,
    }))

    try {
      const res = await api.get<IMessagePageResponse>('/messages', {
        params: { limit: PAGE_SIZE },
      })

      const { messages, nextCursor, hasMore } = res.data

      set({
        messages,
        nextCursor,
        hasMore,
        isFetching: false,
        newMessagesAvailable: false,
      })
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
        newMessagesAvailable: false,
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
