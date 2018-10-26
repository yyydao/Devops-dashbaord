import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'
import filter from 'lodash.filter'
import uniq from 'lodash.uniq'

import { Steps, Breadcrumb, Card, Button, Icon, Collapse, Row, Col } from 'antd'
import { Radio } from 'antd/lib/radio'


const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
const Panel = Collapse.Panel

const steps = [{
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


class pipelineDetail extends Component {
    constructor (props) {
        super(props)

        this.state = {
            envList: [],
            current: 0
        }
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
        const category = uniq(stepList.map(item =>item.stepCategory))
        console.log(category)
       this.setState({stepList:stepList})
    }

    componentWillMount () {

    }

    componentDidMount () {
        this.getPipelineDetail()
        this.checkTaskList(taskList)
        this.checkStepList(StepList)
    }

    render () {
        const {
            projectID,
            taskCode,
            taskName,
            jenkinsJob,
            taskStatus,
            exexTime,
            lastExecTime,
            createTime,
            updateTime,
            stepList
        } = this.state

        return (
            <div>
                <div className="pipeline-menu">
                    <Button type="primary" onClick={this.toAddPipeline}>新增流水线</Button>
                </div>
                <section className="pipeline-box">
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
                                            <Steps size="small" status={enumStatus[taskStatus]}
                                                   current={taskStatus}>
                                                {/*{stepList.map(item => <Step key={item.title} title={item.title}/>)}*/}
                                                <Step description={<div>开始</div>}></Step>
                                                <Step description={<div>构建阶段
                                                    <ul>
                                                        <li>source code</li>
                                                        <li>scan</li>
                                                        <li>compile</li>
                                                    </ul>
                                                </div>}></Step>
                                                <Step description={<div>测试阶段</div>}></Step>
                                                <Step description={<div>部署阶段</div>}></Step>
                                                <Step description={<div>完成</div>}></Step>
                                            </Steps>
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <div className="pipeline-item-ctrl">
                                            <div className="status">
                                                <span>最近执行状态：</span>{enumStatusText[taskStatus]}</div>
                                            <Button type="primary">{enumButtonText[taskStatus]}</Button>
                                        </div>
                                    </Col>
                                </Row>
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