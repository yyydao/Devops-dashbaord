
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


export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }

    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (time) {
        date = new Date(time);
    } else {
        return '-';
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = `0${value}`;
        }
        return value || 0;
    });
    return timeStr;
}

export function formatTime(time, option) {
    if (!time) {
        return '-';
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚';
    } else if (diff < 3600) { // less 1 hour
        return `${Math.ceil(diff / 60)}分钟前`;
    } else if (diff < 3600 * 24) {
        return `${Math.ceil(diff / 3600)}小时前`;
    } else if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return `${d.getMonth() + 1}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`;
    }
}
