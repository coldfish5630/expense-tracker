const hbshelper = {
  compare: (val1, val2, options) => {
    if (val1 === val2) return options.fn({ selected: 'selected' })
  },
  notExist: (val, options) => {
    if (!val) return options.fn({ selected: 'selected' })
  },
  checkDate: (val, options) => {
    if (!val) {
      const date = new Date()
      const month = date.getMonth() + 1
      return options.fn({
        date: `${date.getFullYear()}-${month < 10 ? 0 : ''}${month}-${
          date.getDate() < 10 ? 0 : ''
        }${date.getDate()}`
      })
    } else {
      const date = new Date(val)
      const month = date.getMonth() + 1
      return options.fn({
        date: `${date.getFullYear()}／${month < 10 ? 0 : ''}${month}／${
          date.getDate() < 10 ? 0 : ''
        }${date.getDate()}`
      })
    }
  }
}

module.exports = hbshelper
