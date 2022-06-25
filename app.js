if (process.env.NODE !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')
const port = process.env.PORT || 3000
const { engine } = require('express-handlebars')
const app = express()

app.engine(
  'hbs',
  engine({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: require('./views/helpers/handlebars')
  })
)
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})

app.use(routes)

app.listen(port, () => console.log(`expense tracker is running on ${port}`))
