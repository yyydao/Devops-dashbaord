import {_get, _post, _delete} from "./index";

// 性能测试项目列表
export const projectList = (data) => {
  let req = {
    data
  }
  req.url = 'performance/project/list'
  return _get(req);
}

// 性能测试项目修改
export const projectUpdate = (data) => {
  let req = {
    data
  }
  req.url = 'performance/project/update'
  return _post(req);
}

// 新增性能测试项目
export const addProject = (data) => {
  let req = {
    data
  }
  req.url = 'performance/project/add'
  return _post(req)
}

// 删除性能测试项目
export const deleteProject = (data) => {
  let req = {
    data
  }
  req.url = `performance/project/${data.projectId}/delete`
  return _delete(req)
}

// 项目对应的详情
export const detailProject = (data) => {
  let req = {
    data
  }
  req.url = `performance/project/${data.projectId}/details`
  return _get(req);
}
