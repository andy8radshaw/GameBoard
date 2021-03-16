import User from '../models/user.js'
import { notFound } from '../lib/errorMessages.js'

async function userProfile(req, res, next) {
  try {
    const user = await User.findById(req.currentUser._id)
    if (!user) throw new Error(notFound)
    return res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

async function getAllUsers(_req, res, next) {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (err) {
    next(err)
  }
}

async function getSingleUser(req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) throw new Error(notFound)
    return res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

export default {
  userProfile,
  getAllUsers,
  getSingleUser
}