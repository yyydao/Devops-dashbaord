// import * as types from '../types'

import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  FETCH_PROFILE_PENDING,
  FETCH_PROFILE_SUCCESS
} from '../actions/login'
import * as types from '../types'

const initialState = {
  user: null,
  loggingIn: false,
  loggingOut: false,
  loginErrors: null,

  token: null,
  userInfo: null,
}

export default function login (state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_PENDING:
      return Object.assign({}, initialState, { loggingIn: true })

    case LOGIN_SUCCESS:
      console.log(action)
      let user = action.payload.data
      console.log(user)
      localStorage.setItem('token', action.payload.data)
      window.localStorage.setItem('uid', user.uid)

      return Object.assign({}, state, {
        token: user.token,
        user: user, loggingIn: false,
        loginErrors: null
      })

    case LOGIN_ERROR:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginErrors: action.payload.response.data.message
      }
    case LOGOUT_SUCCESS:
      window.localStorage.removeItem('uid')
      return {
        ...state,
        loggingOut: false,
        user: null,
        loginErrors: null
      }
    case FETCH_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        user: action.payload.data,
        loggingIn: false,
        loginErrors: null
      })

    case types.SET_USERINFO:
      localStorage.setItem('userInfo', JSON.stringify(action.data))
      return Object.assign({}, state, {
        userInfo: action.data,
        user: action.data,
        loggingIn: false,
        loginErrors: null
      })

    // case types.SET_TOKEN:
    //   localStorage.setItem('token', action.data)
    //   return Object.assign({}, state, { user: action.payload.data, loggingIn: false, loginErrors: null })
    // case types.SET_USERINFO:
    //   localStorage.setItem('userInfo', JSON.stringify(action.data))
    //   return Object.assign({}, state, { user: action.payload.data, loggingIn: false, loginErrors: null })
    //
    // case types.SET_PERMISSIONLIST:
    //   return Object.assign({}, state, { permissionList: action.payload.data})
    //
    // case types.SET_PROJECTID:
    //   // if (action.data) {
    //   //   localStorage.setItem('projectId', action.data)
    //   // } else {
    //   //   localStorage.removeItem('projectId')
    //   // }
    //   // nextState.projectId = action.data
    //   return Object.assign({}, state, { projectId: action.payload.data})
    default:
      return state
    // return nextState
  }
}
