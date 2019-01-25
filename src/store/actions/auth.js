import { reqGet, reqPost,auth } from '@/api/api'

export const FETCH_PROFILE_PENDING = 'FETCH_PROFILE_PENDING'
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'

export const LOGIN_PENDING = 'LOGIN_PENDING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const GET_TOKEN = 'GET_TOKEN'
export const SET_TOKEN = 'SET_TOKEN'

export const login = (username, password) => ({
    type: 'LOGIN',
    payload: {
      promise: auth({
        username,
        password
      })
    }

  }
)

export const SET_USERINFO = 'SET_USERINFO'

export function logout () {

  return {
    type: 'LOGOUT',
    payload: {
      promise: reqPost('/logout')
    }
  }
}

export function forceLogout () {

  return {
    type: 'LOGOUT_SUCCESS',
    payload: {}
  }
}

export function getToken () {
  return {
    type: 'GET_TOKEN',
    payload: {
      promise: window.localStorage.getItem('token')
    }

  }
}

export function setToken (token) {
  return {
    type: 'SET_TOKEN',
    payload: token

  }
}

export function setUserInfo (userInfo) {
  return { type: 'SET_USERINFO', data: userInfo }
}

export function fetchProfile () {
  let uid = window.localStorage.getItem('userId')

  if (uid === undefined) {
    return { type: 'UID_NOT_FOUND' }
  }

  return {
    type: 'FETCH_PROFILE',
    payload: {
      promise: reqGet('/sys/user/getUserInfo')
    }
  }
}



