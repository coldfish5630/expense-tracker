const router = require('express').Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', async (req, res) => {
  try {
    const body = req.body
    body.userId = req.user._id
    const category = await Category.findOne({ name: body.categoryId })
    body.categoryId = category._id
    await Record.create(body)
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

router.get('/sort', async (req, res) => {
  try {
    const userId = req.user._id
    const sortType = req.query.type.split(':')
    const sort = sortType[1] === 'asc' ? sortType[0] : '-' + sortType[0]
    const selected = sortType[2]
    req.session.sort = sort
    req.session.selected = selected
    const record = await Record.find({ userId })
      .lean()
      .sort(sort)
    const totalAmount = record
      .map(record => record.amount)
      .reduce((a, b) => a + b, 0)
    for await (const data of record.map(i => i)) {
      const cate = await Category.findById(data.categoryId)
      data.icon = cate.icon
    }
    res.render('index', { record, selected, totalAmount })
  } catch (err) {
    console.log(err)
  }
})

router.get('/filter', async (req, res) => {
  try {
    const userId = req.user._id
    const name = req.query.category
    const sort = req.session.sort
    const selected = req.session.selected
    const category = await Category.findOne({ name })
    const record = await Record.find({ userId, categoryId: category._id })
      .lean()
      .sort(sort)
    const totalAmount = record
      .map(record => record.amount)
      .reduce((a, b) => a + b, 0)
    record.forEach(i => (i.icon = category.icon))
    res.render('index', { record, selected, totalAmount, filter: name })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    const record = await Record.findOne({ _id, userId }).lean()
    const category = await Category.findOne({ _id: record.categoryId })
    record.categoryId = category.name
    const date = new Date(record.date)
    const month = date.getMonth() + 1
    record.date = `${date.getFullYear()}-${month < 10 ? 0 : ''}${month}-${
      date.getDate() < 10 ? 0 : ''
    }${date.getDate()}`
    res.render('new', { record })
  } catch (err) {
    console.log(err)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    let { name, amount, categoryId, date } = req.body
    const category = await Category.findOne({ name: categoryId })
    categoryId = category._id
    const record = await Record.findOne({ _id, userId })
    record.name = name
    record.amount = amount
    record.categoryId = categoryId
    record.date = date
    await record.save()
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    const record = await Record.findOne({ _id, userId })
    await record.remove()
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
