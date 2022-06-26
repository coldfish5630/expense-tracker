const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({ email })
          if (!user) {
            return done(
              null,
              false,
              req.flash('warning_msg', '資料驗證失敗，請重新輸入')
            )
          }
          const isMatch = await bcrypt.compare(password, user.password)
          if (!isMatch) {
            return done(
              null,
              false,
              req.flash('warning_msg', 'Email或密碼錯誤，請重新輸入')
            )
          }
          return done(null, user)
        } catch (err) {
          console.log(err)
        }
      }
    )
  )
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, email } = profile._json
          const isUser = await User.findOne({ email })
          if (isUser) {
            return done(null, isUser)
          }
          const randomPassword = Math.random()
            .toString(36)
            .slice(-8)
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(randomPassword, salt)
          const user = await User.create({ name, email, password: hash })
          done(null, user)
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
