const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    require: true
  },
  icon: {
    type: String,
    default: 'fa-solid fa-comment-dollar'
  }
})

module.exports = mongoose.model('Category', categorySchema)
