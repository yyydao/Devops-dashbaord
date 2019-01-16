
import * as types from './types';

export function setToken(token){
    return { type: types.SET_TOKEN, data: token };
}

export function setLoginInfo(loginInfo){

  return { type: types.SET_USERINFO, data: loginInfo };
}


export function setUserInfo(userInfo){
    return { type: types.SET_USERINFO, data: userInfo };
}

export function setPermissionList(permissionList){
    return { type: types.SET_PERMISSIONLIST, data: permissionList };
}

export function setProjectId(projectId){
    return { type: types.SET_PROJECTID, data: projectId };
}

export function setStep(step){
    return { type: types.SET_STEP, data: step };
}

export function setSteps(stepList){
    return { type: types.SET_STEPS, data: stepList };
}

export function removeSteps(stepList){
    return { type: types.REMOVE_STEPS, data: stepList };
}
