import config from '../config'
import {message} from 'antd';

const baseURL = config.baseURL;
const axios = require('axios').create({
  baseURL: baseURL,            //api请求的baseURL
  timeout: 0,
  withCredentials: true, // 允许跨域 cookie
  headers: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
  maxContentLength: 2000,
  transformResponse: [function (data) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = {};
    }
    if (data.code !== 0 && data.code !== '0') {
      message.error(data.msg);
    }
    return data;
  }]
})

// get
export const _get = (req) => {
  return axios.get(req.url, {params: req.data})
}

// post
export const _post = (req) => {
  return axios({
    method: 'post',
    url: `/${req.url}`,
    data: req.data,
    params: req.data,
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  })
}

//patch
export const _put = (req) => {
  return axios({method: 'put', url: `/${req.url}`, data: req.data})
}

//delete
export const _delete = (req) => {
  return axios({method: 'delete', url: `/${req.url}`, data: req.data})
}

//post and no withCredentials
export const _postNoWithCredentials = (req) => {
  return axios({method: 'post', url: `/${req.url}`, data: req.data, withCredentials: false})
}
