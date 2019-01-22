import { reqGet, reqPost, auth } from '@/api/api'

export const FETCH_PROFILE_PENDING = 'FETCH_PROFILE_PENDING'
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'

export const LOGIN_PENDING = 'LOGIN_PENDING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const login = (username, password) => ({
    type: 'LOGIN',
    payload:{
      promise:reqPost('/sys/login', {
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
      promise: reqGet('/user/getUserInfo')
    }
  }
}



