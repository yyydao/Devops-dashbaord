import {
  SET_PROJECTID
} from '../actions/project'

const initialState = {
  permissionList: null,
  projectId: null,
}


export default function project(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PROJECTID:
      // if (action.data) {
      //   localStorage.setItem('projectId', action.data)
      // } else {
      //   localStorage.removeItem('projectId')
      // }
      // nextState.projectId = action.data
      window.localStorage.setItem('projectId', action.payload)
      return Object.assign({}, state, { projectId: action.payload})
    default:
      return state
  }
}
