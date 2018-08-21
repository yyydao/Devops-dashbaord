import {_get} from './index'

//获取平台列表
export const envList = (data) => {
  let req = {
    data: data
  };
  req.url = 'env/list'
  return _get(req);
}

// 平台新增
export const envAdd = (data) => {
  let req = {
    data
  }
  req.url = 'env/add'
  return _get(req)
}

// 平台删除
export const envDelete = (data) => {
  let req = {
    data
  }
  req.url = 'env/delete'
  return _get(req)
}

// 平台更新
export const envUpdate = (data) => {
  let req = {
    data
  }
  req.url = 'env/update'
  return _get(req)
}
