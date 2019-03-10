import {
  SET_PROJECTID,
  SET_PLATFORM,
  SET_TESTBUILDTYPE
} from '../actions/project'

const initialState = {
  permissionList: null,
  projectId: null,
  buildType:null,
}


export default function project(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PROJECTID:
      window.localStorage.setItem('projectId', action.payload)
      return Object.assign({}, state, { projectId: action.payload})
    case SET_PLATFORM:
      window.localStorage.setItem('platform', action.payload)
      return Object.assign({}, state, { platform: action.payload})
    case SET_TESTBUILDTYPE:
      window.localStorage.setItem('buildType', action.payload)
      return Object.assign({}, state, { buildType: action.payload})
    default:
      return state
  }
}
