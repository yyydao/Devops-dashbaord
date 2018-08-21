import {_get,_post} from "./index";

// 获取成功列表
export const successList = (data) => {
  let req = {
    data
  }
  req.url = 'performance/task/success/list'
  return _get(req)
}

// 获取未完成列表
export const unfinishList = (data) => {
  let req = {
    data
  };
  req.url = 'performance/task/building/list'
  return _get(req);
}

// 获取失败列表
export const failureList = (data) => {
  let req = {
    data
  };
  req.url = 'performance/task/failure/list'
  return _get(req);
}


export const taskSubmit = (data) => {
  let req = {
    data
  }
  req.url = 'performance/task/submit'
  return _post(req)
}

// 取消定时任务
export const taskCancel = (data) => {
  let req = {
    data
  }
  req.url = `performance/task/${data.buildId}/cancle`
  return _post(req)
}