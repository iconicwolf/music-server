
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport')

const User = require('../models/User')

const secretOrKey = require('./keys').SECRET_KEY
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secretOrKey

module.exports = passport => {

  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {

    const {user, username} = jwtPayload

    User.findById(user)
      .then(user => {
        if(user) {
          const temp = {
            id: user.id,
            username: user.username
          }
          return done(null, temp)
        }
        done(null, false)
      })
      .catch(dbErr => console.log(dbErr))
  }))
}
