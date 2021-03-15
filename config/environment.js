import dotenv from 'dotenv'
dotenv.config()

export const port = process.env.PORT || 8000
export const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gameboard-db'
export const secret = process.env.SECRET || 'local gameboard secret'


