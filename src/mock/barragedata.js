// 使用 Mock
const Mock = require('mockjs')
Mock.mock('barrage.php', {
  'list|10': [{
    'constent': '@ctitle',
    'color': '@color',
    'date|30-0': 1,
    'position|480-0': 1
  }]
})
