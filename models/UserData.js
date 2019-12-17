
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserDataSchema = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  liked: [{
    trackID: {
      type: Schema.Types.ObjectId,
      ref: 'song'
    },
    savedOn: {
      type: Date,
      default: new Date()
    }
  }],
  playlist: [{
    title: {
      type: String
    },
    songs: [{
      type: Schema.Types.ObjectId,
      ref: 'song'
    }]
  }]
}

module.exports = UserData = mongoose.model('user-data', UserDataSchema)
