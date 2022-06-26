const router = require('express').Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const sort = req.session.sort
    const selected = req.session.selected
    const record = await Record.find({ userId })
      .lean()
      .sort(sort)
    const totalAmount = record
      .map(record => record.amount)
      .reduce((a, b) => a + b, 0)
    const category = await Category.find()
    record.forEach(data => {
      const cate = category.filter(
        cate => data.categoryId.toString() === cate._id.toString()
      )
      data.icon = cate[0].icon
      const d = new Date(data.date)
      const m = d.getMonth() + 1
      data.date = `${d.getFullYear()}／${m < 10 ? 0 : ''}${m}／${
        d.getDate() < 10 ? 0 : ''
      }${d.getDate()}`
    })
    // for await (const data of record) {
    //   const cate = await Category.findById(data.categoryId)
    //   data.icon = cate.icon
    //   const d = new Date(data.date)
    //   const m = d.getMonth() + 1
    //   data.date = `${d.getFullYear()}／${m < 10 ? 0 : ''}${m}／${
    //     d.getDate() < 10 ? 0 : ''
    //   }${d.getDate()}`
    // }

    res.render('index', { record, totalAmount, selected })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
