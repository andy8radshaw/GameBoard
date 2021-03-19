/* eslint-disable no-undef */
import { expect } from 'chai'
import request from 'supertest'
import app from '../../../index.js'

let token
let userId

describe('User -----------------------', () => {

  before(async () => {
    await request(app).post('/api/register')
      .send({ 
        email: 'test@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .then((res) => {
        token = res.body.token
      })
  })

  describe('--- GET /myprofile (Logged in users profile)', () => {

    it('Returns an object', async () => {
      await request(app).get('/api/myprofile')
        .set('Authorization', 'Bearer ' + token)
        .then((res) => {
          const user = res.body
          userId = user.id
          expect(user).to.be.an('object')
        })
    })

    it('Returns an object with the correct properties', async () => {
      await request(app).get('/api/myprofile')
        .set('Authorization', 'Bearer ' + token)
        .then((res) => {
          const user = res.body
          expect(user).to.have.property('email')
          expect(user).to.have.property('id')
        })
    })

    it('Returns the correct email for test account', async () => {
      await request(app).get('/api/myprofile')
        .set('Authorization', 'Bearer ' + token)
        .then((res) => {
          const user = res.body
          expect(user.email).to.equal('test@email.com')
        })
    })

  })

  describe('--- GET /profiles (userIndex)', () => {

    it('Returns an array', async () => {
      await request(app).get('/api/profiles')
        .set('Authorization', 'Bearer ' + token)
        .then(res => {
          const body = res.body
          expect(body).to.be.an('array')
          expect(res.status).to.equal(200)
        })
    })

    it('Returns an array of the correct length', async () => {
      await request(app).get('/api/profiles')
        .set('Authorization', 'Bearer ' + token)
        .then((res) => {
          const body = res.body
          expect(body.length).to.equal(1)
          expect(res.status).to.equal(200)
        })
    })

    it('Returns objects with the correct properties', async () => {
      await request(app).get('/api/profiles')
        .set('Authorization', 'Bearer ' + token)
        .then((res) => {
          const user = res.body[0]
          expect(user).to.have.property('email')
          expect(user).to.have.property('id')
        })
    })
  })

  describe('--- GET /profiles/:id (a single user) ', () => {

    it('Returns an object', async () => {
      await request(app).get(`/api/profiles/${userId}`)
        .set('Authorization', 'Bearer ' + token)
        .then((res) => {
          const user = res.body
          expect(user).to.be.an('object')
        })
    })
  })
}) 