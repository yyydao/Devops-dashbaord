import {
    constructStepCard,
    composeCompleteStep,
    composeCompleteStepAfterRemove
} from './constructSteps'

it('should return what I need', () => {
    const stepList = [
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 0,
            'buildNum': 44,
            'execTime': 9864,
            'execTimeStr': '9秒864毫秒',
            'stepCategory': 1,
            'stepName': '代码拉取',
            'stepDesc': 'Gitlab 代码同步'
        },
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 1,
            'buildNum': 44,
            'execTime': 1838,
            'execTimeStr': '1秒838毫秒',
            'stepCategory': 2,
            'stepName': '单元测试',
            'stepDesc': '单元测试'
        },
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 2,
            'buildNum': 44,
            'execTime': 512119,
            'execTimeStr': '8分32秒119毫秒',
            'stepCategory': 1,
            'stepName': '静态扫描',
            'stepDesc': 'SonarQube 代码静态扫描'
        },
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 3,
            'buildNum': 44,
            'execTime': 545741,
            'execTimeStr': '9分5秒741毫秒',
            'stepCategory': 1,
            'stepName': '编译打包',
            'stepDesc': '项目编译打包'
        },
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 4,
            'buildNum': 44,
            'execTime': 13777,
            'execTimeStr': '13秒777毫秒',
            'stepCategory': 1,
            'stepName': '安全扫描',
            'stepDesc': 'MobSF 安全检测'
        },
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 5,
            'buildNum': 44,
            'execTime': 126939,
            'execTimeStr': '2分6秒939毫秒',
            'stepCategory': 2,
            'stepName': 'UI测试',
            'stepDesc': '自动化UI测试'
        },
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 6,
            'buildNum': 44,
            'execTime': 126254,
            'execTimeStr': '2分6秒254毫秒',
            'stepCategory': 2,
            'stepName': '性能测试',
            'stepDesc': '自动化性能测试'
        },
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 7,
            'buildNum': 44,
            'execTime': 253587,
            'execTimeStr': '4分13秒587毫秒',
            'stepCategory': 3,
            'stepName': '加固',
            'stepDesc': '爱加密加固'
        },
        {
            'historyStatus': 2,
            'historyResult': 1,
            'stepCode': 9,
            'buildNum': 44,
            'execTime': 2425,
            'execTimeStr': '2秒425毫秒',
            'stepCategory': 3,
            'stepName': '包管理',
            'stepDesc': 'DevOps平台安装包管理'
        }
    ]

    const result = [
        [
            '1',
            [
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 0,
                    'buildNum': 44,
                    'execTime': 9864,
                    'execTimeStr': '9秒864毫秒',
                    'stepCategory': 1,
                    'stepName': '代码拉取',
                    'stepDesc': 'Gitlab 代码同步'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 2,
                    'buildNum': 44,
                    'execTime': 512119,
                    'execTimeStr': '8分32秒119毫秒',
                    'stepCategory': 1,
                    'stepName': '静态扫描',
                    'stepDesc': 'SonarQube 代码静态扫描'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 3,
                    'buildNum': 44,
                    'execTime': 545741,
                    'execTimeStr': '9分5秒741毫秒',
                    'stepCategory': 1,
                    'stepName': '编译打包',
                    'stepDesc': '项目编译打包'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 4,
                    'buildNum': 44,
                    'execTime': 13777,
                    'execTimeStr': '13秒777毫秒',
                    'stepCategory': 1,
                    'stepName': '安全扫描',
                    'stepDesc': 'MobSF 安全检测'
                }
            ]
        ],
        [
            '2',
            [
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 1,
                    'buildNum': 44,
                    'execTime': 1838,
                    'execTimeStr': '1秒838毫秒',
                    'stepCategory': 2,
                    'stepName': '单元测试',
                    'stepDesc': '单元测试'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 5,
                    'buildNum': 44,
                    'execTime': 126939,
                    'execTimeStr': '2分6秒939毫秒',
                    'stepCategory': 2,
                    'stepName': 'UI测试',
                    'stepDesc': '自动化UI测试'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 6,
                    'buildNum': 44,
                    'execTime': 126254,
                    'execTimeStr': '2分6秒254毫秒',
                    'stepCategory': 2,
                    'stepName': '性能测试',
                    'stepDesc': '自动化性能测试'
                }
            ]
        ],
        [
            '3',
            [
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 7,
                    'buildNum': 44,
                    'execTime': 253587,
                    'execTimeStr': '4分13秒587毫秒',
                    'stepCategory': 3,
                    'stepName': '加固',
                    'stepDesc': '爱加密加固'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 9,
                    'buildNum': 44,
                    'execTime': 2425,
                    'execTimeStr': '2秒425毫秒',
                    'stepCategory': 3,
                    'stepName': '包管理',
                    'stepDesc': 'DevOps平台安装包管理'
                }
            ]
        ]
    ]

    expect(constructStepCard(stepList)).toEqual(result)
})

it('should return double dimensional array steps construction while has no date ', () => {
    const incompleteStepDDA = []
    expect(composeCompleteStep([])).toEqual([['1', []],
        ['2', []],
        ['3', []]])
})

it('should return complete double dimensional array steps construction while has only step category 1 ', () => {
    const incompleteStepDDA =
        [
            ['1',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 0,
                        'buildNum': 44,
                        'execTime': 9864,
                        'execTimeStr': '9秒864毫秒',
                        'stepCategory': 1,
                        'stepName': '代码拉取',
                        'stepDesc': 'Gitlab 代码同步'
                    }
                ]
            ]
        ]

    expect(composeCompleteStep(incompleteStepDDA)).toEqual([
        ['1',
            [
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 0,
                    'buildNum': 44,
                    'execTime': 9864,
                    'execTimeStr': '9秒864毫秒',
                    'stepCategory': 1,
                    'stepName': '代码拉取',
                    'stepDesc': 'Gitlab 代码同步'
                }
            ]],
        ['2',
            []],
        ['3',
            []]
    ])
})

it('should return complete double dimensional array steps construction while has only step category 2 ', () => {
    const incompleteStepDDA =
        [
            ['2',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 1,
                        'buildNum': 44,
                        'execTime': 1838,
                        'execTimeStr': '1秒838毫秒',
                        'stepCategory': 2,
                        'stepName': '单元测试',
                        'stepDesc': '单元测试'
                    }
                ]
            ]
        ]

    expect(composeCompleteStep(incompleteStepDDA)).toEqual([
        ['1', []],
        ['2',
            [
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 1,
                    'buildNum': 44,
                    'execTime': 1838,
                    'execTimeStr': '1秒838毫秒',
                    'stepCategory': 2,
                    'stepName': '单元测试',
                    'stepDesc': '单元测试'
                }
            ]],
        ['3', []]
    ])
})

it('should return complete double dimensional array steps construction while has only step category 3 ', () => {
    const incompleteStepDDA =
        [
            ['3',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 9,
                        'buildNum': 44,
                        'execTime': 2425,
                        'execTimeStr': '2秒425毫秒',
                        'stepCategory': 3,
                        'stepName': '包管理',
                        'stepDesc': 'DevOps平台安装包管理'
                    }
                ]
            ]
        ]

    expect(composeCompleteStep(incompleteStepDDA)).toEqual([
        ['1', []],
        ['2', []],
        ['3', [
            {
                'historyStatus': 2,
                'historyResult': 1,
                'stepCode': 9,
                'buildNum': 44,
                'execTime': 2425,
                'execTimeStr': '2秒425毫秒',
                'stepCategory': 3,
                'stepName': '包管理',
                'stepDesc': 'DevOps平台安装包管理'
            }
        ]]
    ])
})
it('should return complete double dimensional array steps construction while has step category 1 and 2 ', () => {
    const incompleteStepDDA =
        [
            ['1',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 0,
                        'buildNum': 44,
                        'execTime': 9864,
                        'execTimeStr': '9秒864毫秒',
                        'stepCategory': 1,
                        'stepName': '代码拉取',
                        'stepDesc': 'Gitlab 代码同步'
                    }
                ]
            ],
            ['2',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 1,
                        'buildNum': 44,
                        'execTime': 1838,
                        'execTimeStr': '1秒838毫秒',
                        'stepCategory': 2,
                        'stepName': '单元测试',
                        'stepDesc': '单元测试'
                    }
                ]
            ]
        ]

    expect(composeCompleteStep(incompleteStepDDA)).toEqual(
        [
            ['1',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 0,
                        'buildNum': 44,
                        'execTime': 9864,
                        'execTimeStr': '9秒864毫秒',
                        'stepCategory': 1,
                        'stepName': '代码拉取',
                        'stepDesc': 'Gitlab 代码同步'
                    }
                ]],
            ['2',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 1,
                        'buildNum': 44,
                        'execTime': 1838,
                        'execTimeStr': '1秒838毫秒',
                        'stepCategory': 2,
                        'stepName': '单元测试',
                        'stepDesc': '单元测试'
                    }
                ]
            ],
            ['3', []]
        ])
})
it('should return complete double dimensional array steps construction while has step category 1 and 3 ', () => {
    const incompleteStepDDA =
        [
            ['1',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 0,
                        'buildNum': 44,
                        'execTime': 9864,
                        'execTimeStr': '9秒864毫秒',
                        'stepCategory': 1,
                        'stepName': '代码拉取',
                        'stepDesc': 'Gitlab 代码同步'
                    }
                ]
            ],
            ['3',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 1,
                        'buildNum': 44,
                        'execTime': 1838,
                        'execTimeStr': '1秒838毫秒',
                        'stepCategory': 2,
                        'stepName': '单元测试',
                        'stepDesc': '单元测试'
                    }
                ]
            ]
        ]

    expect(composeCompleteStep(incompleteStepDDA)).toEqual(
        [
            ['1',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 0,
                        'buildNum': 44,
                        'execTime': 9864,
                        'execTimeStr': '9秒864毫秒',
                        'stepCategory': 1,
                        'stepName': '代码拉取',
                        'stepDesc': 'Gitlab 代码同步'
                    }
                ]],
            ['2', []],
            ['3',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 1,
                        'buildNum': 44,
                        'execTime': 1838,
                        'execTimeStr': '1秒838毫秒',
                        'stepCategory': 2,
                        'stepName': '单元测试',
                        'stepDesc': '单元测试'
                    }
                ]
            ]
        ])
})
it('should return complete double dimensional array steps construction while has step category 1 and 3 ', () => {
    const incompleteStepDDA =
        [
            ['2',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 0,
                        'buildNum': 44,
                        'execTime': 9864,
                        'execTimeStr': '9秒864毫秒',
                        'stepCategory': 1,
                        'stepName': '代码拉取',
                        'stepDesc': 'Gitlab 代码同步'
                    }
                ]
            ],
            ['3',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 1,
                        'buildNum': 44,
                        'execTime': 1838,
                        'execTimeStr': '1秒838毫秒',
                        'stepCategory': 2,
                        'stepName': '单元测试',
                        'stepDesc': '单元测试'
                    }
                ]
            ]
        ]

    expect(composeCompleteStep(incompleteStepDDA)).toEqual(
        [
            ['1', []],
            ['2',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 0,
                        'buildNum': 44,
                        'execTime': 9864,
                        'execTimeStr': '9秒864毫秒',
                        'stepCategory': 1,
                        'stepName': '代码拉取',
                        'stepDesc': 'Gitlab 代码同步'
                    }
                ]],

            ['3',
                [
                    {
                        'historyStatus': 2,
                        'historyResult': 1,
                        'stepCode': 1,
                        'buildNum': 44,
                        'execTime': 1838,
                        'execTimeStr': '1秒838毫秒',
                        'stepCategory': 2,
                        'stepName': '单元测试',
                        'stepDesc': '单元测试'
                    }
                ]
            ]
        ])
})

it('should do nothing with full construction step', () => {
    const alreadyCompleteDDA = [
        [
            '1',
            [
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 0,
                    'buildNum': 44,
                    'execTime': 9864,
                    'execTimeStr': '9秒864毫秒',
                    'stepCategory': 1,
                    'stepName': '代码拉取',
                    'stepDesc': 'Gitlab 代码同步'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 2,
                    'buildNum': 44,
                    'execTime': 512119,
                    'execTimeStr': '8分32秒119毫秒',
                    'stepCategory': 1,
                    'stepName': '静态扫描',
                    'stepDesc': 'SonarQube 代码静态扫描'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 3,
                    'buildNum': 44,
                    'execTime': 545741,
                    'execTimeStr': '9分5秒741毫秒',
                    'stepCategory': 1,
                    'stepName': '编译打包',
                    'stepDesc': '项目编译打包'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 4,
                    'buildNum': 44,
                    'execTime': 13777,
                    'execTimeStr': '13秒777毫秒',
                    'stepCategory': 1,
                    'stepName': '安全扫描',
                    'stepDesc': 'MobSF 安全检测'
                }
            ]
        ],
        [
            '2',
            [
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 1,
                    'buildNum': 44,
                    'execTime': 1838,
                    'execTimeStr': '1秒838毫秒',
                    'stepCategory': 2,
                    'stepName': '单元测试',
                    'stepDesc': '单元测试'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 5,
                    'buildNum': 44,
                    'execTime': 126939,
                    'execTimeStr': '2分6秒939毫秒',
                    'stepCategory': 2,
                    'stepName': 'UI测试',
                    'stepDesc': '自动化UI测试'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 6,
                    'buildNum': 44,
                    'execTime': 126254,
                    'execTimeStr': '2分6秒254毫秒',
                    'stepCategory': 2,
                    'stepName': '性能测试',
                    'stepDesc': '自动化性能测试'
                }
            ]
        ],
        [
            '3',
            [
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 7,
                    'buildNum': 44,
                    'execTime': 253587,
                    'execTimeStr': '4分13秒587毫秒',
                    'stepCategory': 3,
                    'stepName': '加固',
                    'stepDesc': '爱加密加固'
                },
                {
                    'historyStatus': 2,
                    'historyResult': 1,
                    'stepCode': 9,
                    'buildNum': 44,
                    'execTime': 2425,
                    'execTimeStr': '2秒425毫秒',
                    'stepCategory': 3,
                    'stepName': '包管理',
                    'stepDesc': 'DevOps平台安装包管理'
                }
            ]
        ]
    ]
    expect(composeCompleteStep(alreadyCompleteDDA)).toEqual(alreadyCompleteDDA)
})

it('should return right full construction step after remove', () => {
    const deleteItem = {
        buildNum: 0,
        buildType: 1,
        createTime: '2018-11-27 20:12:35.0',
        execTime: 0,
        execTimeStr: '-',
        remark: '',
        stepCategory: 2,
        stepCode: 1,
        stepDesc: '单元测试',
        stepID: '09cf2d2c1d22443192e98485f47103b21XW1v3',
        stepName: '单元测试',
        stepParams: '{"stageId":1}',
        stepResult: 0,
        stepStatus: 0,
        updateTime: '2018-11-27 20:12:35.0'
    }
    const oldCompleteDAA = [
        ['1',
            [
                {
                    buildNum: 0,
                    buildType: 1,
                    createTime: "2018-11-27 17:42:41.0",
                    execTime: 0,
                    execTimeStr: "-",
                    remark: "",
                    stepCategory: 1,
                    stepCode: 0,
                    stepDesc: "Gitlab 代码同步",
                    stepID: "5f6650d2e6b04cc89d780a7c0c9a5b7bR273uC",
                    stepName: "代码拉取",
                    stepParams: "{\"stageId\":0}",
                    stepResult: 0,
                    stepStatus: 0,
                    updateTime: "2018-11-27 17:42:41.0"}
            ]
        ],
        ['2',[
            {

                buildNum: 0,
                buildType: 1,
                createTime: "2018-11-27 20:12:35.0",
                execTime: 0,
                execTimeStr: "-",
                remark: "",
                stepCategory: 2,
                stepCode: 1,
                stepDesc: "单元测试",
                stepID: "09cf2d2c1d22443192e98485f47103b21XW1v3",
                stepName: "单元测试",
                stepParams: "{\"stageId\":1}",
                stepResult: 0,
                stepStatus: 0,
                updateTime: "2018-11-27 20:12:35.0"
            }
            ]
        ],
        ['3',
            [

            ]
        ]
    ]
    const finalResult = [
        ['1',
            [
                {
                    buildNum: 0,
                    buildType: 1,
                    createTime: "2018-11-27 17:42:41.0",
                    execTime: 0,
                    execTimeStr: "-",
                    remark: "",
                    stepCategory: 1,
                    stepCode: 0,
                    stepDesc: "Gitlab 代码同步",
                    stepID: "5f6650d2e6b04cc89d780a7c0c9a5b7bR273uC",
                    stepName: "代码拉取",
                    stepParams: "{\"stageId\":0}",
                    stepResult: 0,
                    stepStatus: 0,
                    updateTime: "2018-11-27 17:42:41.0"}
            ]
        ],
        ['2',[

        ]],
        ['3',[

        ]]
    ]
    expect(composeCompleteStepAfterRemove(oldCompleteDAA,deleteItem)).toEqual(finalResult)
})
