// 使用 Mock
const Mock = require('mockjs')
Mock.mock('barrage.php', {
  'list|10-100': [{
    'constent': '@ctitle',
    'color': '@color',
    'date|100-10': 1,
    'position': '@pick(["1", "2", "3"])'
  }]
})
