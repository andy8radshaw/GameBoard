import express from 'express'
import secureRoute from '../lib/secureRoute.js'
import auth from '../controllers/auth.js'
import users from '../controllers/users.js'

const router = express.Router()

// User/Authentication routes
router.route('/myprofile')
  .get(secureRoute, users.userProfile)

router.route('/profiles')
  .get(secureRoute, users.getAllUsers)

router.route('/profiles/:id')
  .get(secureRoute, users.getSingleUser)
  .put(secureRoute, users.userUpdate)

router.route('/register')
  .post(auth.register)

router.route('/login')
  .post(auth.login)

export default router
