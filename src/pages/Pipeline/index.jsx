import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'

import { Steps, Breadcrumb, Card, Button, Icon, Collapse, Row, Col } from 'antd'
import { Radio } from 'antd/lib/radio'

const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
const Panel = Collapse.Panel

const steps = [{
    title: '开始',
}, {
    title: '构建阶段',
}, {
    title: '测试阶段',
}, {
    title: '部署阶段',
}, {
    title: '完成',
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

// const pipelineList = [
//     {
//         'taskID': 'e510246fb7a54947aceb78d016109bee817t0O',
//         'taskCode': 'td1539673436803',
//         'taskName': '测试',
//         'jenkinsJob': 'TuandaiAS2-develop-v4',
//         'taskStatus': 1,
//         'exexTime': 0,
//         'lastExecTime': 0,
//         'createTime': '2018-10-16 15:03:56.0',
//         'updateTime': '2018-10-16 15:03:56.0',
//         'buildStage': 4,
//         'step': [{
//             title: '开始',
//             content: 'First-content',
//         }, {
//             title: '构建阶段',
//             content: 'Second-content',
//         }, {
//             title: '测试阶段',
//             content: 'Last-content',
//         }, {
//             title: '部署阶段',
//             content: 'Second-content',
//         }, {
//             title: '完成',
//             content: 'Last-content',
//         }]
//     },
//     {
//         'taskID': 'e510246fb7a54947aceb78d016109bee817t0O',
//         'taskCode': 'td1539673436803',
//         'taskName': '测试',
//         'jenkinsJob': 'TuandaiAS2-develop-v4',
//         'taskStatus': 2,
//         'exexTime': 0,
//         'lastExecTime': 0,
//         'createTime': '2018-10-16 15:03:56.0',
//         'updateTime': '2018-10-16 15:03:56.0',
//         'buildStage': 3,
//         'step': [{
//             title: '开始',
//             content: 'First-content',
//         }, {
//             title: '构建阶段',
//             content: 'Second-content',
//         }, {
//             title: '测试阶段',
//             content: 'Last-content',
//         }, {
//             title: '部署阶段',
//             content: 'Second-content',
//         }, {
//             title: '完成',
//             content: 'Last-content',
//         }]
//     },
//     {
//         'taskID': 'e510246fb7a54947aceb78d016109bee817t0O',
//         'taskCode': 'td1539673436803',
//         'taskName': '测试',
//         'jenkinsJob': 'TuandaiAS2-develop-v4',
//         'taskStatus': 3,
//         'exexTime': 0,
//         'lastExecTime': 0,
//         'createTime': '2018-10-16 15:03:56.0',
//         'updateTime': '2018-10-16 15:03:56.0',
//         'buildStage': 1,
//         'step': [{
//             title: '开始',
//             content: 'First-content',
//         }, {
//             title: '构建阶段',
//             content: 'Second-content',
//         }, {
//             title: '测试阶段',
//             content: 'Last-content',
//         }, {
//             title: '部署阶段',
//             content: 'Second-content',
//         }, {
//             title: '完成',
//             content: 'Last-content',
//         }]
//     },
//     {
//         'taskID': 'e510246fb7a54947aceb78d016109bee817t0O',
//         'taskCode': 'td1539673436803',
//         'taskName': '测试',
//         'jenkinsJob': 'TuandaiAS2-develop-v4',
//         'taskStatus': 4,
//         'exexTime': 0,
//         'lastExecTime': 0,
//         'createTime': '2018-10-16 15:03:56.0',
//         'updateTime': '2018-10-16 15:03:56.0',
//         'buildStage': 2,
//         'step': [{
//             title: '开始',
//             content: 'First-content',
//         }, {
//             title: '构建阶段',
//             content: 'Second-content',
//         }, {
//             title: '测试阶段',
//             content: 'Last-content',
//         }, {
//             title: '部署阶段',
//             content: 'Second-content',
//         }, {
//             title: '完成',
//             content: 'Last-content',
//         }]
//     },
//     {
//         'taskID': 'e510246fb7a54947aceb78d016109bee817t0O',
//         'taskCode': 'td1539673436803',
//         'taskName': '测试',
//         'jenkinsJob': 'TuandaiAS2-develop-v4',
//         'taskStatus': 1,
//         'exexTime': 0,
//         'lastExecTime': 0,
//         'createTime': '2018-10-16 15:03:56.0',
//         'updateTime': '2018-10-16 15:03:56.0',
//         'buildStage': 0,
//         'step': [{
//             title: '开始',
//             content: 'First-content',
//         }, {
//             title: '构建阶段',
//             content: 'Second-content',
//         }, {
//             title: '测试阶段',
//             content: 'Last-content',
//         }, {
//             title: '部署阶段',
//             content: 'Second-content',
//         }, {
//             title: '完成',
//             content: 'Last-content',
//         }]
//     },
// ]

class Pipeline extends Component {
    constructor (props) {
        super(props)

        this.state = {
            pipelineList: [],
            current: 0
        }
    }

    getPipelineList = () => {
        reqGet('/pipeline/tasklist', {
            projectID: this.props.projectId,
            page: 1,
            limit: 20,
        }).then((res) => {
            console.log(res)
            if (res.code === 0) {
                this.setState({
                    pipelineList: res.tasks
                })
            }
        })
    }

    //
    toAddPipeline = () => {

    }

    componentWillMount () {
        window.localStorage.setItem('oldProjectId', this.props.projectId)
    }

    componentDidMount () {
        this.getPipelineList()
    }

    render () {
        const {pipelineList, current} = this.state

        return (
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>流水线</BreadcrumbItem>
                </Breadcrumb>

                <div className="pipeline-menu">
                    <Button type="primary" onClick={this.toAddPipeline}>新增流水线</Button>
                </div>
                <section className="pipeline-box">
                    <section className="pipeline-main">
                        {
                            pipelineList.map((item, index) => {
                                return <div className="pipeline-item" key={index}>

                                    <div className="pipeline-item-header">
                                        <Row type="flex" justify="space-between">
                                            <Col span={12}>
                                                <Link to={`/pipeline/detail/${item.taskID}`}><h2>{item.taskName} <span>（ID：{item.taskID}）</span></h2></Link>
                                            </Col>
                                            <Col span={12} >
                                                <div className="pipeline-item-user">
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="pipeline-item-content">
                                        <Row>
                                            <Col span={20}>
                                                <div className="pipeline-item-main">
                                                    <p className="pipeline-item-timemeta">
                                                        <span><i>最近执行时间：</i>{item.lastExecTime}</span>
                                                        <span><i>执行分支：</i>{item.jenkinsJob}</span>
                                                        <span><i>执行时长：</i>{item.exexTime}</span>
                                                    </p>
                                                    <Steps size="small" status={enumStatus[item.taskStatus]}
                                                           current={item.taskStatus}>
                                                        {steps.map((item,index) => <Step key={index} title={item.title}/>)}
                                                    </Steps>
                                                </div>
                                            </Col>
                                            <Col span={4}>
                                                <div className="pipeline-item-ctrl">
                                                    <div className="status">
                                                        <span>最近执行状态：</span>{enumStatusText[item.taskStatus]}</div>
                                                    <Button type="primary">{enumButtonText[item.taskStatus]}</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                </div>
                            })
                        }
                    </section>
                </section>
            </div>
        )
    }
}

Pipeline = connect((state) => {
    return {
        projectId: state.projectId
    }
})(Pipeline)

export default Pipeline