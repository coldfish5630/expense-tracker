const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  registerAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
