/* eslint-disable no-undef */
import { expect } from 'chai'
import request from 'supertest'
import app from '../../../index.js'
import { testUserOne, testUserTwo } from '../../testVariables.js'

describe('Auth -----------------------', () => {

  describe('--- POST /register (registers a new user)', () => {

    it('Fails to register a new user with mismatched passwords', async () => {
      await request(app).post('/api/register')
        .send({
          email: testUserOne.email,
          password: testUserOne.password,
          passwordConfirmation: 'wrongpassword',
          username: testUserOne.username
        })
        .then((res) => {
          expect(res.body.message).to.equal('User validation failed: passwordConfirmation: does not match')
        })
    })

    it('Registers a new user and returns message and token', async () => {
      await request(app).post('/api/register')
        .send({ 
          email: testUserOne.email,
          password: testUserOne.password,
          passwordConfirmation: testUserOne.passwordConfirmation,
          username: testUserOne.username
        })
        .then((res) => {
          testUserOne.token = res.body.token
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('token')
        })
    })

    it('Registers a second user and returns message and token', async () => {
      await request(app).post('/api/register')
        .send({ 
          email: testUserTwo.email,
          password: testUserTwo.password,
          passwordConfirmation: testUserTwo.passwordConfirmation,
          username: testUserTwo.username
        })
        .then((res) => {
          testUserTwo.token = res.body.token
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('token')
        })
    })

  })

  describe('--- POST /login (log in existing user', () => {

    it('Fails to log user in when incorrect password', async () => {
      await request(app).post('/api/login')
        .send({
          email: testUserOne.email,
          password: 'wrongpassword'
        })
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized')
        })
    })

    it('Logs in user when correct details given', async () => {
      await request(app).post('/api/login')
        .send({
          email: testUserOne.email,
          password: testUserOne.password
        })
        .then((res) => {
          expect(res.body).to.be.an('object')
          expect(res.body.message).to.equal('Welcome back testuserone@email.com 🧩')
          expect(res.body).to.have.property('token')
        })
    })

  })
})
