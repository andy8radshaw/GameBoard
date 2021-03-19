import express from 'express'
// import logger from './lib/logger.js'
import router from './config/routes.js'
import errorHandler from './lib/errorHandler.js'
import connectToDatabase from './lib/connectToDb.js'
import { port } from './config/environment.js'
import connectToMockDatabase from './lib/connectToMockDb.js'

const app = express()
const isTest = () => process.env.NODE_ENV === 'test'

async function startServer() {
  try {
    if (isTest) {
      await connectToMockDatabase()
      console.log('🤖 MOCK Database has connected')
    } else {
      await connectToDatabase()
      console.log('🤖 Database has connected')
    }


    app.use(express.json())

    // app.use(logger)

    app.use('/api', router)

    app.use(errorHandler)

    app.listen(port, () => console.log(`🤖 Up and running on port ${port}`))

  } catch (err) {
    console.log('🤖 Something went wrong starting the App')
    console.log(err)
  }
}

startServer()

export default app