if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')

const db = require('../../config/mongoose')

const SEED_CATEGORY = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']

db.once('open', () => {
  Promise.all(
    SEED_CATEGORY.map(category => {
      return Category.create({ name: category })
    })
  )
    .then(() => {
      console.log('category done')
      process.exit()
    })
    .catch(err => console.log(err))
})
