
import * as types from './types';

const initialState = {
    token: null,
    userInfo: null,
    permissionList: null,
    projectId: null,
    stepList: [
        [1, []],
        [2, []],
        [3, []]
    ]

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

        case types.SET_STEPS:
            console.log(action.data)
            if(action.data){

                let tempList = initialState.stepList
                console.log(tempList)
                for (let i = 0; i < tempList.length; i++) {
                    const tempListElement = tempList[i]
                    if(tempListElement[0] === action.data.stepCategory){
                        tempListElement[1].push(action.data)
                    }
                }
                localStorage.setItem('steps', JSON.stringify(tempList));
                nextState.stepList = tempList
            }else{
                localStorage.setItem('steps',initialState.stepList);
            }

        break;
    }

    return nextState;
}
