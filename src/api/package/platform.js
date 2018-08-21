import {_get} from './index'

//获取平台列表
export const platformList = (data) => {
  let req = {
    data: data
  };
  req.url = 'platform/list'
  return _get(req);
}

// 平台新增
export const platformAdd = (data) => {
  let req = {
    data
  }
  req.url = 'platform/add'
  return _get(req)
}

// 平台删除
export const platformDelete = (data) => {
  let req = {
    data
  }
  req.url = 'platform/delete'
  return _get(req)
}

// 平台更新
export const platformUpdate = (data) => {
  let req = {
    data
  }
  req.url = 'platform/update'
  return _get(req)
}

// 平台详情
export const platformDetail = (data) =>{
  let req = {
    data
  }
  req.url = 'platform/details'
  return _get(req)
}