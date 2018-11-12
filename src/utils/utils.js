
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

    let paramsArray = [],keyIndex,source
    if (isJsonString(jsonText)) {
        source = JSON.parse(jsonText)
    } else {
        source = jsonText
    }


    if(!stepCode){
        keyIndex = 0
    }else{
        keyIndex = 1;
        paramsArray.push([{key:0,json_jsonParams:'stageId',json_jsonValue:stepCode}])
    }

    for (let prop in source) {
        console.log(source[prop])
        paramsArray.push({key:keyIndex,json_jsonParams:prop,json_jsonValue:source[prop]})
        keyIndex++
    }

    return paramsArray

}

export function isJsonString (str) {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch(e) {
    }
    return false;
}

export function transLocalStorage (notParsed){
    let paredStepList = notParsed
    if(Array.isArray(notParsed) ){
        for (let i = 0; i < notParsed.length; i++) {

            const stepElement = notParsed[i][1]
            if(stepElement){
                for (let j = 0; j < stepElement.length; j++) {
                    const stepElementElement = stepElement[j]
                    if(isJsonString(stepElementElement.stepParams)){
                        paredStepList[i][1][j].stepParams = JSON.parse(stepElementElement.stepParams)
                    }
                }
            }

        }
    }
    return paredStepList
}
