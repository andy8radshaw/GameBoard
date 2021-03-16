/* eslint-disable no-undef */
import { expect } from 'chai'
import request from 'supertest'
import database from '../../../lib/connectToDb.js'
import register from '../../../controllers/auth.js'

describe('Registering a User', () => {

  before(done => {
    database.connect()
      .then(() => done())
      .catch(err => done(err))
  })

  after(done => {
    database.closeDatabase()
      .then(() => done())
      .catch(err => done(err))
  })
  
  it('registers a new user', (done) => {
    request(register).post('/register')
      .send({
        email: 'andy@email.com',
        password: 'password',
        passwordConfirmation: 'password'
      })
      .then(async res => {
        const body = await res.body
        expect(body).to.contain.property('message')
        expect(body).to.contain.property('token')
        done()
      })
      .catch(err => done(err))
  })

})


