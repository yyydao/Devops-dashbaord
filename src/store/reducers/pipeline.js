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
      // console.log(`types.SET_STEP ${JSON.stringify(action.payload)}`)
      if (action.payload) {
        let tempList = JSON.parse(localStorage.getItem('steps'))
        // let tempList = localStorage.getItem('steps')
        // console.log(`SET_STEP action.payload ${JSON.stringify(tempList)}`)
        // console.log(`${tempList}`)
        // console.log(initialState.stepsList)

        if (!tempList) {
          tempList = [
            [1, []],
            [2, []],
            [3, []]
          ]
        }
        // console.log(`before edit ${JSON.stringify(tempList)}`)
        for (let i = 0; i < tempList.length; i++) {
          const tempListElement = tempList[i]
          if (tempListElement[0] === action.payload.stepCategory) {
            tempListElement[1].push(action.payload)
          }
        }
        // console.log(`after edit ${JSON.stringify(tempList)}`)
        localStorage.setItem('steps', JSON.stringify(tempList))
        // localStorage.setItem('steps', tempList)
        return Object.assign({}, initialState, { stepsList: tempList })
      } else {
        console.log('else')
        localStorage.setItem('steps', initialState.stepsList)
        return Object.assign({}, initialState, {})
      }
    case SET_STEPS:
      // console.log(action.payload)
      if (action.payload) {
        localStorage.setItem('steps', JSON.stringify(action.payload))
        // localStorage.setItem('steps', action.payload)
        // nextState.stepsList = action.payload
        Object.assign({}, initialState, { stepsList: action.payload })
      } else {
        localStorage.setItem('steps', initialState.stepsList)
      }

      break
    case REMOVE_STEPS:
      // console.log(action.payload)
      if (action.payload) {
        let tempList = JSON.parse(localStorage.getItem('steps'))
        // let tempList = localStorage.getItem('steps')
        if (!tempList) {
          tempList = initialState.stepsList
        }
        // console.log(`reducer ${tempList}`)
        for (let i = 0; i < tempList.length; i++) {
          const tempListElement = tempList[i]
          if (tempListElement[0] === action.payload.stepCategory) {
            tempListElement[1].push(action.payload)
          }
        }
        localStorage.setItem('steps', JSON.stringify(tempList))
        // localStorage.setItem('steps', tempList)
        // nextState.stepsList = tempList
        Object.assign({}, initialState, { stepsList: tempList })
      } else {
        localStorage.setItem('steps', initialState.stepsList)
      }

      break
    default:
      return state
    // return nextState
  }
}
