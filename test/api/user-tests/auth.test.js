/* eslint-disable no-undef */
import { assert } from 'chai'
import { register } from '../../../user/controllers/auth.js'

describe('register', () => {
  
  it('sends error response if no details given', () => {
    assert.equal(register(), 'test')
  })

})


