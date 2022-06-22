if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')

const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const db = require('../../config/mongoose')

const SEED_USER = [
  {
    name: '廣志',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: '小新',
    email: 'user2@example.com',
    password: '12345678'
  }
]

const SEED_RECORD = [
  {
    name: '午餐',
    amount: 90,
    category: '餐飲食品',
    user: '廣志',
    date: '2022-06-19'
  },
  {
    name: '晚餐',
    amount: 200,
    category: '餐飲食品',
    user: '廣志',
    date: '2022-06-19'
  },
  {
    name: '捷運',
    amount: 60,
    category: '交通出行',
    user: '廣志',
    date: '2022-06-20'
  },
  {
    name: '電影：驚奇隊長',
    amount: 330,
    category: '休閒娛樂',
    user: '小新',
    date: '2022-06-20'
  },
  {
    name: '房租',
    amount: 25500,
    category: '家居物業',
    user: '廣志',
    date: '2022-06-01'
  }
]

db.once('open', async () => {
  try {
    for await (const seedUser of SEED_USER.map(i => i)) {
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
