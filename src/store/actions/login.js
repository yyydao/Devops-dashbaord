import { reqGet, reqPost } from '@/api/api'
// import * as types from '../types'

export const FETCH_PROFILE_PENDING = 'FETCH_PROFILE_PENDING'
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'

export const LOGIN_PENDING = 'LOGIN_PENDING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export function login (username, password) {
  return {
    type: 'LOGIN',
    payload: {
      promise:
        reqPost('/sys/login', {
          username: username,
          password: password,
        })
    }
  }
}

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

