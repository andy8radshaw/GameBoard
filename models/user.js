import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import uniqueValidator from 'mongoose-unique-validator'

const friendRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  message: { type: String, maxlength: 300 }
}, {
  timestamps: true
})

const acceptedFriendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
})

const rejectedFriendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
})

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
  profileImage: { type: String },
  isPrivate: { type: Boolean, default: false },
  friendRequests: [friendRequestSchema],
  friends: [acceptedFriendSchema],
  rejectedFriends: [rejectedFriendSchema]
}, {
  timestamps: true
})

// ensures password doesn't show up on the users details
userSchema
  .set('toJSON', {
    virtuals: true,
    transform(_doc, json) {
      delete json.password
      delete json.__v
      return json
    }
  })

// validates password when logging in
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

// creates virtual field for passwordConfirmation
userSchema
  .virtual('passwordConfirmation')
  .set(function (passwordConfirmation) {
    this._passwordConfimation = passwordConfirmation
  })

// checks password is equal to passwordConfirmation
userSchema
  .pre('validate', function (next) {
    if (this.isModified('password') && this._passwordConfimation !== this.password) {
      this.invalidate('passwordConfirmation', 'does not match')
    }
    next()
  })

//hashes password before model is saved and sent to database
userSchema
  .pre('save', function (next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8))
    }
    next()
  })

userSchema.plugin(uniqueValidator)

export default mongoose.model('User', userSchema)
