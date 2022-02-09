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

router.route('/myprofile')
  .get(secureRoute, users.userProfile)

router.route('/profiles')
  .get(secureRoute, users.getAllUsers)

router.route('/profiles/:id')
  .get(secureRoute, users.getSingleUser)
  .put(secureRoute, users.userUpdate)

router.route('/friend-requests')
  .get(secureRoute, users.getFriendRequests)

router.route('/friend-requests/:id')
  .put(secureRoute, users.requestFriend)

router.route('/friends/:id')
  .put(secureRoute, users.acceptFriendRequest)

router.route('/friend-remove/:id')
  .put(secureRoute, users.removeFriend)

router.route('/friend-decline/:id')
  .put(secureRoute, users.declineFriendRequest)

router.route('/friends-rejected/:id')
  .put(secureRoute, users.updateRejectedFriends)

router.route('/block-user/:id')
  .put(secureRoute, users.blockUser)

router.route('/unblock-user/:id')
  .put(secureRoute, users.unblockUser)

export default router
