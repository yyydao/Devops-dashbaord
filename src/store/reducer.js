
import * as types from './types';

const initialState = {
    token: null,
    userInfo: null,
    permissionList: null,
    projectId: null
}


const deepClone = function(source) {
    let target
    const sourceType = Object.prototype.toString.call(source).toLowerCase();

    if (sourceType === '[object object]' || sourceType === '[object array]') {
        target = sourceType.indexOf('array') >= 0 ? [] : {};

        for (let i in source) {
            target[i] = deepClone(source[i]);
        }
    } else {
        target = source;
    }

    return target;
}


export default function(state, action){
    if (!state) {
        return initialState;
    }

    const nextState = deepClone(state);

    switch(action.type){
        case types.SET_TOKEN: 
            localStorage.setItem('token', action.data);
            nextState.token = action.data;
        break;

        case types.SET_USERINFO: 
            localStorage.setItem('userInfo', JSON.stringify(action.data));
            nextState.userInfo = action.data;
        break;
        
        case types.SET_PERMISSIONLIST:
            nextState.permissionList = action.data;
        break;

        case types.SET_PROJECTID: 
            if(action.data){
                localStorage.setItem('projectId', action.data);
            }else{
                localStorage.removeItem('projectId');
            }
            nextState.projectId = action.data;
        break;
    }

    return nextState;
}