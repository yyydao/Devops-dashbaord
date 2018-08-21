
import {_delete, _get, _post} from "./index";

// 性能测试分支列表
export const branchList = (data) => {
  let req = {
    data
  }
  req.url = 'performance/branch/list'
  return _get(req)
}

// 性能测试新增分支
export const branchAdd = (data) => {
  let req = {
    data
  }
  req.url = 'performance/branch/add'
  return _post(req)
}

// 分支删除
export const branchDelete = (data) => {
  let req = {
    data
  }
  req.url = `performance/branch/${data.branchId}/delete`
  return _delete(req);
}

// 分支修改
export const branchUpdate = (data) => {
  let req = {
    data
  }
  req.url = 'performance/branch/update'
  return _post(req)
}