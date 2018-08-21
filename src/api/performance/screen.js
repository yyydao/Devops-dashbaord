import {_post, _delete, _get} from "./index";

// 新增性能测试场景
export const addScreen = (data) => {
  let req = {
    data
  }
  req.url = 'performance/testScene/add';
  return _post(req);
}

export const deleteScreen = (data) => {
  let req = {
    data
  }
  req.url = `performance/testScene/${data.deleteSceneId}/delete`;
  return _delete(req);
}

// 获取性能测试场景列表
export const testScreenList = (data) => {
  let req = {
    data
  }
  req.url = `performance/testScene/${data.projectId}/list/`
  return _get(req);
}