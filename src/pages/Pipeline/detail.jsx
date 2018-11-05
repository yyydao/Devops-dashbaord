import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'
import toPairs from 'lodash.topairs'
import uniq from 'lodash.uniq'
import { setStep,removeSteps,setSteps } from '@/store/action'

import { Chart, Geom, Axis, Tooltip, Legend, Coord, track } from 'bizcharts';

import { Steps, Breadcrumb, Card, Button, Icon, Collapse, Row, Col, Select, Menu, Dropdown, Radio } from 'antd'

const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
const Panel = Collapse.Panel
const Option = Select.Option

const enumStepsText = [{
    title: '开始',
    content: 'First-content',
}, {
    title: '构建阶段',
    content: 'Second-content',
}, {
    title: '测试阶段',
    content: 'Last-content',
}, {
    title: '部署阶段',
    content: 'Second-content',
}, {
    title: '完成',
    content: 'Last-content',
}]

const enumStatus = {
    0: 'wait',
    1: 'process',
    2: 'finish',
    3: 'error'
}
const enumStatusText = {
    0: '未开始',
    1: '执行中',
    2: '成功',
    3: '失败'
}

const enumButtonType = {
    0: 'wait',
    1: 'process',
    2: 'finish',
    3: 'error'
}

const enumButtonText = {
    0: '开始执行',
    1: '执行中',
    2: '开始执行',
    3: '开始执行'
}

const taskList = {
    'projectID': 63,
    'taskCode': 'td1539673436803',
    'taskName': '测试',
    'jenkinsJob': 'TuandaiAS2-develop-v4',
    'taskStatus': 1,
    'exexTime': 0,
    'lastExecTime': 0,
    'createTime': '2018-10-16 15:03:56.0',
    'updateTime': '2018-10-16 15:03:56.0'
}

const pipelineHistoryList = [
    '2018-09-14 11:02:50(等待)',
    '2018-09-14 11:02:30(等待)',
    '2018-09-14 11:00:30',
    '2018-09-14 09:53:38',
    '2018-09-13 15:45:15',
]

const packageresult = [
    {
        'packageID': 1,
        'packageName': 'com.junte',
        'targetSdk': '23',
        'minSdk': '',
        'versionCode': '141',
        'versionName': '5.3.6',
        'appFileSize': '28.86MB',
        'filePath': './package/e510246fb7a54947aceb78d016109bee817t0O/1/1/20181016171839/app-performance-develop.apk'
    }
]

let HistoryOption = []

for (let i = 0; i < pipelineHistoryList.length; i++) {
    HistoryOption.push(<Option key={pipelineHistoryList[i]}>{pipelineHistoryList[i]}</Option>)
}

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">编辑任务</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">删除任务</a>
        </Menu.Item>
    </Menu>
);

track(false);

class pipelineDetail extends Component {
    constructor (props) {
        super(props)

        this.state = {
            breadcrumbPath: [],
            envList: [],
            current: 0,
            currentJob: 0,
            finalStep: [],
            stepList:[],
            fullSteps:[],
            packageresult: packageresult
        }
    }

    handleChange = (value) => {
        console.log(`selected ${value}`)
    }

    handleBlur = () => {
        console.log('blur')
    }

    handleFocus = () => {
        console.log('focus')
    }


    handleDeleteTask = (item) =>{
        let { setSteps } = this.props;
        let stepList = this.state.stepsList
        for (let i = 0; i < stepList.length; i++) {
            const stepElement = stepList[i]
            if(stepElement[0] === item.stepCategory){
                for (let j = 0; j < stepElement[1].length; j++) {
                    const stepElementElement = stepElement[1][j]
                    console.log(stepElementElement)
                    if(stepElementElement.stepCode === item.stepCode){
                        stepElement[1].splice(j,1)
                    }
                }
            }
        }
        this.setState({stepsList: stepList})
        setSteps(this.state.stepsList)
    }

    handleEditTask = (item) =>{
        console.log(item)
        this.props.history.push({
            pathname:'/pipeline/task/edit',
            state: {
                stepCode: item.stepCode,
                stepCategory: item.stepCategory,
                taskID: this.props.match.params.taskID,
                stepName: item.stepName,
                stepDesc: item.stepDesc,
                webHook: item.webHook,
                stepID: item.stepID,
                editable:true
            }
        })

    }

    getPipelineDetail = () => {
        reqGet('/pipeline/taskdetail', {
            taskID: this.props.match.params.taskID
        }).then((res) => {
            if (res.code === 0) {
                const taskList = res.task
                const stepList = res.steps
                this.checkTaskList(taskList)
                this.checkStepList(stepList)
            }
        })
    }
    getPackageresult = () => {
        reqGet('/pipeline/packageresult', {
            taskID: this.props.match.params.taskID
        }).then((res) => {
            if (res.code === 0) {
                this.setState({packageresult: res.list})
            }
        })
    }

    checkTaskList = (taskList) => {
        const {
            projectID,
            taskCode,
            taskName,
            jenkinsJob,
            taskStatus,
            exexTime,
            lastExecTime,
            createTime,
            updateTime

        } = taskList
        this.setState({
            projectID,
            taskCode,
            taskName,
            jenkinsJob,
            taskStatus,
            exexTime,
            lastExecTime,
            createTime,
            updateTime
        })
    }

    checkStepList = (stepList) => {
        const category = uniq(stepList.map(item => item.stepCategory))
        // console.log(category)
        let tempStepObject = {}
        let finalStep = []
        category.forEach((value, index) => {
            tempStepObject[value] = []
        })
        for (let i = 0; i < stepList.length; i++) {
            const stepListElement = stepList[i]
            // console.log(stepListElement.stepCategory)
            for (const tempStepObjectKey in tempStepObject) {
                if (stepListElement.stepCategory + '' === tempStepObjectKey + '') {
                    tempStepObject[tempStepObjectKey].push(stepListElement)
                }
            }

        }
        finalStep = toPairs(tempStepObject)
        // console.log(tempStepObject)
        // console.log(stepList)
        // console.log(finalStep)
        this.setState({stepList: stepList})
        this.setState({finalStep: finalStep})
        this.setState({fullSteps: this.composeEditFinalStep(finalStep)})
    }

    composeEditFinalStep= (oldFinalStep) => {
        if(oldFinalStep.length === 0){
            oldFinalStep = [["1", []],
                ["2", []],
                ["3", []]]
        } else if(oldFinalStep.length === 1){
            if(oldFinalStep[0][0] === "1"){
                oldFinalStep.splice(1,0,["2",[]],["3",[]])
            }else if(oldFinalStep[0][0] === "2"){
                oldFinalStep.splice(0,0,["1",[]])
                oldFinalStep.splice(2,0,["3",[]])
            }else if(oldFinalStep[0][0] === "3"){
                oldFinalStep.splice(1,0,["2",[]])
                oldFinalStep.splice(2,0,["3",[]])
            }
        }else if(oldFinalStep.length=== 2){
            let tempSum = 0
            for (let i = 0; i < oldFinalStep.length; i++) {
                const oldFinalStepElement = oldFinalStep[i]
                tempSum +=oldFinalStepElement[0]*1
            }
            switch (tempSum) {
                case 3:
                    oldFinalStep.splice(2,0,["3",[]])
                    break;
                case 4:
                    oldFinalStep.splice(1,0,["2",[]])
                    break;
                case 5:
                    oldFinalStep.splice(0,0,["1",[]])
                    break;
            }
        }
        return oldFinalStep
    }

    componentWillMount () {
    }

    componentDidMount () {
        // this.setState({packageresult: packageresult})
        // this.checkTaskList(taskList)
        // this.checkStepList(StepList)
        this.getPipelineDetail()
        this.getPackageresult()
    }

    render () {
        const {
            taskCode,
            taskName,
            jenkinsJob,
            taskStatus,
            exexTime,
            lastExecTime,
            finalStep,
            stepList,
            packageresult,
            currentJob
        } = this.state
        // 数据源
        const data = [
            { genre: 'Sports', sold: 275, income: 2300 },
            { genre: 'Strategy', sold: 115, income: 667 },
            { genre: 'Action', sold: 120, income: 982 },
            { genre: 'Shooter', sold: 350, income: 5271 },
            { genre: 'Other', sold: 150, income: 3710 }
        ];

// 定义度量
        const cols = {
            sold: { alias: '销售量' },
            genre: { alias: '游戏种类' }
        };

        return (
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/pipeline">流水线</Link></BreadcrumbItem>
                    <BreadcrumbItem>详情</BreadcrumbItem>
                </Breadcrumb>
                <section className="pipeline-box">
                    <div className="pipeline-header">
                        <Row gutter={16} type="flex" justify="space-between" align="middle">
                            <Col>
                                <Row gutter={16} type="flex" justify="space-between" align="middle">
                                    <Col>
                                        <h2>流水线详情</h2>
                                    </Col>
                                    <Col><Button ghost type="danger" shape="circle" icon="delete"/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row gutter={16} type="flex" justify="space-between" align="middle">
                                    <Col>
                                        <span>Tips: 有{currentJob}个任务正在等待</span>
                                    </Col>
                                    <Col>
                                        <Link to={{
                                            pathname: `/pipeline/edit/${this.props.match.params.taskID}`,
                                            state: {
                                                fullSteps: this.state.fullSteps,
                                                stepList : this.state.stepList
                                            },
                                        }}><Button type="primary">编辑</Button></Link>
                                    </Col>
                                    <Col>
                                        <Select
                                            defaultValue={pipelineHistoryList[0]}
                                            style={{width: 200}}
                                            placeholder=""
                                            onChange={this.handleChange}
                                            onFocus={this.handleFocus}
                                            onBlur={this.handleBlur}
                                        >
                                            {HistoryOption}
                                        </Select>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </div>
                    <section className="pipeline-main">
                        <div className="pipeline-item">

                            <div className="pipeline-item-header">
                                <Row type="flex" justify="space-between">
                                    <Col span={12}>
                                        <h2>{taskName} <span>（ID：{taskCode}）</span></h2>
                                    </Col>
                                    <Col span={12}>
                                        <div className="pipeline-item-user">
                                            gitlab push by liaoshengjian
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="pipeline-item-content">
                                <Row>
                                    <Col span={20}>
                                        <div className="pipeline-item-main">
                                            <p className="pipeline-item-timemeta">
                                                <span><i>最近执行时间：</i>{lastExecTime}</span>
                                                <span><i>执行分支：</i>{jenkinsJob}</span>
                                                <span><i>执行时长：</i>{exexTime}</span>
                                            </p>

                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <div className="pipeline-item-ctrl">

                                            {/*<div className="status">*/}
                                            <Row gutter={16} type="flex" justify="space-between" align="middle">
                                                <Col>
                                                    <span>最近执行状态：</span>{enumStatusText[taskStatus]}
                                                </Col>
                                                <Col>
                                                    <Button type="primary">{enumButtonText[taskStatus]}</Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                                <Steps size="small"
                                       status={enumStatus[taskStatus]}
                                       labelPlacement="vertical"
                                       current={taskStatus}>
                                    <Step title="开始"></Step>

                                    {finalStep.map((item, index) => {
                                        return <Step title={enumStepsText[item[0]].title} key={index} description={
                                            item[1].map((item, index) => {
                                                // console.log(item)
                                                return <Card
                                                        style={{width: 180, marginLeft: '-40%'}}
                                                        title={item.stepName}
                                                        extra={<Dropdown overlay={ <Menu>
                                                            <Menu.Item>
                                                                <a target="_blank" rel="noopener noreferrer"  onClick={()=>{
                                                                    this.handleEditTask(item)}
                                                                }>编辑任务</a>
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                <a target="_blank" rel="noopener noreferrer" onClick={()=>{
                                                                    this.handleDeleteTask(item)}
                                                                }>删除任务</a>
                                                            </Menu.Item>
                                                        </Menu>} placement="bottomCenter">
                                                            <Icon type="setting" theme="outlined" />
                                                        </Dropdown>}
                                                        key={item.stepID}
                                                    >
                                                        <p>{item.stepDesc}</p>
                                                    </Card>


                                            })

                                        }>

                                        </Step>
                                    })}
                                    <Step title="完成" description={<div></div>}></Step>
                                </Steps>
                            </div>

                        </div>
                    </section>
                </section>
                <section className="pipeline-box">
                    <Card title="基本信息">
                    {
                        packageresult.map((item, index) => {
                        return <div  key={index} >
                            <Row gutter={16} type="flex" justify="space-around" align="middle">
                                <Col><h2>packageID</h2></Col><Col>{item.packageID}</Col>
                            </Row>
                            <Row gutter={16} type="flex" justify="space-around" align="middle">
                                <Col><h2>packageName</h2></Col><Col>{item.packageName}</Col>
                            </Row>
                            <Row gutter={16} type="flex" justify="space-around" align="middle">
                                <Col><h2>targetSdk</h2></Col><Col>{item.targetSdk}</Col>
                            </Row>
                            <Row gutter={16} type="flex" justify="space-around" align="middle">
                                <Col><h2>minSdk</h2></Col><Col>{item.minSdk}</Col>
                            </Row>
                            <Row gutter={16} type="flex" justify="space-around" align="middle">
                                <Col><h2>versionCode</h2></Col><Col>{item.versionCode}</Col>
                            </Row>
                            <Row gutter={16} type="flex" justify="space-around" align="middle">
                                <Col><h2>versionName</h2></Col><Col>{item.versionName}</Col>
                            </Row>
                            <Row gutter={16} type="flex" justify="space-around" align="middle">
                                <Col><h2>appFileSize</h2></Col><Col>{item.appFileSize}</Col>
                            </Row>
                            <Row gutter={16} type="flex" justify="space-around" align="middle">
                                <Col><h2>filePath</h2></Col><Col>{item.filePath}</Col>
                            </Row>
                        </div>
                    })}
                    </Card>
                </section>
                <section className="pipeline-box" id="scan-result">
                    <Card title="基本信息">
                        <Chart width={600} height={400} data={data} scale={cols}>
                            <Axis name="genre" />
                            <Axis name="sold" />
                            <Legend position="top" dy={-20} />
                            <Tooltip />
                            <Geom type="interval" position="genre*sold" color="genre" />
                        </Chart>
                    </Card>
                </section>
            </div>
        )
    }
}

pipelineDetail = connect((state) => {
    return {
        taskID: state.taskID
    }
},{setStep,removeSteps,setSteps})(pipelineDetail)

export default pipelineDetail
