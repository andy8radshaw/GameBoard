import mongoose from 'mongoose'
import { dbURI } from '../config/environment.js'
import mockgoose from 'mockgoose'

const Mockgoose = mockgoose.Mockgoose

export default function connectToMockDatabase() {
  const mockDb = new Mockgoose(mongoose)
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
  
  mockDb.prepareStorage()
    .then(() => {
      return mongoose.connect(dbURI, options)
    })
}
