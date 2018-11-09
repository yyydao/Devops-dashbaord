
export function getQueryString(name){
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

export function stepParamstoObject(notFormattedSteps){
    console.log(notFormattedSteps)
    let obj={ };
    notFormattedSteps.map((item,index)=>{
        obj[item.json_jsonParams] = item.json_jsonValue;
    })
    return obj
}

export function stepParamstoArray (jsonText,stepCode) {

    let paramsArray = [],keyIndex,source = JSON.parse(jsonText);


    if(!stepCode){
        keyIndex = 0
    }else{
        keyIndex = 1;
        paramsArray.push([{key:0,json_jsonParams:'stageID',json_jsonValue:stepCode}])
    }

    for (let prop in source) {
        console.log(source[prop])
        paramsArray.push({key:keyIndex,json_jsonParams:prop,json_jsonValue:source[prop]})
        keyIndex++
    }

    return paramsArray

}
