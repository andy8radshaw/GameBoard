const port = process.env.PORT || 8000
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameboard-db'
const secret = process.env.SECRET || 'local gameboard secret'

module.exports = {
  dbURI,
  port,
  secret
}
