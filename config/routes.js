import express from 'express'
import secureRoute from '../lib/secureRoute.js'
import auth from '../controllers/auth.js'
import users from '../controllers/users.js'

const router = express.Router()

// User/Authentication routes

router.route('/register')
  .post(auth.register)

router.route('/login')
  .post(auth.login)

// /myprofile

router.route('/myprofile')
  .get(secureRoute, users.userProfile)

router.route('/myprofile/friend-requests')
  .get(secureRoute, users.getFriendRequests)

router.route('/myprofile/friends/remove/:id')
  .put(secureRoute, users.removeFriend)

router.route('/myprofile/saved-games/add/:id')
  .put(secureRoute, users.addSavedGame)

router.route('/myprofile/saved-games/remove/:id')
  .put(secureRoute, users.removeSavedGame)

router.route('/myprofile/update-rejected/:id')
  .put(secureRoute, users.updateRejectedFriends)

// /users

router.route('/users')
  .get(secureRoute, users.getAllUsers)

router.route('/users/:id')
  .get(secureRoute, users.getSingleUser)
  .put(secureRoute, users.userUpdate)

router.route('/users/add/:id')
  .put(secureRoute, users.requestFriend)

router.route('/users/accept/:id')
  .put(secureRoute, users.acceptFriendRequest)

router.route('/users/decline/:id')
  .put(secureRoute, users.declineFriendRequest)

router.route('/users/block/:id')
  .put(secureRoute, users.blockUser)

router.route('/users/unblock/:id')
  .put(secureRoute, users.unblockUser)

export default router
