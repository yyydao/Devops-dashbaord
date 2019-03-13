import {
  SET_PROJECTID,
  SET_PLATFORM,
  SET_TESTBUILDTYPE
} from '../actions/project'

const initialState = {
  permissionList: null,
  projectId: null,
  testBuildType:null,
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
      window.localStorage.setItem('testBuildType', action.payload)
      return Object.assign({}, state, { testBuildType: action.payload})
    default:
      return state
  }
}
