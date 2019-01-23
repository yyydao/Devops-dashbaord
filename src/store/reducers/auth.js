import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  FETCH_PROFILE_PENDING,
  FETCH_PROFILE_SUCCESS,
  SET_USERINFO,
  GET_TOKEN,
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
      console.log(action)
      let token = action.payload
      return Object.assign({},initialState,{token})
    case LOGIN_PENDING:
      return Object.assign({}, initialState, { loggingIn: true })

    case LOGIN_SUCCESS:
      let user = action.payload
      console.log(user)
      window.localStorage.setItem('token', user.token)
      window.localStorage.setItem('uid', user.userId)

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
