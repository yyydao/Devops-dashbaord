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
    case 'SET_STEP':
      // console.log(`types.SET_STEP ${JSON.stringify(action.data)}`)
      if (action.data) {
        let tempList = JSON.parse(localStorage.getItem('steps'))
        // let tempList = localStorage.getItem('steps')
        // console.log(`SET_STEP action.data ${JSON.stringify(tempList)}`)
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
          if (tempListElement[0] === action.data.stepCategory) {
            tempListElement[1].push(action.data)
          }
        }
        // console.log(`after edit ${JSON.stringify(tempList)}`)
        localStorage.setItem('steps', JSON.stringify(tempList))
        // localStorage.setItem('steps', tempList)
        Object.assign({}, initialState, { stepsList: tempList })
      } else {
        localStorage.setItem('steps', initialState.stepsList)
      }

      break
    case 'SET_STEPS':
      // console.log(action.data)
      if (action.data) {
        localStorage.setItem('steps', JSON.stringify(action.data))
        // localStorage.setItem('steps', action.data)
        // nextState.stepsList = action.data
        Object.assign({}, initialState, { stepsList: action.data })
      } else {
        localStorage.setItem('steps', initialState.stepsList)
      }

      break
    case 'REMOVE_STEPS':
      // console.log(action.data)
      if (action.data) {
        let tempList = JSON.parse(localStorage.getItem('steps'))
        // let tempList = localStorage.getItem('steps')
        if (!tempList) {
          tempList = initialState.stepsList
        }
        // console.log(`reducer ${tempList}`)
        for (let i = 0; i < tempList.length; i++) {
          const tempListElement = tempList[i]
          if (tempListElement[0] === action.data.stepCategory) {
            tempListElement[1].push(action.data)
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
