
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SongSchema = {
  from: {
    type: String
  },
  data: {
    type: Object
  },
  uniqueid: {
    type: String
  }
}

module.exports = Song = mongoose.model('song', SongSchema)
