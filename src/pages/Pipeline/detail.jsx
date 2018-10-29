import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'
import filter from 'lodash.filter'
import toPairs from 'lodash.topairs'
import uniq from 'lodash.uniq'

import { Steps, Breadcrumb, Card, Button, Icon, Collapse, Row, Col, Select } from 'antd'
import { Radio } from 'antd/lib/radio'

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
    1: 'wait',
    2: 'process',
    3: 'finish',
    4: 'error'
}
const enumStatusText = {
    1: '未开始',
    2: '执行中',
    3: '成功',
    4: '失败'
}

const enumButtonType = {
    1: 'wait',
    2: 'process',
    3: 'finish',
    4: 'error'
}

const enumButtonText = {
    1: '开始执行',
    2: '执行中',
    3: '开始执行',
    4: '开始执行'
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

const StepList = [
    {
        'stepID': '0923691354af43ed8afd27d832069f37L27SA3',
        'stepCategory': 1,
        'stepCode': 2,
        'stepName': '静态扫描',
        'stepDesc': '静态扫描',
        'webHook': 'www.baidu.com',
        'stepParams': '[{"json_jsonParams":21232,"type":1},{"build_compileType":"wasd","type":2}]',
        'paramSource': 2,
        'execTime': 0,
        'createTime': '2018-10-16 15:03:57.0',
        'updateTime': '2018-10-16 15:03:57.0',
        'remark': ''
    },
    {
        'stepID': '0923691354af43ed8afd27d832069f37L27SA3',
        'stepCategory': 1,
        'stepCode': 2,
        'stepName': '静态扫描',
        'stepDesc': '静态扫描',
        'webHook': 'www.baidu.com',
        'stepParams': '[{"json_jsonParams":21232,"type":1},{"build_compileType":"wasd","type":2}]',
        'paramSource': 2,
        'execTime': 0,
        'createTime': '2018-10-16 15:03:57.0',
        'updateTime': '2018-10-16 15:03:57.0',
        'remark': ''
    },
    {
        'stepID': '0923691354af43ed8afd27d832069f37L27SA3',
        'stepCategory': 2,
        'stepCode': 2,
        'stepName': '静态扫描',
        'stepDesc': '静态扫描',
        'webHook': 'www.baidu.com',
        'stepParams': '[{"json_jsonParams":21232,"type":1},{"build_compileType":"wasd","type":2}]',
        'paramSource': 2,
        'execTime': 0,
        'createTime': '2018-10-16 15:03:57.0',
        'updateTime': '2018-10-16 15:03:57.0',
        'remark': ''
    },
    {
        'stepID': '0923691354af43ed8afd27d832069f37L27SA3',
        'stepCategory': 3,
        'stepCode': 2,
        'stepName': '静态扫描',
        'stepDesc': '静态扫描',
        'webHook': 'www.baidu.com',
        'stepParams': '[{"json_jsonParams":21232,"type":1},{"build_compileType":"wasd","type":2}]',
        'paramSource': 2,
        'execTime': 0,
        'createTime': '2018-10-16 15:03:57.0',
        'updateTime': '2018-10-16 15:03:57.0',
        'remark': ''
    }
]

const pipelineHistoryList = [
    '2018-09-14 11:02:50(等待)',
    '2018-09-14 11:02:30(等待)',
    '2018-09-14 11:00:30',
    '2018-09-14 09:53:38',
    '2018-09-13 15:45:15',
]

let HistoryOption = []

for (let i = 0; i < pipelineHistoryList.length; i++) {
    HistoryOption.push(<Option key={pipelineHistoryList[i]}>{pipelineHistoryList[i]}</Option>)
}

class pipelineDetail extends Component {
    constructor (props) {
        super(props)

        this.state = {
            breadcrumbPath: [],
            envList: [],
            current: 0,
            currentJob: 0,
            finalStep: []
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

    getPipelineDetail = () => {
        reqGet('/pipeline/taskdetail', {
            taskID: this.props.taskID
        }).then((res) => {
            if (res.code === 0) {
                const taskList = res.data && res.data.task
                const stepList = res.data && res.data.steps
                this.checkTaskList(taskList)
                this.checkStepList(stepList)
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
        console.log(category)
        let tempStepObject = {}
        let finalStep = []
        category.forEach((value,index) =>{
            tempStepObject[value] = []
        })
        for (let i = 0; i < stepList.length; i++) {
            const stepListElement = stepList[i]
            console.log(stepListElement.stepCategory)
            for (const tempStepObjectKey in tempStepObject) {
                if(stepListElement.stepCategory+'' === tempStepObjectKey+''){
                    tempStepObject[tempStepObjectKey].push(stepListElement)
                } 
            }

        }
        finalStep =  toPairs(tempStepObject)
        console.log(tempStepObject)
        console.log(stepList)
        console.log(finalStep)
        this.setState({stepList: stepList})
        this.setState({finalStep: finalStep})
    }

    componentWillMount () {
    }

    componentDidMount () {

        this.checkTaskList(taskList)
        this.checkStepList(StepList)
    }

    render () {
        const {
            breadcrumbPath,
            projectID,
            taskCode,
            taskName,
            jenkinsJob,
            taskStatus,
            exexTime,
            lastExecTime,
            createTime,
            updateTime,
            stepList,
            finalStep,
            currentJob
        } = this.state

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
                                        <Button type="primary">编辑</Button>
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
                                                <span title><i>最近执行时间：</i>{lastExecTime}</span>
                                                <span title><i>执行分支：</i>{jenkinsJob}</span>
                                                <span title><i>执行时长：</i>{exexTime}</span>
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
                                        return <Step title={enumStepsText[item[0]].title}  key={index} description={
                                            item[1].map((item,index)=>{
                                                console.log(item)
                                                return <Card
                                                    style={{width: 180, 'margin-left': '-40%'}}
                                                    title={item.stepName}
                                                    extra={<a href="#">编辑</a>}
                                                    key={index}
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
            </div>
        )
    }
}

pipelineDetail = connect((state) => {
    return {
        taskID: state.taskID
    }
})(pipelineDetail)

export default pipelineDetail