import {
  SET_PROJECTID_SUCCESS
} from '../actions/project'

const initialState = {
  permissionList: null,
  projectId: null,
}


export default function project(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PROJECTID_SUCCESS:
      // if (action.data) {
      //   localStorage.setItem('projectId', action.data)
      // } else {
      //   localStorage.removeItem('projectId')
      // }
      // nextState.projectId = action.data
      window.localStorage.setItem('projectId', action.data)
      return Object.assign({}, state, { projectId: action.payload.data})
    default:
      return state
  }
}
