import {_get} from './index'
// 新建提测
export const addTest = (data) => {
  let req = {
    data: data
  };
  req.url = 'task/submit'
  return _get(req);
}

// 获取提测内容
export const getTestContent = (data) => {
  let req = {
    data: data
  };
  req.url = 'task/content/get'
  return _get(req);
}

// 回归提测


