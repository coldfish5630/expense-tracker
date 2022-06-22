const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
  try {
    const record = await Record.find().lean()
    const totalAmount = record
      .map(record => record.amount)
      .reduce((a, b) => a + b, 0)
    for await (const data of record.map(i => i)) {
      const cate = await Category.findById(data.categoryId)
      data.icon = cate.icon
    }
    res.render('index', { record, totalAmount })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
