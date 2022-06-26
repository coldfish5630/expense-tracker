if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')

const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const SEED_USER = require('./SEED.json').seedUser
const SEED_RECORD = require('./SEED.json').seedRecord

const db = require('../../config/mongoose')

db.once('open', async () => {
  try {
    for await (const seedUser of SEED_USER.map(i => i)) {
      const checkUser = await User.findOne({ email: seedUser.email })
      if (checkUser) {
        console.log(`${checkUser.email}email already exist`)
        return
      }
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(seedUser.password, salt)
      const user = await User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hash
      })
      for await (const seedRecord of SEED_RECORD.map(j => j)) {
        if (seedRecord.user === user.name) {
          seedRecord.userId = user._id
          const cate = await Category.findOne({ name: seedRecord.category })
          seedRecord.categoryId = cate._id
          await Record.create(seedRecord)
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
  console.log('record done')
  process.exit()
})
