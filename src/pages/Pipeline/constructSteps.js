import uniq from 'lodash.uniq'
import toPairs from 'lodash.topairs'

/**
 * 转换接口的一维对象数组，按照stepCategory 区分，组装出对应的二维对象数组
 *
 * @param stepsList [{item.stepCategory:1,....},{item.stepCategory:2,....},{item.stepCategory:3,....},....]
 * @returns {Array} [1:[{item.stepCategory:1,....},...],2:[{item.stepCategory:2,....},.....],3:[{item.stepCategory:3,....}]]
 */
export function constructStepCard (stepsList) {
    const category = uniq(stepsList.map(item => item.stepCategory))
    let tempStepObject = {}
    let stepCardArray
    category.forEach((value) => {
        if (value !== undefined) {
            tempStepObject[value] = []
        }
    })
    for (let i = 0; i < stepsList.length; i++) {
        const stepListElement = stepsList[i]
        for (const tempStepObjectKey in tempStepObject) {
            if (stepListElement.stepCategory + '' === tempStepObjectKey + '') {
                tempStepObject[tempStepObjectKey].push(stepListElement)
            }
        }

    }
    stepCardArray = toPairs(tempStepObject)
    return stepCardArray
}

const composeRules = {
    0:(dataSource)=> composeZero(dataSource),
    1:(dataSource) => composeSingless(dataSource),
    2: (dataSource)=> composePair(dataSource),
    3:(dataSource)=>(dataSource)
}

function composeZero () {
    return [['1', []],
        ['2', []],
        ['3', []]]
}

function composeSingless (dataSource) {
    let data = dataSource
    const stepCategoryID = dataSource[0][0]
    const singleRules = {
        "1": function(){
            data.splice(1, 0, ['2', []], ['3', []])
        },
        '2': function(){
            data.splice(0, 0, ['1', []])
            data.splice(2, 0, ['3', []])
        },
        '3':function(){
            data.splice(0, 0, ['1', []])
            data.splice(1, 0, ['2', []])
        }
    }
    singleRules[stepCategoryID](dataSource)
    return data
}

function composePair (dataSource) {
    let tempSum = 0
    for (let i = 0; i < dataSource.length; i++) {
        const oldFinalStepElement = dataSource[i]
        tempSum += oldFinalStepElement[0] * 1
    }
    /*eslint-disable default-case*/
    switch (tempSum) {
        case 3:
            dataSource.splice(2, 0, ['3', []])
            break
        case 4:
            dataSource.splice(1, 0, ['2', []])
            break
        case 5:
            dataSource.splice(0, 0, ['1', []])
            break
    }
    return dataSource
}

/**
 *
 * @param incompleteDDA 不完整二维数组
 * @returns {Array} [[stepCategory,[...stepItem]],[]]
 */
export function composeCompleteStep ( incompleteDDA) {
    const stepLength = incompleteDDA.length
    return composeRules[stepLength](incompleteDDA)
}

export function composeCompleteStepAfterRemove ( oldeCompleteDAA,deleteItem) {
    for (let i = 0; i < oldeCompleteDAA.length; i++) {
        if (oldeCompleteDAA[i][0] === deleteItem.stepCategory+'') {
            let steps = oldeCompleteDAA[i][1]
            for (let j = 0; j < steps.length; j++) {
                if(steps[j].stepID+'' === deleteItem.stepID+''){
                    oldeCompleteDAA[i][1].splice(j,1)
                }
            }

        }
    }
    return oldeCompleteDAA
}
