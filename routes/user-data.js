
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const passport = require('passport')

const Song = require('../models/Song')
const UserData = require('../models/UserData')

const router = express.Router()

const getTrackID = (songDetails, musicProvider) => {

  let ID = false
  const uniqueid = songDetails.etag.substring(1, songDetails.etag.length - 1)

  return Song.findOne({
    from: musicProvider,
    uniqueid
  })
    .then(track => {

      if(track) {
        ID = track._id
        return ID
      }
      
      return new Song({
        from: musicProvider,
        data: songDetails,
        uniqueid
      }).save()
    })
    .then(savedTrack => {
      if(typeof savedTrack === 'string')
        return savedTrack

      return savedTrack._id
    })
    .catch(err => console.log(err))
}

const saveSong = (uid, trackID) =>
  UserData.findOneAndUpdate(
    {user: mongoose.Types.ObjectId(uid)},
    {$push: {liked: {trackID}}},
    {safe: true, upsert: true, new: true}
  )

const removeSong = (uid, trackID) =>
  UserData.findOneAndUpdate(
    {user: mongoose.Types.ObjectId(uid)},
    {$pull: {liked: {trackID}}},
    {safe: true, upsert: true, new: true}
  )

router.post('/like', passport.authenticate('jwt', {session: false}), async (req, res) => {

  const {songDetails, musicProvider} = req.body
  const trackID = await getTrackID(songDetails, musicProvider)
  const {user} = req

  UserData.findOne({user: user.id})
    .then(userdata => userdata.liked.filter(song => song.trackID.equals(trackID)).length === 0
      ? saveSong(user.id, trackID)
      : removeSong(user.id, trackID))
    .then(account => Song.find({'_id': { $in: account.liked.map(item => item.trackID) }}))
    .then(songs => res.json(songs))
    .catch(err => console.log(err))
})

router.get('/liked-music', passport.authenticate('jwt', {session: false}), (req, res) => {

  const {user} = req

  UserData.findOne({user: mongoose.Types.ObjectId(user.id)})
    .then(res => {
      return res.liked.map(item => item.trackID)
    })
    .then(trackIDs => {
      console.log(trackIDs)
      return Song.find({'_id': { $in: trackIDs}})
    })
    .then(songs => res.json(songs))
    .catch(err => console.log(err))

})

module.exports = router
