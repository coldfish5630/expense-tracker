if (process.env.NODE !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const routes = require('./routes')
require('./config/mongoose')
const port = process.env.PORT || 3000
const { engine } = require('express-handlebars')

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => console.log(`expense tracker is running on ${port}`))
