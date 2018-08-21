import {_get} from './index'

//获取分支列表
export const branchList = (data) => {
  let req = {
    data: data
  };
  req.url = 'branch/list'
  return _get(req);
}

// 分支新增
export const branchAdd = (data) => {
  let req = {
    data
  }
  req.url = 'branch/add'
  return _get(req)
}

// 平台删除
export const branchDelete = (data) => {
  let req = {
    data
  }
  req.url = 'branch/delete'
  return _get(req)
}

// 分支更新
export const branchUpdate = (data) => {
  let req = {
    data
  }
  req.url = 'branch/update'
  return _get(req)
}