const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// ensures password doesn't show up on the users details
userSchema
  .set('toJSON', {
    virtuals: true,
    transform(doc, json) {
      delete json.password
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
module.exports = mongoose.model('User', userSchema)