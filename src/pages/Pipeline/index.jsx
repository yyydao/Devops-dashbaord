import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import { reqGet,reqPostURLEncode } from '@/api/api'
import {formatTime ,checkPermission  } from '@/utils/utils'
import { Steps, Breadcrumb, Button, Row, Col, message } from 'antd'
import AuthButton from '@/components/AuthButton'

const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step

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

const enumButtonText = {
    0: '开始执行',
    1: '执行中',
    2: '开始执行',
    3: '等待中'
}

const enumStatusText = {
    0: '未开始',
    1: '执行中',
    2: '结束',
    3: '等待中'
}


const enumPipelineResult={
    0:`未开始`,
    1:`成功`,
    2:`失败`,
    3:`取消`,
    4:`不稳定`,

}


class Pipeline extends Component {
    constructor (props) {
        super(props)

        this.state = {
            pipelineList: [],
            current: 0,
        }
    }

    pipelineRunStatusText = (taskStatus,taskResult) =>{
        return (taskStatus === 2 || taskStatus=== '2') ? enumPipelineResult[taskResult]:enumStatusText[taskStatus]
    }
    pipelineStepStatus = (taskStatus,taskResult) =>{
        return (taskStatus === 2 || taskStatus=== '2') ? enumPipelineResult[taskResult]:enumStatusText[taskStatus]
    }



    getPipelineList = () => {
        reqGet('/pipeline/tasklist', {
            projectID: this.props.projectId,
            page: 1,
            limit: 20,
        }).then((res) => {
            console.log(res)
            if (res.code === 0) {
                if(res.data.list){
                    let list = res.data.list
                    for (let i = 0; i < list.length; i++) {
                        const listElement = list[i]
                        list[i].distanceTime = formatTime(listElement.lastExecTime,'minute')
                    }
                    this.setState({
                        pipelineList: list
                        // pipelineList: res.tasks
                    })
                }

            }else{
                message.error(res.msg)
            }
        })
    }

    jumpToDetail = (item)=>{
        this.props.history.push({
            pathname:`/pipeline/detail/${item.taskID}`,
            search: `?buildNumber=${item.buildNum}&curRecordNo=${item.curRecordNo}&platform=${item.platform}`,
            state:{
                taskStatus:item.taskStatus
            }
        })
    }

    jumpToAddPipeline = ()=>{
        const hasAddAuth = checkPermission('/pipeline/add',this.props.permissionList)
        if(!hasAddAuth){
            message.error('该用户无此操作权限')
            return
        }
        this.props.history.push({
            pathname:`/pipeline/add`
        })
    }

    runTask = (item) => {
        this.setState({taskStatus: 1})
        reqPostURLEncode('/pipeline/taskbuild', {
            taskID: item.taskID

        }).then((res) => {
            console.log(res)
            if (res.code === 0) {
                message.success('开始执行')
                let pipelineList = this.state.pipelineList
                for (let i = 0; i < pipelineList.length; i++) {
                    const pipelineItem = pipelineList[i]
                    if(pipelineItem.taskID === item.taskID){
                        pipelineList[i].taskStatus = res.status
                        pipelineList[i].curRecordNo = res.recordNo
                        pipelineList[i].taskStatus = res.status
                    }
                }
                this.setState({pipelineList:pipelineList})
                // this. getPipelineList()
            }else{
                message.error(res.msg)
            }
        })
    }

    componentWillMount () {
        window.localStorage.removeItem('currentEditedPipeline')
        window.localStorage.removeItem('steps')
        window.localStorage.setItem('oldProjectId', this.props.projectId)
    }

    componentDidMount () {
        this.getPipelineList()
        // const hasAddAuth = checkPermission('/pipeline/add',this.props.permissionList)
        // const authButtonText =`新增流水线`
        // const addPathTo ={pathName:`/pipeline/add`}
        // this.setState({hasAddAuth:hasAddAuth,authButtonText:authButtonText,addPathTo:addPathTo})
    }

    render () {

        const {pipelineList,hasAddAuth,authButtonText,addPathTo} = this.state

        return (
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>流水线</BreadcrumbItem>
                </Breadcrumb>

                <div className="pipeline-menu">
                    <Button type="primary" onClick={this.jumpToAddPipeline}>新增流水线</Button>
                    {/*<AuthButton hasAuth={hasAddAuth} buttonText={authButtonText} to={addPathTo}/>*/}
                </div>
                <section className="pipeline-box">
                    <section className="pipeline-main">
                        {
                            pipelineList.map((item, index) => {
                                return <div className="pipeline-item" key={index}>

                                    <div className="pipeline-item-header" onClick={()=>this.jumpToDetail(item)}>
                                        <Row type="flex" justify="space-between">
                                            <Col span={12}>
                                              <h2>{item.taskName}
                                                    <span>（ID：{item.taskCode}）</span></h2>
                                            </Col>
                                            <Col span={12}>
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
                                                        <span><i>最近执行时间：</i>{item.distanceTime}</span>
                                                        <span><i>执行分支：</i>{item.branchName}</span>
                                                        <span><i>最近执行时长：</i>{item.execTimeStr}</span>
                                                    </p>
                                                    <Steps size="small" status={this.pipelineStepStatus(item.taskStatus,item.taskResult)}
                                                           current={item.taskStatus === 2? 5:1}>
                                                        {steps.map((item, index) => <Step key={index}
                                                                                          title={item.title}/>)}
                                                    </Steps>
                                                </div>
                                            </Col>
                                            <Col span={4}>
                                                <div className="pipeline-item-ctrl">
                                                    <div className="status">
                                                        <span>最近执行状态：</span>{this.pipelineRunStatusText(item.taskStatus,item.taskResult)}</div>
                                                    <Button type="primary" disabled={item.taskStatus === 1 ||item.taskStatus === 3} onClick={()=>this.runTask(item)}>{enumButtonText[item.taskStatus]}</Button>
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
        projectId: state.projectId,
        permissionList: state.permissionList
    }
})(Pipeline)

export default Pipeline
