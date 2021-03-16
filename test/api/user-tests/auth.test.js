/* eslint-disable no-undef */
import { expect } from 'chai'
import request from 'supertest'
import database from '../../testEnv.js'
import register from '../../../controllers/auth.js'
import app from '../../../index.js'

describe('Registering a User', () => {

  before(done => {
    database.connectToMockDatabase()
      .then(() => done())
      .catch(err => done(err))
  })

  after(done => {
    database.closeMockDatabase()
      .then(() => done())
      .catch(err => done(err))
  })
  
  it('registers a new user', (done) => {
    request(app).post('/register')
      .send({
        email: 'andy@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .then(res => {
        const body = res.body
        expect(body).to.contain.property('message')
        expect(body).to.contain.property('token')
      })
      .then(() => done())
      .catch(err => done(err))
  })

})


