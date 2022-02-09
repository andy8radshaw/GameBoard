import User from '../models/user.js'
import {
  awaitingUserResponse,
  notFound,
  alreadyAdded,
  previouslyDenied,
  unauthorized,
  forbidden
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

// Friend Requests...

async function getFriendRequests(req, res, next) {
  try {
    const user = await User.findById(req.currentUser._id).populate('friendRequests.user')
    if (!user) throw new Error(notFound)
    const friendRequests = user.friendRequests
    return res.status(200).json(friendRequests)
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
    if (userToRequest.friendRequests.some(request => request.user._id.equals(currentUserId))) throw new Error(awaitingUserResponse)
    if (userToRequest.rejectedFriends.some(request => request.user._id.equals(currentUserId))) throw new Error(previouslyDenied)
    if (userToRequest.blockedUsers.some(request => request.user._id.equals(currentUserId))) throw new Error(forbidden)
    userToRequest.friendRequests.push(req.body)
    await userToRequest.save()
    res.status(201).json(userToRequest)
  } catch (err) {
    next(err)
  }
}

async function acceptFriendRequest(req, res, next) {
  const currentUserId = req.currentUser._id
  const userToAddId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId)
    const userToAdd = await User.findById(userToAddId)
    req.body.user = userToAddId
    if (!currentUser || !userToAdd) throw new Error(notFound)
    if (!currentUser.equals(currentUserId)) throw new Error(unauthorized)
    if (!currentUser.friendRequests.some(request => request.user._id.equals(userToAddId))) throw new Error(notFound)
    if (currentUser.friends.some(request => request.user._id.equals(userToAddId))) throw new Error(alreadyAdded)
    if (currentUser.rejectedFriends.some(request => request.user._id.equals(userToAddId))) throw new Error(previouslyDenied)
    if (currentUser.blockedUsers.some(request => request.user._id.equals(userToAddId))) throw new Error(forbidden)
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

async function declineFriendRequest(req, res, next) {
  const currentUserId = req.currentUser._id
  const userToDeclineId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId)
    const userToDecline = await User.findById(userToDeclineId)
    if (!currentUser || !userToDecline) throw new Error(notFound)
    if (!currentUser.friendRequests.some(friend => friend.user._id.equals(userToDeclineId))) throw new Error(notFound)
    req.body.user = userToDeclineId
    currentUser.friendRequests = currentUser.friendRequests.filter(request => !request.user._id.equals(userToDeclineId))
    currentUser.rejectedFriends.push(req.body)
    await currentUser.save()
    res.status(200).json(currentUser)
  } catch (err) {
    next(err)
  }
}

async function removeFriend(req, res, next) {
  const currentUserId = req.currentUser._id
  const userToRemoveId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId)
    const userToRemove = await User.findById(userToRemoveId)
    if (!currentUser || !userToRemove) throw new Error(notFound)
    if (!currentUser.friends.some( friend => friend.user._id.equals(userToRemoveId))) throw new Error(notFound)
    currentUser.friends = currentUser.friends.filter(friend => !friend.user._id.equals(userToRemoveId))
    await currentUser.save()
    userToRemove.friends = userToRemove.friends.filter(friend => !friend.user._id.equals(currentUserId))
    await userToRemove.save()
    return res.status(200).json(currentUser)
  } catch (err) {
    next(err)
  }
}

async function updateRejectedFriends(req, res, next) {
  const currentUserId = req.currentUser._id
  const selectedUserId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId)
    const selectedUser = await User.findById(selectedUserId)
    if (!currentUser || !selectedUser) throw new Error(notFound)
    if (!currentUser.rejectedFriends.some(friend => friend.user._id.equals(selectedUserId))) throw new Error(notFound)
    currentUser.rejectedFriends = currentUser.rejectedFriends.filter(friend => !friend.user._id.equals(selectedUserId))
    await currentUser.save()
    res.status(200).json(currentUser)
  } catch (err) {
    next(err)
  }
}

async function blockUser(req, res, next) {
  const currentUserId = req.currentUser._id
  const userToBlockId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId)
    const userToBlock = await User.findById(userToBlockId)
    if (!currentUser || !userToBlock) throw new Error(notFound)
    if (currentUser.blockedUsers.some(user => user.user._id.equals(userToBlockId))) throw new Error(alreadyAdded)
    if (userToBlock.blockedUsers.some(user => user.user._id.equals(currentUserId))) throw new Error(forbidden)
    req.body.user = userToBlockId
    currentUser.blockedUsers.push(req.body)
    await currentUser.save()
    res.status(200).json(currentUser)
  } catch (err) {
    next(err)
  }
}

async function unblockUser(req, res, next) {
  const currentUserId = req.currentUser._id
  const userToUnblockId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId)
    const userToUnblock = await User.findById(userToUnblockId)
    if (!currentUser || !userToUnblock) throw new Error(notFound)
    if (!currentUser.blockedUsers.some(user => user.user._id.equals(userToUnblockId))) throw new Error(notFound)
    if (userToUnblock.blockedUsers.some(user => user.user._id.equals(currentUserId))) throw new Error(forbidden)
    currentUser.blockedUsers = currentUser.blockedUsers.filter(user => !user.user._id.equals(userToUnblockId))
    await currentUser.save()
    res.status(200).json(currentUser)
  } catch (err) {
    next(err)
  }
}

// Board Game controllers

async function addSavedGame(req, res, next) {
  try {
    const user = await User.findById(req.currentUser._id)
    const gameId = req.params.id
    if (!user) throw new Error(notFound)
    if (user.savedGames.some(game => game === gameId)) throw new Error(alreadyAdded)
    user.savedGames.push(gameId)
    user.save()
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

async function removeSavedGame(req, res, next) {
  try {
    const user = await User.findById(req.currentUser._id)
    const gameId = req.params.id
    if (!user) throw new Error(notFound)
    if (!user.savedGames.some(game => game === gameId)) throw new Error(notFound)
    user.savedGames = user.savedGames.filter(game => game !== gameId)
    user.save()
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}


export default {
  userProfile,
  getAllUsers,
  getSingleUser,
  userUpdate,
  getFriendRequests,
  requestFriend,
  acceptFriendRequest,
  declineFriendRequest,
  updateRejectedFriends,
  removeFriend,
  blockUser,
  unblockUser,
  addSavedGame,
  removeSavedGame
}
