
import * as types from './types';

export function setToken(token){
    return { type: types.SET_TOKEN, data: token };
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

export function setSteps(stepList){
    return { type: types.SET_STEPS, data: stepList };
}
