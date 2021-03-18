/* eslint-disable no-undef */
// import request from 'supertest'
// import database from '../../testEnv.js'
// // import register from '../../../controllers/auth.js'
// import app from '../../../index.js'
// import { expect } from 'chai'

// function sayHello(name = 'world') {
//   return `hello ${name}`
// }

// describe('test the tests with sayHello 2', () => {

//   it('returns a string', () => {
//     expect(sayHello('andy')).to.be.a('string')
//   })

//   it('returns hello andy', () => {
//     expect(sayHello('andy')).to.equal('hello andy')
//   })

//   it('returns hello world if no name passed as argument', () => {
//     expect(sayHello()).to.equal('hello world')
//   })

//   it('fails', () => {
//     expect(sayHello()).to.not.equal('hello andy')
//   })
// })

// describe('Registering a User', () => {

//   before(done => {
//     database.connectToMockDatabase()
//       .then(() => done())
//       .catch(err => done(err))
//   })

//   after(done => {
//     database.closeMockDatabase()
//       .then(() => done())
//       .catch(err => done(err))
//   })
  
//   it('registers a new user', (done) => {
//     request(app).post('/register')
//       .send({
//         email: 'andy@email.com',
//         password: 'password',
//         passwordConfirmation: 'password'
//       })
//       .then(res => {
//         const body = res.body
//         expect(body).to.contain.property('message')
//         expect(body).to.contain.property('token')
//       })
//       .then(() => done())
//       .catch(err => done(err))
//   })

// })

