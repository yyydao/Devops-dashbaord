import uniq from 'lodash.uniq'
import toPairs from 'lodash.topairs'

export function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function getHashPath () {
  const parsedHash = window.location.hash.substr(1)
  return parsedHash
}

export function stepParamstoObject (notFormattedSteps) {
  console.log(notFormattedSteps)
  let obj = {}
  /*eslint-disable array-callback-return*/
  notFormattedSteps.map((item, index) => {
    obj[item.json_jsonParams] = item.json_jsonValue
  })

  return obj
}

export function stepParamstoArray (jsonText, stepCode) {

  let paramsArray = [], keyIndex, source
  if (isJsonString(jsonText)) {
    source = JSON.parse(jsonText)
  } else {
    source = jsonText
  }

  if (!stepCode) {
    keyIndex = 0
  } else {
    keyIndex = 1
    paramsArray.push([{ key: 0, json_jsonParams: 'stageId', json_jsonValue: stepCode }])
  }

  for (let prop in source) {
    console.log(source[prop])
    paramsArray.push({ key: keyIndex, json_jsonParams: prop, json_jsonValue: source[prop] })
    keyIndex++
  }

  return paramsArray

}

export function isJsonString (str) {
  try {
    /*eslint-disable eqeqeq*/
    if (typeof JSON.parse(str) == 'object') {
      return true
    }
  } catch (e) {
  }
  return false
}

export function transLocalStorage (notParsed) {
  let paredStepList = notParsed
  if (Array.isArray(notParsed)) {
    for (let i = 0; i < notParsed.length; i++) {

      const stepElement = notParsed[i][1]
      if (stepElement) {
        for (let j = 0; j < stepElement.length; j++) {
          const stepElementElement = stepElement[j]
          if (isJsonString(stepElementElement.stepParams)) {
            paredStepList[i][1][j].stepParams = JSON.parse(stepElementElement.stepParams)
          }
        }
      }

    }
  }
  return paredStepList
}

export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (time) {
    date = new Date(time)
  } else {
    return '-'
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = `0${value}`
    }
    return value || 0
  })
  return timeStr
}

export function formatTime (time, precision, option) {
  if (!time) {
    return '-'
  }
  let a = time.split(/[^0-9]/)
  const d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
  const now = Date.now()

  const diff = (now - d) / 1000
  /*eslint-disable  default-case*/
  switch (precision) {
    case 'minute':

      if (diff < 30) {
        return '刚刚'
      } else if (diff < 3600) { // less 1 hour
        return `${Math.ceil(diff / 60)}分钟前`
      }
      break
    case 'hour':

      if (diff < 30) {
        return '刚刚'
      } else if (diff < 3600) { // less 1 hour
        return `${Math.ceil(diff / 60)}分钟前`
      } else if (diff < 3600 * 24) {
        return `${Math.ceil(diff / 3600)}小时前`
      }
      break
    case 'day':

      if (diff < 30) {
        return '刚刚'
      } else if (diff < 3600) { // less 1 hour
        return `${Math.ceil(diff / 60)}分钟前`
      } else if (diff < 3600 * 24) {
        return `${Math.ceil(diff / 3600)}小时前`
      } else if (diff < 3600 * 24 * 2) {
        return '1天前'
      }
      break
  }

  if (option) {
    return parseTime(time, precision, option)
  } else {
    return `${d.getMonth() + 1}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`
  }
}

/**
 * 把 秒 转换成对应的 秒、分、时
 * @param time
 * @returns {string}
 */
export function transSecond (time) {
  if (time < 60) {
    return `${time}秒`
  } else if (time < 3600) {
    return `${Math.floor(time / 60)}分钟`
  } else {
    return `${Math.floor(time / 3600)}小时`
  }
}

/**
 * 把 秒 转换成对应的 d-h-m-s
 * @param time
 * @returns {string}
 */
export function formatSecond (time) {
  if (time < 60) {
    return `${time}秒`
  } else if (time < 3600) {
    return `${Math.floor(time / 60)}分钟${Math.floor(time % 60)}秒`
  } else {
    return `${Math.floor(time / 3600)}小时${(Math.floor(time / 60)) % 60}分钟${Math.floor(time % 60)}秒`
  }
}

export function makeHistoryStepCard (stepsList) {
  const category = uniq(stepsList.map(item => item.stepCategory))
  let tempStepObject = {}
  let historyStep = []
  category.forEach((value) => {
    if (value !== undefined) {
      tempStepObject[value] = []
    }
  })
  for (let i = 0; i < stepsList.length; i++) {
    const stepListElement = stepsList[i]
    for (const tempStepObjectKey in tempStepObject) {
      if (stepListElement.stepCategory + '' === tempStepObjectKey + '') {
        tempStepObject[tempStepObjectKey].push(stepListElement)
      }
    }

  }
  historyStep = toPairs(tempStepObject)
  return historyStep
}

/**
 * 转换接口的一维对象数组，按照stepCategory 区分，组装出对应的二维对象数组
 *
 * @param stepsList [{item.stepCategory:1,....},{item.stepCategory:2,....},{item.stepCategory:3,....},....]
 * @returns {Array} [1:[{item.stepCategory:1,....},...],2:[{item.stepCategory:2,....},.....],3:[{item.stepCategory:3,....}]]
 */
export function constructStepCard (stepsList) {
  const category = uniq(stepsList.map(item => item.stepCategory))
  let tempStepObject = {}
  let stepCardArray
  category.forEach((value) => {
    if (value !== undefined) {
      tempStepObject[value] = []
    }
  })
  for (let i = 0; i < stepsList.length; i++) {
    const stepListElement = stepsList[i]
    for (const tempStepObjectKey in tempStepObject) {
      if (stepListElement.stepCategory + '' === tempStepObjectKey + '') {
        tempStepObject[tempStepObjectKey].push(stepListElement)
      }
    }

  }
  stepCardArray = toPairs(tempStepObject)
  return stepCardArray
}

export function composeEditFinalStep (oldFinalStep) {
  if (oldFinalStep.length === 0) {
    oldFinalStep = [['1', []],
      ['2', []],
      ['3', []]]
  } else if (oldFinalStep.length === 1) {
    if (oldFinalStep[0][0] === '1') {
      oldFinalStep.splice(1, 0, ['2', []], ['3', []])
    } else if (oldFinalStep[0][0] === '2') {
      oldFinalStep.splice(0, 0, ['1', []])
      oldFinalStep.splice(2, 0, ['3', []])
    } else if (oldFinalStep[0][0] === '3') {
      oldFinalStep.splice(1, 0, ['2', []])
      oldFinalStep.splice(2, 0, ['3', []])
    }
  } else if (oldFinalStep.length === 2) {
    let tempSum = 0
    for (let i = 0; i < oldFinalStep.length; i++) {
      const oldFinalStepElement = oldFinalStep[i]
      tempSum += oldFinalStepElement[0] * 1
    }
    /*eslint-disable  default-case*/
    switch (tempSum) {
      case 3:
        oldFinalStep.splice(2, 0, ['3', []])
        break
      case 4:
        oldFinalStep.splice(1, 0, ['2', []])
        break
      case 5:
        oldFinalStep.splice(0, 0, ['1', []])
        break
    }
  }
  return oldFinalStep
}

/**
 * 检查用户权限
 * @param permissionUrl
 * @param permissionList
 * @returns {Boolean}
 */
export function checkPermission (permissionUrl, permissionList) {
  if (!Array.isArray(permissionList)) {
    return false
  }
  let result = permissionList.map(item => {
    if (typeof item === 'string') {
      return item.indexOf(permissionUrl) > -1
    }
  })
  return result.includes(true)
}
