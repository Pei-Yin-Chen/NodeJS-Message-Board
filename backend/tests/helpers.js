const defaultUser = {
  email: 'test@test.com',
  username: 'testuser',
  password: 'password123',
}

function buildUser(overrides = {}) {
  return {
    email: overrides.email || defaultUser.email,
    username: overrides.username || defaultUser.username,
    password: overrides.password || defaultUser.password,
  }
}

async function registerUser(agent, overrides = {}) {
  const user = buildUser(overrides)
  await agent.post('/api/auth/register').send(user)
  return user
}

async function loginUser(agent, user) {
  await agent.post('/api/auth/login').send({
    email: user.email,
    password: user.password,
  })
  return user
}

async function registerAndLogin(agent, overrides = {}) {
  const user = await registerUser(agent, overrides)
  await loginUser(agent, user)
  return user
}

module.exports = {
  defaultUser,
  buildUser,
  registerUser,
  loginUser,
  registerAndLogin,
}
