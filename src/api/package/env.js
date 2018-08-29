import {_get} from './index'

//获取环境列表
export const envList = (data) => {
  let req = {
    data: data
  };
  req.url = 'env/list'
  return _get(req);
}

// 环境新增
export const envAdd = (data) => {
  let req = {
    data
  }
  req.url = 'env/add'
  return _get(req)
}

// 环境删除
export const envDelete = (data) => {
  let req = {
    data
  }
  req.url = 'env/delete'
  return _get(req)
}

// 环境更新
export const envUpdate = (data) => {
  let req = {
    data
  }
  req.url = 'env/update'
  return _get(req)
}

//  环境详情
export const envDetail = (data) =>{
  let req = {
    data
  }
  req.url = `env/${data.envId}/details`
  return _get(req)
}
