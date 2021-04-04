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
    const user = await User.findById(req.currentUser._id).populate('friends.user')
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
    const user = await (await User.findById(userId))
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
    const userToRequest = await User.findById(requestedUserID)
    if (!userToRequest) throw new Error(notFound)
    if (userToRequest.friends.some( request => request.user._id.equals(currentUserId))) throw new Error(alreadyAdded)
    if (userToRequest.friendRequests.some( request => request.user._id.equals(currentUserId))) throw new Error(awaitingUserResponse)
    if (userToRequest.rejectedFriends.some( request => request.user._id.equals(currentUserId))) throw new Error(previouslyDenied)
    userToRequest.friendRequests.push(req.body)
    await userToRequest.save()
    res.status(201).json(userToRequest)
  } catch (err) {
    next(err)
  }
}

async function acceptFriend(req, res, next) {
  const currentUserId = req.currentUser._id
  const userToAddId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId)
    const userToAdd = await User.findById(userToAddId)
    req.body.user = userToAddId
    if (!currentUser || !userToAdd) throw new Error(notFound)
    if (!currentUser.equals(currentUserId)) throw new Error(unauthorized)
    if (!currentUser.friendRequests.some( request => request.user._id.equals(userToAddId))) throw new Error(notFound)
    if (currentUser.friends.some( request => request.user._id.equals(userToAddId))) throw new Error(alreadyAdded)
    if (currentUser.rejectedFriends.some( request => request.user._id.equals(userToAddId))) throw new Error(previouslyDenied)
    currentUser.friends.push(req.body)
    const updatedFriendRequests = currentUser.friendRequests.filter(request => {
      if (request.user.toString() !== userToAddId) return request 
    })
    currentUser.friendRequests = updatedFriendRequests
    await currentUser.save()
    req.body.user = currentUserId
    userToAdd.friends.push(req.body)
    await userToAdd.save()
    res.status(201).json({ currentUser, userToAdd })
  } catch (err) {
    next(err)
  }
}

export default {
  userProfile,
  getAllUsers,
  getSingleUser,
  userUpdate,
  requestFriend,
  acceptFriend
}
