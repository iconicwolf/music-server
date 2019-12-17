
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../config/keys').SECRET_KEY

const User = require('../models/User')
const UserData = require('../models/UserData')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('user.')
})

router.post('/new', (req, res) => {

  const {user} = req.body
  const {password, username} = user

  User.findOne({username: user.username})
    .then(user => {
      if(user)
        return res.json({err: 'Already exists.'})

      bcrypt.genSalt(10)
        .then(salt => {      
          return bcrypt.hash(password, salt)
        })
        .then(hash => {

          new User({
            username,
            password: hash
          })
          .save()
          .then(user => {
            console.log(user)
            new UserData({ user: user._id })
              .save()
              .then(account => console.log(account))
              .catch(err => console.log(err))
            res.json({
              id: user._id,
              username
            })
          })
          .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
        })
    .catch(err => console.log(err))
})

router.post('/login', (req, res) => {

  const {user} = req.body
  console.log(user)
  const {username, password} = user

  User.findOne({username})
    .then(user => {
      if(!user)
        return res.json({err: 'Please check your credentials.'})

      bcrypt.compare(password, user.password)
        .then(matched => {
          if(!matched)
            return res.json({err: 'Please check your credentials.'})

          const payload = {
            user: user._id,
            username
          }

          jwt.sign(payload, SECRET_KEY, (err, token) => {
            if(err)
              return console.log(err)

            res.json({
              id: user._id,
              username,
              token: 'Bearer ' + token
            })
          })
        })
    })
})

module.exports = router
