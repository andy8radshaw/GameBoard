import jwt from 'jsonwebtoken'
import { secret } from '../config/environment.js'
import User from '../models/user.js'

export default async function secureRoute(req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new Error('Missing Required Header')
    }

    const token = req.headers.authorization.replace('Bearer ', '')
    const payload = jwt.verify(token, secret)
    const userToVerify = await User.findById(payload.sub)

    if (!userToVerify) {
      throw new Error('User not Found')
    }

    req.currentUser = userToVerify
    next()
  } catch (err) {
    console.log('🤖 Authorization Error', err.name, err.message)
    return res.status(401).json({ message: 'Unauthorized', detail: err.message })
  }
}
