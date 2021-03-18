process.env.NODE_ENV = 'test'

/* eslint-disable no-undef */
import { expect } from 'chai'
import request from 'supertest'
import app from '../../../index.js'


describe('User -------------', () => {

  describe('GET /profiles', () => { 

    it('Returns an array', async () => {
      await request(app).get('/api/profiles')
        .then(res => {
          const body = res.body
          expect(body).to.be.an('array')
          expect(res.status).to.equal(200)
        })
    })

    it('Has the correct length', async () => {
      await request(app).get('/api/profiles')
        .then((res) => {
          const body = res.body
          expect(body.length).to.equal(6)
          expect(res.status).to.equal(200)
        })
    })

    it('Has the correct properties', async () => {
      await request(app).get('/api/profiles')
        .then((res) => {
          const user = res.body[0]
          expect(user).to.have.property('email')
          expect(user).to.have.property('id')
        })
    })
  })
}) 