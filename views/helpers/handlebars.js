const hbshelper = {
  compare: (val1, val2, options) => {
    if (val1 === val2) return options.fn({ selected: 'selected' })
  }
}

module.exports = hbshelper
