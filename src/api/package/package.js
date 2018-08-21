import {_get, _post} from './index'
//获取包列表
export const packageList = (data) => {
  let req = {
    data: data
  };
  req.url = 'package/list'
  return _get(req);
}

// 获取更多版本
export const moreVersion = (data) => {
  let req = {
    data: data
  };
  req.url = 'package/version/more'
  return _get(req);
}

// 获取更多build
export const moreBuild = (data) => {
  let req = {
    data: data
  };
  req.url = 'package/build/more'
  return _get(req);
}

// 获取包详情
export const packageDetail = (data) => {
  let req = {
    data: data
  };
  req.url = 'package/detail'
  return _get(req);
}

// 包下载
export const packageDownload = (id) => {
  // const baseURL = config.baseURL;
  /* const baseURL = 'http://10.100.18.35:8080';
   let url = baseURL + '/package/download?buildId=' + id;*/
  let url = '/package/download?buildId=' + id;
  window.open(url);
}

// 获取失败包
export const packageFailure = (data) => {
  let req = {
    data: data
  };
  req.url = 'package/failure/record'
  return _get(req);
}

// 重新提交失败包
export const failureRecommit = (data) => {
  let req = {
    data: data
  };
  req.url = 'package/failure/recommit'
  return _post(req);
}

// 包回归
export const packageRebuild = (data) => {
  let req = {
    data: data
  };
  req.url = 'package/rebuild'
  return _post(req);
}


// 未完成包列表
export const unFinishList = (data) => {
  let req = {
    data: data
  };
  req.url = 'package/unfinish/list'
  return _get(req);
}

