import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  FETCH_PROFILE,
  SET_USERINFO,
  GET_TOKEN,
  SET_TOKEN,
} from '../actions/auth'

const initialState = {
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
        userInfo: user,
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
        userInfo: null,
        loginErrors: null,
        token: null,
      }
    case FETCH_PROFILE:
      console.log(action.payload)
      return Object.assign({}, state, {
        userInfo: action.payload.user,
        loggingIn: false,
        loginErrors: null
      })

    case SET_USERINFO:
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
      return Object.assign({}, state, {
        userInfo: action.payload,
        loggingIn: false,
        loginErrors: null
      })

    default:
      return state
  }
}
