const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { port, dbURI } = require('./config/envionment')
const logger = require('./lib/logger')

mongoose.connect(dbURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
  },
  (err) => {
    if (err) return console.log(err)
    console.log('Mongo is Connected!')
  })

app.use(logger)

app.listen(port, () => console.log(`Up and running on port ${port}`))