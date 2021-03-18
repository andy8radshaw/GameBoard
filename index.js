import express from 'express'
import { port } from './config/environment.js'
import connectToDatabase from './lib/connectToDb.js'
import logger from './lib/logger.js'
import router from './config/routes.js'
import errorHandler from './lib/errorHandler.js'

const isTest = process.env.NODE_ENV === 'test'
const databaseName = isTest ? 'Test database' : 'Database'


const app = express()

async function startServer() {
  try {
    await connectToDatabase(isTest)

    if (!isTest) console.log(`🤖 ${databaseName} has connected`)

    app.use(express.json())

    // if (!isTest) app.use(logger)

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