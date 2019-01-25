import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  FETCH_PROFILE_PENDING,
  FETCH_PROFILE_SUCCESS,
  SET_USERINFO,
  GET_TOKEN,
  SET_TOKEN,
} from '../actions/auth'

const initialState = {
  user: null,
  loggingIn: false,
  loggingOut: false,
  loginErrors: null,

  token: null,
  userInfo: null,
}

export default function auth (state = initialState, action = {}) {
  switch (action.type) {
    case GET_TOKEN:
      return Object.assign({}, initialState, { token: action.payload })
    case SET_TOKEN:
      return Object.assign({}, initialState, { token: action.payload })
    case LOGIN_PENDING:
      return Object.assign({}, initialState, { loggingIn: true })

    case LOGIN_SUCCESS:
      let user = action.payload
      window.localStorage.setItem('token', user.token)
      window.localStorage.setItem('uid', user.userId)

      return Object.assign({}, state, {
        token: user.token,
        user: user,
        loggingIn: false,
        loginErrors: null
      })

    case LOGIN_ERROR:
      return Object.assign({}, state, {
        loggingIn: false,
        user: null,
        loginErrors: action.payload.msg
      })
    case LOGOUT_SUCCESS:
      window.localStorage.removeItem('uid')
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('userInfo')
      return {
        ...state,
        loggingOut: false,
        user: null,
        loginErrors: null,
        token: null,
        userInfo: null
      }
    case FETCH_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        user: action.payload.data,
        userInfo: action.payload.data,
        loggingIn: false,
        loginErrors: null
      })

    case SET_USERINFO:
      localStorage.setItem('userInfo', JSON.stringify(action.data))
      return Object.assign({}, state, {
        userInfo: action.data,
        user: action.data,
        loggingIn: false,
        loginErrors: null
      })

    default:
      return state
  }
}
