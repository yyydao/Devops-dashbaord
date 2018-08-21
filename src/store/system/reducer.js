import {
  SET_TAB_PATH,
  SET_SUCCESS_PACKAGE,
  SET_FAILURE_PACKAGE,
  SET_UNFINISH_PACAKGE,
  SET_PERFORMANCE_ID,
  SET_PACKAGE_ID
} from '../action-type'
import {Map, List} from "immutable";

const initialState = Map({
  // 路由路径
  path: List([
    {
      key: "home",
      name: "主页"
    }
  ]),
  successPackageList: List([]),   // 成功包列表
  failurePackageList: List([]),   // 失败包列表
  unFinishList: List([]),           //  未完成包列表
  performanceId: '',    // 选中的性能测试平台id
  packageId: ''          // 选中的包管理平台id
});

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SUCCESS_PACKAGE:
      return state.merge({
        successPackageList: action.data
      });
    case SET_FAILURE_PACKAGE:
      return state.merge({
        failurePackageList: action.data
      });
    case SET_UNFINISH_PACAKGE:
      return state.merge({
        unFinishList: action.data
      })
    case SET_TAB_PATH:
      return state.merge({
        path: action.data
      });
    case SET_PERFORMANCE_ID:
      return state.merge({
        performanceId: action.data
      })
    case SET_PACKAGE_ID:
      return state.merge({
        packageId: action.data
      })

    default:
      return state
  }
}
