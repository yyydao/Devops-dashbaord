import {
  SET_TAB_PATH,
  SET_SUCCESS_PACKAGE,
  SET_FAILURE_PACKAGE,
  SET_UNFINISH_PACAKGE,
  SET_PERFORMANCE_ID,
  SET_PACKAGE_ID
} from '../action-type'

export function setTabPath(path) {
  return {type: SET_TAB_PATH, data: path};
}

export function setSuccessList(packageList) {
  return {type: SET_SUCCESS_PACKAGE, data: packageList}
}

export function setFailureList(packageList) {
  return {type: SET_FAILURE_PACKAGE, data: packageList}
}

export function setUnFinishList(packageList) {
  return {type: SET_UNFINISH_PACAKGE, data: packageList}
}

export function setPerformanceId(id) {
  return {type: SET_PERFORMANCE_ID, data: id}
}

export function setPackageId(id) {
  return {type:SET_PACKAGE_ID,data:id}
}
