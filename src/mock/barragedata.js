// 使用 Mock
const Mock = require('mockjs')
Mock.mock('barrage.php', {
  'list|1-10': [{
    'constent': Mock.Random.cparagraph(1, 2),
    'color': Mock.Random.color(),
    'date|1-36': Number,
    'position': Mock.Random.pick(['0', '1', '2'])
  }]
})
