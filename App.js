/**
 * @author IITII <ccmejx@gmail.com>
 * @date 2021/04/02 16:44
 */
'use strict'
const fs = require('fs'),
  {Readable} = require('stream'),
  axios = require('axios').default,
  tough = require('tough-cookie'),
  axiosCookieJarSupport = require('axios-cookiejar-support').default,
  cookieJar = new tough.CookieJar(),
  {uniqBy} = require('lodash'),
  csv = require('csv-parser'),
  SimpleLogger = require('./logger'),
  config = require('./config')

const BASE_URL = 'https://fxgl.jx.edu.cn',
  FractionDigits = 6,
  // 学校代码,学号,省,市,区/县,具体地址,经度,纬度
  CSV_HEADERS = ['school', 'id', 'province', 'city', 'district', 'street', 'lng', 'lat'],
  USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36"

// keep sessions
// see: https://github.com/3846masa/axios-cookiejar-support/blob/master/example/set-default.js
axiosCookieJarSupport(axios)
axios.defaults.jar = cookieJar
axios.defaults.withCredentials = true

axios.defaults.baseURL = BASE_URL
axios.defaults.headers['User-Agent'] = USER_AGENT

/**
 * 随机等待一段时间（分）
 * @param logger logger
 * @param random{number} 最大时间（单位：分钟）
 */
async function sleep(logger = SimpleLogger.getLogger(), random = 30) {
  return await new Promise(resolve => {
    const sleepMinutes = random * Math.random()
    const sleepTime = Math.round(sleepMinutes * 60 * 1000)
    logger.info(`随机睡眠 ${sleepMinutes.toFixed(1)} 分钟...`)
    setTimeout(_ => {
      return resolve()
    }, sleepTime)
  })
}

async function csvParse(filePath) {
  return await new Promise((resolve, reject) => {
    let stream = null
    const envCsv = process.env.AUTO_CSV
    if (envCsv !== undefined && envCsv !== '') {
      stream = Readable.from(envCsv.split(config.sep).join('\n'))
    } else {
      if (!fs.existsSync(filePath)) return reject(new Error('File not found!!!'))
      stream = fs.createReadStream(filePath, {encoding: 'utf-8', autoClose: true})
    }
    let res = []
    const op = {
      strict: true,
      skipLines: 1,
      skipComments: true,
      headers: CSV_HEADERS
    }
    stream.pipe(csv(op))
      .on('data', data => res = res.concat(data))
      .once('end', _ => resolve(res))
      .once('error', e => reject(e))
  })
}

/**
 * 登陆
 * @param school 学校id
 * @param id 学号
 * @param type 用户类型，0：学生，1：教师
 */
async function login(school, id, type = 0) {
  return await new Promise((resolve, reject) => {
    const client = axios.create()
    // https://fxgl.jx.edu.cn/{stu[0]}/public/homeQd?loginName={stu[1]}&loginType=0
    client
      .get(`/${school}/public/homeQd?loginName=${id}&loginType=${type}`)
      .then(_ => resolve(client))
      .catch(e => reject(e))
  })
}

/**
 * 打卡
 * @param school 学校id
 * @param info 用户信息
 * @param client axios 实例
 */
async function checkIn(school, info, client) {
  return await new Promise((resolve, reject) => {
    const postUrl = `/${school}/studentQd/saveStu`
    client.post(postUrl, getPostData(info), {responseType: 'json'})
      .then(res => resolve(res.data))
      .catch(e => reject(e))
  })
}

/**
 * 处理 post 数据
 */
function getPostData(info) {
  const province = info[CSV_HEADERS[2]],
    city = info[CSV_HEADERS[3]],
    district = info[CSV_HEADERS[4]],
    street = info[CSV_HEADERS[5]],
    lng = info[CSV_HEADERS[6]],
    lat = info[CSV_HEADERS[7]]
  const data = {
    // 省份
    'province': province,
    // 市
    'city': city,
    // 区/县
    'district': district,
    // 具体地址
    'street': street,
    'xszt': '0',
    // 健康状况 0:健康 1:异常
    'jkzk': '0',
    // 异常原因
    'jkzkxq': '',
    // 是否隔离 0:隔离 1:未隔离
    'sfgl': '1',
    'gldd': '',
    'mqtw': '0',
    'mqtwxq': '',
    // 省市区
    'zddlwz': province + city + district,
    'sddlwz': '',
    'bprovince': province,
    'bcity': city,
    'bdistrict': district,
    'bstreet': street,
    'sprovince': province,
    'scity': city,
    'sdistrict': district,
    // 经度，至少精确到小数点后6位
    'lng': parseFloat(lng),
    // 纬度，至少精确到小数点后6位
    'lat': parseFloat(lat),
    // 是否为毕业生 0:是 1:否
    'sfby': '0'
  }
  data.lng = +(data.lng + offset(config.bound, FractionDigits)).toFixed(FractionDigits)
  data.lat = +(data.lat + offset(config.bound, FractionDigits)).toFixed(FractionDigits)
  return data
}

/**
 * 粗略模拟经纬度偏差。
 * 根据数学粗略计算：
 * <pre>
 +------------+----------+
 | 经纬度偏差 | 粗略距离 |
 +============+==========+
 |  0.000100  |    1M    |
 +------------+----------+
 |  0.000100  |    11M   |
 +------------+----------+
 |  0.001000  |   111M   |
 +------------+----------+
 * </pre>
 * @param bound 模拟范围（米）
 * @param fractionDigits 保留小数位
 */
function offset(bound, fractionDigits = 6) {
  bound = parseInt(bound)
  fractionDigits = parseInt(fractionDigits)
  const minOffset = 0.000100
  const positive = Math.random() > 0.5
  const offset = (minOffset * Math.random() * bound).toFixed(fractionDigits)
  // Number.toFixed() return a string
  // We need using '+' or '-' to convert string to number
  return positive ? +offset : -offset
}


async function main(info) {
  return await new Promise(async (resolve, reject) => {
    const school = info[CSV_HEADERS[0]],
      id = info[CSV_HEADERS[1]],
      logger = SimpleLogger.getLogger(id)
    try {
      // sleep
      await sleep(logger, config.maxSleepTime)
      // login
      logger.info('登录中...')
      const client = await login(school, id)
      logger.info('登录成功')
      // CheckIn
      logger.info('自动打卡...')
      logger.debug(getPostData(info))
      checkIn(school, info, client)
        .then(_ => {
          logger.debug(JSON.stringify(_))
          switch (_.code) {
            case 1001 || '1001' :
              logger.info('自动打卡成功!')
              break
            case 1002 || '1002' :
              logger.info('已经打过卡咯~')
              break
            default:
              const detail = JSON.stringify(_)
              logger.error(`自动打卡也许失败了, 建议进支付宝看看, 再联系开发者试试？详细信息：${detail}`)
              return reject(detail)
          }
          return resolve(_)
        })
        .catch(e => {
          logger.error(`自动打卡失败：${e.message || e}`)
          return reject(e)
        })
    } catch (e) {
      logger.error(`主函数执行异常：${e.message || e}`)
      return reject(e)
    }
  })
}

(async filePath => {
  const infos = await csvParse(filePath),
    logger = SimpleLogger.getLogger('TOTAL')
  logger.debug(infos)
  Promise.allSettled(uniqBy(infos, CSV_HEADERS[1]).map(_ => main(_)))
    .then(res => {
      return {
        success: res.filter(_ => _.status === 'fulfilled'),
        failed: res.filter(_ => _.status !== 'fulfilled')
      }
    })
    .then(res => {
      logger.info(`打卡成功：${res.success.length}`)
      logger.info(`打卡失败：${res.failed.length}`)
    })
    .catch(e => logger.error(e.message || e))
})(config.csvFilepath)
