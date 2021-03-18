import mongoose from 'mongoose'
import mockgoose from 'mockgoose'
import { dbURI } from '../config/environment.js'

const Mockgoose = mockgoose.Mockgoose

export default function connectToDatabase(isTest) {
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
  if (isTest) {
    const mockDb = new Mockgoose(mongoose)
    mockDb.prepareStorage()
      .then(() => {
        return mongoose.connect(dbURI, options)
      })
  } else {
    return mongoose.connect(dbURI, options)
  }
}