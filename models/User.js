
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}

module.exports = User = mongoose.model('user', UserSchema)
