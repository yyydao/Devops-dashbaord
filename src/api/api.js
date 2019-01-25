import axios from 'axios'
import qs from 'qs'
import { message, Modal } from 'antd'
import utilConfig from './config'


const confirm = Modal.confirm

axios.defaults.baseURL = utilConfig.baseUrl
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'


axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }else{

    }

    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    if (response.data.code === 401) {
      window.location.href = '#/login'
      return
      // return response
    }


    if (response.data.code === 495) {
      confirm({
        title: '提示信息',
        content: '登录信息过期，请重新登录！',
        onOk () {
          localStorage.removeItem('token')
          localStorage.removeItem('projectId')
          // window.location.href = '#/login'
        },
        onCancel () {}
      })
    }

    return response
  },
  err => {
    if (!err.response) {
      message.error('内部错误')
      return Promise.reject(err)
    }
    if (err.response && err.response.status === 494) {
      localStorage.removeItem('token')
      localStorage.removeItem('projectId')
      window.location.href = err.response.data
    }

    if (err.response) {
      if (err.response.data.message) {
        message.error(err.response.data.message)
      } else {
        message.error(err.response.data.msg)
      }
    }
    return Promise.reject(err)
  }
)

export function reqGet (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params }).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    }).catch(error => {
      console.error(error)
    })
  })
}

export function reqPost (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    }).catch(error => {
      console.error(error)
    })
  })
}

export function reqPostURLEncode (url, params) {
  return new Promise((resolve, reject) => {

    const data = params
    console.log(qs.stringify(data))
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data),
      url,
    }
    axios(options).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    }).catch(error => {
      console.error(error)
    })
  })
}

export function reqDelete (url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, { data: params }).then(res => {
      resolve(res.data)
    }, err => {
      reject(err)
    }).catch(error => {
      console.error(error)
    })
  })
}

export async function checkPermission (url) {
  let data = null
  await reqPost('/permission/urlPermission', { url: url }).then(res => {
    if (parseInt(res.code, 0) === 0) {
      data = res.data
    } else {
      message.error(res.msg)
    }
  })
  return data
}


export async function auth (data) {
  return axios.post('/sys/login',data).then(res=>{
    const d = res.data
    if(d.code !== 0){
      throw d
    }
    return d
  })
}

