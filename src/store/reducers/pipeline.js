import {
  SET_STEP,
  SET_STEPS,
  REMOVE_STEPS,
} from '../actions/pipeline'

const initialState = {
  stepsList: [
    [1, []],
    [2, []],
    [3, []]
  ]
}

export default function project (state = initialState, action = {}) {
  switch (action.type) {
    case SET_STEP:
      if (action.payload) {
        let tempList = JSON.parse(localStorage.getItem('steps'))

        if (!tempList) {
          tempList = [
            [1, []],
            [2, []],
            [3, []]
          ]
        }
        for (let i = 0; i < tempList.length; i++) {
          const tempListElement = tempList[i]
          if (tempListElement[0] === action.payload.stepCategory) {
            tempListElement[1].push(action.payload)
          }
        }
        localStorage.setItem('steps', JSON.stringify(tempList))
        return Object.assign({}, initialState, { stepsList: tempList })
      } else {
        localStorage.setItem('steps', initialState.stepsList)
        return Object.assign({}, initialState, {})
      }
    case SET_STEPS:
      if (action.payload) {
        localStorage.setItem('steps', JSON.stringify(action.payload))
        Object.assign({}, initialState, { stepsList: action.payload })
      } else {
        localStorage.setItem('steps', initialState.stepsList)
      }

      break
    case REMOVE_STEPS:
      if (action.payload) {
        let tempList = JSON.parse(localStorage.getItem('steps'))
        if (!tempList) {
          tempList = initialState.stepsList
        }
        for (let i = 0; i < tempList.length; i++) {
          const tempListElement = tempList[i]
          if (tempListElement[0] === action.payload.stepCategory) {
            tempListElement[1].push(action.payload)
          }
        }
        localStorage.setItem('steps', JSON.stringify(tempList))
        Object.assign({}, initialState, { stepsList: tempList })
      } else {
        localStorage.setItem('steps', initialState.stepsList)
      }

      break
    default:
      return state
  }
}
