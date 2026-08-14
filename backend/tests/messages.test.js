const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const Message = require('../models/Message')
const { registerAndLogin } = require('./helpers')

async function seedMessages() {
  const user = await User.create({
    email: 'alice@test.com',
    username: 'alice',
    password: 'hashed-password',
  })

  const older = await Message.create({
    user: user._id,
    content: '較舊的留言',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  })

  const newer = await Message.create({
    user: user._id,
    content: '較新的留言',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  })

  return { user, older, newer }
}

async function seedManyMessages(count) {
  const user = await User.create({
    email: 'many@test.com',
    username: 'many',
    password: 'hashed-password',
  })

  const messages = []
  for (let i = count; i >= 1; i -= 1) {
    messages.push(
      await Message.create({
        user: user._id,
        content: `留言 ${i}`,
        createdAt: new Date(`2025-01-${String(i).padStart(2, '0')}`),
        updatedAt: new Date(`2025-01-${String(i).padStart(2, '0')}`),
      }),
    )
  }

  return messages.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )
}

async function createMessageForUser(overrides = {}) {
  const agent = request.agent(app)
  await registerAndLogin(agent, overrides)

  const res = await agent
    .post('/api/messages')
    .send({ content: overrides.content || '原始留言' })

  return { agent, message: res.body }
}

describe('Messages API', () => {
  describe('GET /api/messages', () => {
    it('未登入也能取得留言列表', async () => {
      const res = await request(app).get('/api/messages')

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        messages: [],
        hasMore: false,
        nextCursor: null,
      })
    })

    it('有留言時回傳資料並 populate 使用者名稱', async () => {
      await seedMessages()

      const res = await request(app).get('/api/messages')

      expect(res.status).toBe(200)
      expect(res.body.messages).toHaveLength(2)
      expect(res.body.messages[0]).toMatchObject({
        content: expect.any(String),
        user: { username: 'alice' },
      })
    })

    it('依 createdAt 降序排列（新的在前）', async () => {
      const { newer, older } = await seedMessages()

      const res = await request(app).get('/api/messages')

      expect(res.status).toBe(200)
      expect(res.body.messages[0]._id).toBe(newer._id.toString())
      expect(res.body.messages[1]._id).toBe(older._id.toString())
    })

    it('limit=2 時回傳 hasMore 與 nextCursor', async () => {
      await seedManyMessages(3)

      const res = await request(app).get('/api/messages?limit=2')

      expect(res.status).toBe(200)
      expect(res.body.messages).toHaveLength(2)
      expect(res.body.hasMore).toBe(true)
      expect(res.body.nextCursor).toBeTruthy()
    })

    it('帶 cursor 可取得下一頁', async () => {
      const sorted = await seedManyMessages(3)

      const page1 = await request(app).get('/api/messages?limit=2')
      const page2 = await request(app).get(
        `/api/messages?limit=2&cursor=${page1.body.nextCursor}`,
      )

      expect(page2.status).toBe(200)
      expect(page2.body.messages).toHaveLength(1)
      expect(page2.body.messages[0]._id).toBe(sorted[2]._id.toString())
      expect(page2.body.hasMore).toBe(false)
    })

    it('limit 無效時回傳 400', async () => {
      const res = await request(app).get('/api/messages?limit=999')

      expect(res.status).toBe(400)
    })

    it('cursor 格式無效時回傳 400', async () => {
      const res = await request(app).get('/api/messages?cursor=abc')

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/messages', () => {
    it('未登入時回傳 401', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({ content: 'hello' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('沒有登入權限')
    })

    it('登入後可以發布留言', async () => {
      const agent = request.agent(app)
      await registerAndLogin(agent, { username: 'bob' })

      const res = await agent
        .post('/api/messages')
        .send({ content: '新留言' })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        content: '新留言',
        user: { username: 'bob' },
      })
    })

    it('content 為空時回傳 400', async () => {
      const agent = request.agent(app)
      await registerAndLogin(agent)

      const res = await agent.post('/api/messages').send({ content: '' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('訊息內容不能為空')
    })

    it('發布後 GET 列表可看到新留言', async () => {
      const agent = request.agent(app)
      await registerAndLogin(agent, { username: 'carol' })

      await agent.post('/api/messages').send({ content: '剛發的留言' })

      const res = await request(app).get('/api/messages')

      expect(res.status).toBe(200)
      expect(res.body.messages).toHaveLength(1)
      expect(res.body.messages[0]).toMatchObject({
        content: '剛發的留言',
        user: { username: 'carol' },
      })
    })
  })

  describe('PUT /api/messages/:id', () => {
    it('未登入時回傳 401', async () => {
      const fakeId = '507f1f77bcf86cd799439011'

      const res = await request(app)
        .put(`/api/messages/${fakeId}`)
        .send({ content: '更新內容' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('沒有登入權限')
    })

    it('本人可以更新留言', async () => {
      const { agent, message } = await createMessageForUser({ username: 'owner' })

      const res = await agent
        .put(`/api/messages/${message._id}`)
        .send({ content: '更新後的留言' })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        _id: message._id,
        content: '更新後的留言',
        user: { username: 'owner' },
      })
    })

    it('不能更新他人的留言', async () => {
      const { message } = await createMessageForUser({
        email: 'owner@test.com',
        username: 'owner',
      })

      const otherAgent = request.agent(app)
      await registerAndLogin(otherAgent, {
        email: 'other@test.com',
        username: 'other',
      })

      const res = await otherAgent
        .put(`/api/messages/${message._id}`)
        .send({ content: '想改別人的留言' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('權限不足')
    })

    it('留言不存在時回傳 404', async () => {
      const agent = request.agent(app)
      await registerAndLogin(agent)

      const fakeId = '507f1f77bcf86cd799439011'
      const res = await agent
        .put(`/api/messages/${fakeId}`)
        .send({ content: '更新內容' })

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('找不到該留言')
    })

    it('content 為空時回傳 400', async () => {
      const { agent, message } = await createMessageForUser()

      const res = await agent
        .put(`/api/messages/${message._id}`)
        .send({ content: '' })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('內容不能為空')
    })
  })

  describe('DELETE /api/messages/:id', () => {
    it('未登入時回傳 401', async () => {
      const fakeId = '507f1f77bcf86cd799439011'

      const res = await request(app).delete(`/api/messages/${fakeId}`)

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('沒有登入權限')
    })

    it('本人可以刪除留言', async () => {
      const { agent, message } = await createMessageForUser()

      const res = await agent.delete(`/api/messages/${message._id}`)

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('留言已成功刪除')
    })

    it('不能刪除他人的留言', async () => {
      const { message } = await createMessageForUser({
        email: 'owner2@test.com',
        username: 'owner2',
      })

      const otherAgent = request.agent(app)
      await registerAndLogin(otherAgent, {
        email: 'other2@test.com',
        username: 'other2',
      })

      const res = await otherAgent.delete(`/api/messages/${message._id}`)

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('權限不足，只能刪除自己的留言')
    })

    it('留言不存在時回傳 404', async () => {
      const agent = request.agent(app)
      await registerAndLogin(agent)

      const fakeId = '507f1f77bcf86cd799439011'
      const res = await agent.delete(`/api/messages/${fakeId}`)

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('找不到該留言')
    })

    it('刪除後 GET 列表不再包含該留言', async () => {
      const { agent, message } = await createMessageForUser({
        email: 'deleter@test.com',
        content: '即將被刪除',
      })

      await agent.delete(`/api/messages/${message._id}`)

      const res = await request(app).get('/api/messages')

      expect(res.status).toBe(200)
      expect(res.body.messages).toEqual([])
      expect(res.body.hasMore).toBe(false)
      expect(res.body.nextCursor).toBe(null)
    })
  })
})
