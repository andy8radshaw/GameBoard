function connect() {
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

function closeDatabase() {
  return mongoose.disconnect()