import {_delete, _get} from "./index";

// 获取定时任务列表
export const timerList = (data) => {
  let req = {
    data
  }
  req.url = `performance/task/${data.projectId}/timer/list`
  return _get(req)
}

// 删除定时任务
export const deleteTimer = (data) => {
  let req = {
    data
  }
  req.url =`performance/task/timer/${data.timerId}/delete`
  return _delete(req)
}