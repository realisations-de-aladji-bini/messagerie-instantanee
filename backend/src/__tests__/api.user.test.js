const app = require('../app')
const request = require('supertest')

test('Test if user can log in and list users', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Returning users')
  expect(response.body.data.length).toBeGreaterThan(0)
})

test('Test if user registration is valid', async () => {
  let response = await request(app)
    .post('/register')
    .send({ email: 'JohnDoe@grenoble-inp.org', password: 'P@ssw0rd!', name: 'John Doe'})
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User Added')
})

test('Test if user enter wrong password', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: 'notThePassWord' })
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Wrong email/password')

})

test('Test if user try to login without email or password', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr' })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('You must specify the email and password')

})


test('Test if user try to login with an email that is not in DB', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'JohnDoe@gmail.com' , password: 'P@ssw0rd!'})
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Wrong email/password')

})



test('Test user registration without name', async () => {
  let response = await request(app)
    .post('/register')
    .send({ email: 'NoName@grenoble-inp.org', password: 'P@ssw0rd!'})
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('You must specify the name, email and password')
})

test('Test user registration with weak password', async () => {
  let response = await request(app)
    .post('/register')
    .send({ email: 'WeakPassword@grenoble-inp.org', password: '1234', name: 'Weak password'})
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Weak password!')
})


test('Test if user can log in and change password', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'JohnDoe@grenoble-inp.org', password: 'P@ssw0rd!' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', response.body.token)
    .send({password : 'L@ssw0rd!'})
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Password updated')
})

test('Test if user can log in and try to change password with a weak password', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'JohnDoe@grenoble-inp.org', password: 'L@ssw0rd!' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', response.body.token)
    .send({password : 'weak password'})
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Weak password!')
})


test('Test if user can log in and try to change password with bad param', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'JohnDoe@grenoble-inp.org', password: 'L@ssw0rd!' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .put('/api/password')
    .set('x-access-token', response.body.token)
    .send({notpassword : 'password'})
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('You must specify your new password')
})

test('Test if user try to do admin only action', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'JohnDoe@grenoble-inp.org', password: 'L@ssw0rd!', name: 'John Doe'})
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .put('/api/users/2')
    .set('x-access-token', response.body.token)
    .send({email: 'JaneDoe@grenoble-inp.org', password: 'P@ssw0rd!', name: 'Jane Doe'})
  expect(response.statusCode).toBe(401)
  expect(response.body.message).toBe('You must be Admin to do that')
})


test('Test if admin can log in and update user', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .put('/api/users/2')
    .set('x-access-token', response.body.token)
    .send({email: 'JaneDoe@grenoble-inp.org', password: 'L@ssw0rd!', name: 'Jane Doe'})
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User updated')
})

test('Test if admin can log in and try update user without params', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .put('/api/users/2')
    .set('x-access-token', response.body.token)
    .send({})
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('You must specify the name, email or password')
})

test('Test if admin can log in and delete user', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('token')
  response = await request(app)
    .delete('/api/users/2')
    .set('x-access-token', response.body.token)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User deleted')
})



