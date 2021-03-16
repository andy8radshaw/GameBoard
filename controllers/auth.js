import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { secret } from '../config/environment.js'
import { unauthorized } from '../lib/errorMessages.js'

async function register(req, res) {
  try {
    const newUser = await User.create(req.body)
    const token = jwt.sign({ sub: newUser._id }, secret, { expiresIn: '7 days' })
    res.status(201).json({ message: `Welcome ${newUser.email} 🧩`, token })
  } catch (err) {
    res.status(422).json(err)
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !user.validatePassword(req.body.password)) {
      throw new Error(unauthorized)
    }

    const token = jwt.sign({ sub: user._id }, secret, { expiresIn: '7 days' })

    res.status(202).json({
      message: `Welcome back ${user.email} 🧩`,
      token
    })
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default {
  register,
  login
}
