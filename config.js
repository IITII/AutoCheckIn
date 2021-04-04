/**
 * @author IITII <ccmejx@gmail.com>
 * @date 2021/04/02 20:55
 */
'use strict'
const config = {
  // 经纬度模拟范围（米）
  bound: process.env.AUTO_BOUND || 10,
  // 随机等待一段时间（分）
  maxSleepTime: process.env.AUTO_MAX_SLEEP_TIME || 30,
  // 通过环境变量传入打卡数据时分隔符
  sep: process.env.AUTO_SEP || '#',
  // csv 文件存放路径
  csvFilepath: process.env.AUTO_CSV_PATH || './info.csv'
}

module.exports = config
