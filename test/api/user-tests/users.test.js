/* eslint-disable no-undef */
import { expect } from 'chai'
import request from 'supertest'
import app from '../../../index.js'
import { testUserOne, testUserTwo } from '../../testVariables.js'

describe('User -----------------------', function() {

  describe('--- GET /myprofile (Logged in users profile)', () => {

    it('Returns an object', async () => {
      await request(app).get('/api/myprofile')
        .set('Authorization', 'Bearer ' + testUserOne.token)
        .then((res) => {
          const user = res.body
          testUserOne.id = user.id
          expect(user).to.be.an('object')
        })
    })

    it('Returns an object with the correct properties', async () => {
      await request(app).get('/api/myprofile')
        .set('Authorization', 'Bearer ' + testUserOne.token)
        .then((res) => {
          const user = res.body
          expect(user).to.have.property('email')
          expect(user).to.have.property('id')
          expect(user).to.have.property('friends')
          expect(user).to.have.property('friendRequests')
          expect(user).to.have.property('rejectedFriends')
        })
    })

    it('Returns the correct email for test account', async () => {
      await request(app).get('/api/myprofile')
        .set('Authorization', 'Bearer ' + testUserOne.token)
        .then((res) => {
          const user = res.body
          expect(user.email).to.equal('testuserone@email.com')
        })
    })

  })

  describe('--- GET /profiles (userIndex)', () => {

    it('Returns an array', async () => {
      await request(app).get('/api/profiles')
        .set('Authorization', 'Bearer ' + testUserOne.token)
        .then(res => {
          const body = res.body
          expect(body).to.be.an('array')
          expect(res.status).to.equal(200)
        })
    })

    it('Returns an array of the correct length', async () => {
      await request(app).get('/api/profiles')
        .set('Authorization', 'Bearer ' + testUserOne.token)
        .then((res) => {
          const body = res.body
          expect(body.length).to.equal(2)
          expect(res.status).to.equal(200)
        })
    })

    it('Returns objects with the correct properties', async () => {
      await request(app).get('/api/profiles')
        .set('Authorization', 'Bearer ' + testUserOne.token)
        .then((res) => {
          const user = res.body[0]
          expect(user).to.have.property('email')
          expect(user).to.have.property('id')
          expect(user).to.have.property('friends')
          expect(user).to.have.property('friendRequests')
          expect(user).to.have.property('rejectedFriends')
        })
    })
  })

  describe('--- GET /profiles/:id (a single user)', () => {

    it('Returns an object', async () => {
      await request(app).get(`/api/profiles/${testUserOne.id}`)
        .set('Authorization', 'Bearer ' + testUserTwo.token)
        .then((res) => {
          const user = res.body
          expect(user).to.be.an('object')
        })
    })

    it('Returns an object with the correct properties', async () => {
      await request(app).get(`/api/profiles/${testUserOne.id}`)
        .set('Authorization', 'Bearer ' + testUserTwo.token)
        .then((res) => {
          const user = res.body
          expect(user).to.have.property('email')
          expect(user).to.have.property('id')
          expect(user).to.have.property('friends')
          expect(user).to.have.property('friendRequests')
          expect(user).to.have.property('rejectedFriends')
        })
    })

    it('Returns the correct email for testUserOne', async () => {
      await request(app).get(`/api/profiles/${testUserOne.id}`)
        .set('Authorization', 'Bearer ' + testUserTwo.token)
        .then((res) => {
          const user = res.body
          expect(user.email).to.equal('testuserone@email.com')
        })
    })
  })

  describe('--- PUT /profiles/:id (updateUser)', () => {

    it('fails to update if incorrect userId given', async () => {
      await request(app).put('/api/profiles/123')
        .set('Authorization', 'Bearer ' + testUserOne.token)
        .send({
          username: 'newUsername',
          isPrivate: true
        })
        .then((res) => {
          expect(res.body.message).to.equal('Not Found')
        })
    })

    it('fails to update if no token given (user not logged in)', async () => {
      await request(app).put(`/api/profiles/${testUserOne.id}`)
        .send({
          username: 'newUsername',
          isPrivate: true
        })
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized')
        })
    })

    it('fails to update a different user than the current logged in', async () => {
      await request(app).put(`/api/profiles/${testUserOne.id}`)
        .set('Authorization', 'Bearer ' + testUserTwo.token)
        .send({
          username: 'newUsername',
          isPrivate: true
        })
        .then((res) => {
          expect(res.body.message).to.equal('Unauthorized')
        })
    })

    it('updates the current logged in user correctly', async () => {
      await request(app).put(`/api/profiles/${testUserOne.id}`)
        .set('Authorization', 'Bearer ' + testUserOne.token)
        .send({
          username: 'newUsername',
          isPrivate: true,
          profileImage: 'awesome profile image URL'
        })
        .then((res) => {
          const user = res.body
          expect(user.isPrivate).to.equal(true)
          expect(user.username).to.equal('newUsername')
          expect(user.email).to.equal('testuserone@email.com')
          expect(user.profileImage).to.equal('awesome profile image URL')
        })
    })

  })
}) 
