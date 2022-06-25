const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email })
          if (!user) {
            return done(null, false, { message: 'user not found' })
          }
          const isMatch = await bcrypt.compare(password, user.password)
          if (!isMatch) {
            return done(null, false, { message: 'wrong password' })
          }
          return done(null, user)
        } catch (err) {
          console.log(err)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}
