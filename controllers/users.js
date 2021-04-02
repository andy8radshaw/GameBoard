import User from '../models/user.js'
import { 
  awaitingUserResponse,
  notFound, 
  alreadyAdded, 
  previouslyDenied, 
  unauthorized
} from '../lib/errorHandler.js'

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
    const user = await User.findById(userId).populate('rejectedFriends.user')
    if (!user) throw new Error(notFound)
    return res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

async function userUpdate(req, res, next) {
  const userId = req.params.id
  try {
    const userToUpdate = await User.findById(userId)
    if (!userToUpdate) throw new Error(notFound)
    if (!userToUpdate.equals(req.currentUser._id)) throw new Error(unauthorized)
    Object.assign(userToUpdate, req.body)
    await userToUpdate.save()
    res.status(202).json(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function requestFriend(req, res, next) {
  const requestedUserID = req.params.id
  const currentUserId = req.currentUser._id
  try {
    req.body.user = req.currentUser
    const userToRequest = await User.findById(requestedUserID).populate('user')
    if (!userToRequest) throw new Error(notFound)
    if (userToRequest.friends.some( user => user.user._id.equals(currentUserId))) throw new Error(alreadyAdded)
    if (userToRequest.friendRequests.some( user => user.user._id.equals(currentUserId))) throw new Error(awaitingUserResponse)
    if (userToRequest.rejectedFriends.some( user => user.user._id.equals(currentUserId))) throw new Error(previouslyDenied)
    userToRequest.friendRequests.push(req.body)
    await userToRequest.save()
    res.status(201).json(userToRequest)
  } catch (err) {
    next(err)
  }
}

export default {
  userProfile,
  getAllUsers,
  getSingleUser,
  userUpdate,
  requestFriend
}
