const request = require('supertest')
const app = require('../app')
const { registerAndLogin } = require('./helpers')

const validUser = {
  email: 'auth@test.com',
  username: 'authuser',
  password: 'password123',
}

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('成功註冊回傳 201', async () => {
      const res = await request(app).post('/api/auth/register').send(validUser)

      expect(res.status).toBe(201)
      expect(res.body.message).toBe('註冊成功')
    })

    it('缺少欄位時回傳 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: validUser.email })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('所有欄位皆為必填')
    })

    it('重複 email 時回傳 400', async () => {
      await request(app).post('/api/auth/register').send(validUser)

      const res = await request(app).post('/api/auth/register').send({
        ...validUser,
        username: 'another-user',
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('該 Email 已被註冊')
    })

    it('email 格式無效時回傳 400', async () => {
      const res = await request(app).post('/api/auth/register').send({
        ...validUser,
        email: 'not-an-email',
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('請輸入有效的 Email 地址')
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser)
    })

    it('正確帳密登入成功', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: validUser.email,
        password: validUser.password,
      })

      expect(res.status).toBe(200)
      expect(res.body.user).toMatchObject({
        username: validUser.username,
        email: validUser.email,
      })
      expect(res.headers['set-cookie']).toBeDefined()
    })

    it('email 不存在時回傳 400', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@test.com',
        password: validUser.password,
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('帳號或密碼錯誤')
    })

    it('密碼錯誤時回傳 400', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: validUser.email,
        password: 'wrong-password',
      })

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('帳號或密碼錯誤')
    })
  })

  describe('GET /api/auth/me', () => {
    it('未登入時回傳 401', async () => {
      const res = await request(app).get('/api/auth/me')

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('沒有登入權限')
    })

    it('登入後可取得使用者資料', async () => {
      const agent = request.agent(app)
      await registerAndLogin(agent, validUser)

      const res = await agent.get('/api/auth/me')

      expect(res.status).toBe(200)
      expect(res.body.user).toMatchObject({
        username: validUser.username,
        email: validUser.email,
      })
    })
  })

  describe('POST /api/auth/logout', () => {
    it('登入後可以登出', async () => {
      const agent = request.agent(app)
      await registerAndLogin(agent, validUser)

      const res = await agent.post('/api/auth/logout')

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('登出成功')
    })

    it('登出後無法再取得使用者資料', async () => {
      const agent = request.agent(app)
      await registerAndLogin(agent, validUser)
      await agent.post('/api/auth/logout')

      const res = await agent.get('/api/auth/me')

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('沒有登入權限')
    })
  })
})
