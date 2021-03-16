import mongoose from 'mongoose'
import mockgoose from 'mockgoose'
import { dbURI } from '../config/environment.js'

const Mockgoose = mockgoose.Mockgoose

function connectToMockDatabase() {
  return new Promise((resolve, reject) => {
    const mockDb = new Mockgoose(mongoose)
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  
    mockDb.prepareStorage()
      .then(() => {
        mongoose.connect(dbURI, options)
          .then((res, err) => {
            if (err) return reject(err)
            resolve()
          })
      })
  })
}

function closeMockDatabase() {
  return mongoose.disconnect()
}

export default {
  connectToMockDatabase,
  closeMockDatabase
}
