if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')

const db = require('../../config/mongoose')

const SEED_CATEGORY = require('./SEED.json').seedCategory

db.once('open', () => {
  Promise.all(
    SEED_CATEGORY.map(category => {
      return Category.create(category)
    })
  )
    .then(() => {
      console.log('category done')
      process.exit()
    })
    .catch(err => console.log(err))
})
