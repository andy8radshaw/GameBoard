import mongoose from 'mongoose'

export default function closeDatabase() {
  return mongoose.disconnect()
}
