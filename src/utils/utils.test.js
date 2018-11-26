import {
    getQueryString,
    makeHistoryStepCard,
    constructStepCard,
    composeEditFinalStep,
    checkPermission
} from './utils'

describe('utils', () => {

    it('works', () => {
        /* eslint-disable no-restricted-globals */
        expect(location.href).toBe('http://localhost:2000/#/pipeline/edit/6465dab49a534b5ab3efcccb5c4ce9a8n0AgY4?buildNum=42')
    })

    it('getQueryString should can not get hash query', () => {
        expect(location.href).toBe('http://localhost:2000/#/pipeline/edit/6465dab49a534b5ab3efcccb5c4ce9a8n0AgY4?buildNum=42')
        const canNotgetBuildNum = getQueryString('token')
        expect(canNotgetBuildNum).toBe(null)
    })

    it('should should only just can get token', () => {
        window.history.pushState({}, 'Test Title', `http://localhost:2000/?token=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1Mzk4NDczNzAsInN1YiI6IlRELTQwNDMiLCJ0ZF9wYXlsb2FkIjoie1wiZW1wSWRcIjpcIjJjZTJkMmU5LTg0Y2MtNGRiMi05NmJjLWYxMzA1ZTM5YmM1YlwiLFwiaWRcIjpcInpKYVYwVzJVRENrUU1HOXNcIixcImVtcE5vXCI6XCJURC00MDQzXCIsXCJleHBpcmVUaW1lXCI6XCIyMDE4LTEwLTE4VDE2OjIyOjUwLjE3N1wifSIsImV4cCI6MTUzOTg1MDk3MH0.rZ-Irzgsak_klxD2Zb-4dM4TOyr_6NzQGCmeBNEJLKs&setToken=true#/`)
        expect(window.location.href).toEqual('http://localhost:2000/?token=eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1Mzk4NDczNzAsInN1YiI6IlRELTQwNDMiLCJ0ZF9wYXlsb2FkIjoie1wiZW1wSWRcIjpcIjJjZTJkMmU5LTg0Y2MtNGRiMi05NmJjLWYxMzA1ZTM5YmM1YlwiLFwiaWRcIjpcInpKYVYwVzJVRENrUU1HOXNcIixcImVtcE5vXCI6XCJURC00MDQzXCIsXCJleHBpcmVUaW1lXCI6XCIyMDE4LTEwLTE4VDE2OjIyOjUwLjE3N1wifSIsImV4cCI6MTUzOTg1MDk3MH0.rZ-Irzgsak_klxD2Zb-4dM4TOyr_6NzQGCmeBNEJLKs&setToken=true#/')
        const token = getQueryString('token')

        expect(token).toEqual(`eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1Mzk4NDczNzAsInN1YiI6IlRELTQwNDMiLCJ0ZF9wYXlsb2FkIjoie1wiZW1wSWRcIjpcIjJjZTJkMmU5LTg0Y2MtNGRiMi05NmJjLWYxMzA1ZTM5YmM1YlwiLFwiaWRcIjpcInpKYVYwVzJVRENrUU1HOXNcIixcImVtcE5vXCI6XCJURC00MDQzXCIsXCJleHBpcmVUaW1lXCI6XCIyMDE4LTEwLTE4VDE2OjIyOjUwLjE3N1wifSIsImV4cCI6MTUzOTg1MDk3MH0.rZ-Irzgsak_klxD2Zb-4dM4TOyr_6NzQGCmeBNEJLKs`)

    })

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

    it('develops user has no permission', () => {
        const permissionList = [
            '/home,/project/listProjectByUser,/user/getUserInfo,/permission/list,/permission/urlPermission,/permission/hasAddProjectPermission,/performance/js/*,/devops/loginOut,/download/downloadApk',
            '/dashboard', '/dashboard/basicInfor', '/dashboard/report', '/pipeline,/branch', '/pipeline/tasklist', '/pipeline/taskdetail,/pipeline/taskinfo,/pipeline/taskdetail2', '/pipeline/taskrecordselect', '/pipeline/taskhistorydetail', '/pipeline/report/taskreport', '/pipeline/stepdetail', '/pipeline/checktask', '/pipeline/autoimport', '/pipeline/branchs', '/pipeline/project', '/pipeline/taskstatus', null, '/performanceConfig', '/project/details/*', '/testScene/list/*', '/task/success/list', '/task/failure/list', '/task/timer/list', '/task/cancel', '/performance/report/*', '/performance/download/*', '/package', '/package/download', '/package/detail,/task/getBuildId', '/package/rebuild', '/package/list', '/package/envselect', '/package/packagelist', '/package/version/more', '/package/build/more', '/package/detail', '/package/failure/record', '/package/unfinish/list', '/package/failure/recommit', '/package/selectusers', '/package/addSubmit', '/package/regression', '/package/performance', '/package/queryPerformance', '/package/cancel', '/projectinfo', '/project/addProject,/config/listPlatform', '/branch', '/branch/list,/branch/pages', '/branch/refresh', '/branch/update', '/branch/selectBranch', '/configManager', '/env/envDetails', '/noticeManager,/messageNotice', '/messageNotice/listNotice', '/thirdparty,/thirdPartyConfig', '/thirdPartyConfig/listConfig', '/permission', '/permission/urlPermission', '/devops', '/devops/loginOut']

        expect(checkPermission('/pipeline/add', permissionList)).toBeFalsy()

    })

    it('develops user has permission', () => {
        const permissionList = [
            '/home,/project/listProjectByUser,/user/getUserInfo,/permission/list,/permission/urlPermission,/permission/hasAddProjectPermission,/performance/js/*,/devops/loginOut,/download/downloadApk',
            '/dashboard', '/dashboard/basicInfor', '/dashboard/report', '/pipeline,/branch', '/pipeline/tasklist', '/pipeline/taskdetail,/pipeline/taskinfo,/pipeline/taskdetail2', '/pipeline/taskrecordselect', '/pipeline/taskhistorydetail', '/pipeline/report/taskreport', '/pipeline/stepdetail', '/pipeline/checktask', '/pipeline/autoimport', '/pipeline/branchs', '/pipeline/project', '/pipeline/taskstatus', null, '/performanceConfig', '/project/details/*', '/testScene/list/*', '/task/success/list', '/task/failure/list', '/task/timer/list', '/task/cancel', '/performance/report/*', '/performance/download/*', '/package', '/package/download', '/package/detail,/task/getBuildId', '/package/rebuild', '/package/list', '/package/envselect', '/package/packagelist', '/package/version/more', '/package/build/more', '/package/detail', '/package/failure/record', '/package/unfinish/list', '/package/failure/recommit', '/package/selectusers', '/package/addSubmit', '/package/regression', '/package/performance', '/package/queryPerformance', '/package/cancel', '/projectinfo', '/project/addProject,/config/listPlatform', '/branch', '/branch/list,/branch/pages', '/branch/refresh', '/branch/update', '/branch/selectBranch', '/configManager', '/env/envDetails', '/noticeManager,/messageNotice', '/messageNotice/listNotice', '/thirdparty,/thirdPartyConfig', '/thirdPartyConfig/listConfig', '/permission', '/permission/urlPermission', '/devops', '/devops/loginOut']

        expect(checkPermission('/home', permissionList)).toBeTruthy()

    })

    it('not permission list no permission', () => {
        const permissionList = ''
        expect(checkPermission('/home', permissionList)).toBeFalsy()

    })
    it('permission fail url with **', () => {
        const permissionList = ['/pipeline/edit/**',"/pipeline/addtask,/pipeline/add",]
        expect(checkPermission('/pipeline/edit', permissionList)).toBeTruthy()

    })
    it('permission fail url with *', () => {
        const permissionList = ['/pipeline/edit/*',"/pipeline/addtask,/pipeline/add",]
        expect(checkPermission('/pipeline/edit', permissionList)).toBeTruthy()

    })

    it('pipeline/edit', () => {
        const permissionList = ["/pipeline/addtask,/pipeline/add","/pipeline/updatetask,/pipeline/edit"]
        expect(checkPermission('/pipeline/edit', permissionList)).toBeTruthy()

    })

})
