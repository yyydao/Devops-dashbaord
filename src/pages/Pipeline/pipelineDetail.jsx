import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import qs from 'qs'
import './index.scss'
import {formatTime, constructStepCard,checkPermission} from '@/utils/utils'
import {reqGet,reqDelete,reqPostURLEncode } from '@/api/api'
import { setStep,removeSteps,setSteps } from '@/store/action'

import ExecutionReport from '@/components/ExecutionReport'
import {track } from 'bizcharts';

import {
    Steps,
    Breadcrumb,
    Card,
    Button,
    Icon,
    Row,
    Col,
    Select,
    message,
    Modal
} from 'antd'

const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
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
    2: '结束',
    3: '等待中'
}


const enumPipelineResult={
    0:`default`,
    1:`成功`,
    2:`失败`,
    3:`取消`,
    4:`不稳定`,

}

const enumPipelineResultColor={
    0:`#fff`,
    1:`#52c41a`,
    2:`#f5222d`,
    3:`#faad14`,
    4:`#1890ff`,

}

const enumButtonText = {
    0: '开始执行',
    1: '执行中',
    2: '开始执行',
    3: '等待中'
}

track(false);

class pipelineDetail extends Component {
    constructor (props) {
        super(props)

        this.state = {
            waitCount:0,
            delModalVisible:false,
            breadcrumbPath: [],
            historyBranch:[],
            envList: [],
            current: 0,
            finalStep: [],
            stepsList:[],
            fullSteps:[],
            historyStep:[],
            buildNumber: '',
            exexTime:'',
            timer: null,
            timerStart: null,
            showHistory:false,
            distanceTime: ''
        }
    }


    pipelineRunStatusText = (taskStatus,taskResult) =>{
        return (taskStatus === 2 || taskStatus=== '2') ? enumPipelineResult[taskResult]:enumStatusText[taskStatus]
    }

    pipelineStepCurrent = () =>{
       if(this.state.showHistory){
           return 5
       }else{
           const currentSteps = this.state.stepsList
           const taskStatus = this.state.taskStatus

           switch (taskStatus) {
               case 1:
                   for (let i = 0; i < currentSteps.length; i++) {
                       const currentStep = currentSteps[i]
                       // console.log(currentStep.stepStatus)
                       if(currentStep.stepStatus === 1){
                           return currentStep.stepCategory
                       }
                   }
                   break;
               case 2:
                   if(this.state.taskResult === 2){
                       for (let i = 0; i < currentSteps.length; i++) {
                           const currentStep = currentSteps[i]
                           // console.log(currentStep.stepStatus)
                           if(currentStep.stepStatus === 2 && currentStep.stepResult === 2){
                               return currentStep.stepCategory -1
                           }
                       }
                   }
                   if(this.state.taskResult === 3){
                       for (let i = 0; i < currentSteps.length; i++) {
                           const currentStep = currentSteps[i]
                           // console.log(currentStep.stepStatus)
                           if(currentStep.stepStatus === 2 && currentStep.stepResult === 3){
                               return currentStep.stepCategory
                           }
                       }
                   }
                   break;
               case 3:
                   return 1
           }
       }
    }

    pipelineStepStatus = (taskStatus,taskResult) =>{
        return (taskStatus === 2 || taskStatus=== '2') ? enumPipelineResult[taskResult]:enumStatusText[taskStatus]
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

    showModal = () => {
        this.setState({
            delModalVisible: true,
        })
    }

    hideModal = () => {
        this.setState({
            delModalVisible: false
        })
    }

    gotoEditPipeline = () =>{
        const hasEditAuth = checkPermission('/pipeline/edit/',this.props.permissionList)
        if(!hasEditAuth){
            message.error(message.error('该用户无此操作权限'))
            return
        }
        localStorage.setItem('currentEditedPipeline',JSON.stringify({
            fullSteps: this.state.fullSteps,
            stepsList : this.state.stepsList
        }))
        this.props.history.push({
            pathname: `/pipeline/edit/${this.props.match.params.taskID}`,
            search:  this.props.location.search,
            state: {
                fullSteps: this.state.fullSteps,
                stepsList : this.state.stepsList,
                branchName:this.state.branchName
            },
        })
    }
    getBasicInfo = () =>{
        const parsedHash = qs.parse(this.props.location.search.slice(1));
        const {timer } = this.state;
        if (timer) {
            clearTimeout(timer);
            this.setState({
                timer: null
            });
        }
        reqGet('/pipeline/taskinfo', {
            taskID: this.props.match.params.taskID,
            buildNum: parsedHash.buildNumber
        }).then((res) => {
            if (res.code === 0) {
                const taskList = res.task
                if(!taskList){
                    message.error('数据不完整，无任务信息')
                    return
                }
                const stepsList = res.steps
                this.checkTaskList(taskList)
                if(taskList.taskStatus===1||taskList.taskStatus===3){
                    this.checkStepList(stepsList)
                    // this.refreshTaskDetail(parsedHash.curRecordNo)
                }else{
                    this.checkStepList(stepsList)
                }
            }else{
                message.error(res.msg)
            }
        })
    }

    getPipelineDetail = () => {
        const parsedHash = qs.parse(this.props.location.search.slice(1));
        const {timer } = this.state;
        if (timer) {
            clearTimeout(timer);
            this.setState({
                timer: null
            });
        }

        reqGet('/pipeline/taskdetail', {
            taskID: this.props.match.params.taskID,
            buildNum: parsedHash.buildNumber
        }).then((res) => {
            if (res.code === 0) {
                const taskList = res.task
                if(!taskList){
                    message.error('数据不完整，无任务信息')
                    return
                }
                const stepsList = res.steps
                this.checkTaskList(taskList)
                if(taskList.taskStatus===1||taskList.taskStatus===3){
                    this.refreshTaskDetail(parsedHash.curRecordNo)
                }else{
                    this.checkStepList(stepsList)
                }
            }else{
                message.error(res.msg)
            }
        }).catch((e)=>{
            message.error(e)
            this.setState({
                timer: null
            });
        })
    }


    refreshTaskDetail = (recordNo) => {
        const {timer } = this.state;
        if (timer) {
            clearTimeout(timer);
            this.setState({
                timer: null
            });
        }


        reqGet('/pipeline/taskstatus',{
            taskID: this.props.match.params.taskID,
            recordNo: recordNo
        }).then((res) => {
            if (res.code === 0) {

                let statusList = res.steps
                let taskList = res.task
                // console.log(statusList)
                let temparray = []
                statusList.map((statusItem)=>{
                    temparray.push(statusItem)
                })
                this.makeStepCard(temparray)
                this.checkTaskList(taskList)
                this.setState({
                    timer: taskList &&  taskList.taskStatus !== 2 && (new Date().getTime() - this.state.timerStart < 3600000) ? setTimeout(()=>this.refreshTaskDetail(recordNo), 10e3) : null
                })
            }else{
                message.error(res.msg)
            }
        }).catch((e)=>{
            message.error(e)
            this.setState({
                timer: null
            });
        })

        // reqGet('/pipeline/taskinfo', {
        //     taskID: this.props.match.params.taskID,
        // }).then((res) => {
        //     if (res.code === 0) {
        //         const taskList = res.task
        //         if(!taskList){
        //             message.error('数据不完整，无任务信息')
        //             return
        //         }
        //         const stepsList = res.steps
        //         this.checkTaskList(taskList)
        //         this.getPipelineRunStatus(stepsList)
        //
        //         this.setState({
        //             timer: taskList &&  taskList.taskStatus !== 2 && (new Date().getTime() - this.state.timerStart < 3600000) ? setTimeout(this.refreshTaskDetail, 10e3) : null
        //         })
        //
        //     }else{
        //         message.error(res.msg)
        //     }
        // }).catch((e)=>{
        //     message.error(e)
        //     this.setState({
        //         timer: null
        //     });
        // })
    }


    makeStepCard = (stepsList) => {
        let finalStep
        finalStep = constructStepCard(stepsList)
        this.setState({stepsList: stepsList})
        this.setState({finalStep: finalStep})
        this.setState({fullSteps: this.composeEditFinalStep(finalStep)})
    }

    makeHistoryStepCard = (stepsList) => {
        let historyStep
        historyStep = constructStepCard(stepsList)
        this.setState({historyStep: historyStep})
    }
    getPipelineRunStatus = (stepsList)=>{
        const parsedHash = qs.parse(this.props.location.search.slice(1));
        reqGet('/pipeline/taskstatus',{
            taskID: this.props.match.params.taskID,
            buildNum: parsedHash.buildNumber
        }).then((res) => {
            if (res.code === 0) {

                let statusList = res.list
                // console.log(statusList)
                let temparray = []
                statusList.map((statusItem)=>{
                    // temparray.push(Object.assign({},stepsList.find((finalStepItem)=>finalStepItem.stepCode===statusItem.stepCode),statusItem))
                    temparray.push(statusItem)
                })
                this.makeStepCard(temparray)
            }else{
                message.error(res.msg)
            }
        })
    }

    setStepStatus =(item) =>{
        let stepStatus = item.stepStatus
        switch (stepStatus) {
            case 0:
                return `#ffffff`
            case 1:
                return `#1890ff`
            case 2:
                return enumPipelineResultColor[item.stepResult]
             case 3:
                return `#ffffff`
            default:
                return `#ffffff`
        }
    }

    setStepStatusIcon =(item) =>{
        if(item &&item[1]){
            let steps = item[1]
            let stepsRunStatus = []
            for (let i = 0; i < steps.length; i++) {
                const currentStep = steps[i]
                stepsRunStatus.push(currentStep.stepStatus)
            }
            // console.log(stepsRunStatus)
            if(stepsRunStatus.includes(1)){
                switch (this.state.taskStatus) {
                    case 0:
                        return ''
                    case 1:
                        return <Icon type="loading" />
                    case 2:
                        return ''
                    case 3:
                        return ''
                    default:
                        return ''
                }

            }
        }

    }

    handleDeletePipeline = () =>{
        reqDelete(`/pipeline/deletetask/${this.props.match.params.taskID}`).then((res) => {
            if (res.code === 0) {
                this.props.history.push(`/pipeline`)
            }else{
                message.error(res.msg)
            }
        })
    }

    getHistoryList = ()=>{
        reqGet('/pipeline/taskrecordselect',{
            taskID:this.props.match.params.taskID
        }).then((res)=>{
                if (res.code === 0) {
                    this.setState({waitCount:res.count})
                    this.setState({historyBranch:res.data})
                }else{
                    message.error(res.msg)
                }
        })
    }
    changeHistory = (recordNoWithBuildNum)=>{
        clearTimeout(this.state.timer);
        const recordNo = recordNoWithBuildNum && recordNoWithBuildNum.split('|')[0]
        const buildNum = recordNoWithBuildNum && recordNoWithBuildNum.split('|')[1]
        this.getHistoryDetail(recordNo)
        this.setState({showHistory:true})
        this.setState({historyBuildNum:buildNum})
    }

    getHistoryDetail = (recordNo) =>{
        if(recordNo === 0){
           message.info(`等待中任务无数据`)
        }else{
            reqGet('/pipeline/taskhistorydetail',{
                taskID:this.props.match.params.taskID,
                recordNo: recordNo
            }).then((res)=>{
                if (res.code === 0) {
                    let data = res.data
                    let list = res.list

                    data && this.setState({execTimeStr:data.execTimeStr})
                    this.makeHistoryStepCard(list)
                }else{
                    message.error(res.msg)
                }
            })
        }

    }

    checkTaskList = (taskList) => {
        const {
            taskCode,
            taskName,
            jenkinsJob,
            branchName,
            branchID,
            taskStatus,
            taskResult,
            exexTime,
            lastExecTime,
            execTimeStr,
            createTime,
            updateTime

        } = taskList
        this.setState({
            taskCode,
            taskName,
            jenkinsJob,
            branchName,
            branchID,
            taskStatus,
            taskResult,
            exexTime,
            lastExecTime,
            execTimeStr,
            createTime,
            updateTime
        })
        this.showDistanceTime()
    }

    checkStepList = (stepsList) => {
        // this.getPipelineRunStatus(stepsList)
        this.makeStepCard(stepsList)
    }

    runTask = () => {
        reqPostURLEncode('/pipeline/taskbuild', {
            taskID: this.props.match.params.taskID
        }).then((res) => {
            if (res.code === 0) {
                this.setState({taskStatus: res.status})
                message.success('开始执行')
                setTimeout(this.refreshTaskDetail(res.recordNo),10e3)
            }else{
                message.error(res.msg)
            }
        })
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

    showDistanceTime=() =>{
        let d = formatTime(this.state.lastExecTime,'minute')
        this.setState({distanceTime: d})
    }

    componentWillMount () {
        const oldProjectId = window.localStorage.getItem('oldProjectId');

        window.localStorage.setItem('oldProjectId', this.props.projectId);

        if (oldProjectId !== null && oldProjectId !== this.props.projectId) {
            this.props.history.push('/pipeline');
        }
        const parsedHash = qs.parse(this.props.location.search.slice(1))
        const taskID = this.props.match.params.taskID
        const buildNum = parsedHash.buildNumber+ ''
        const platform = parsedHash.platform+ ''
        this.setState({
            taskID,
            buildNum,
            platform,
        })
    }

    componentDidMount () {
        const parsedHash = qs.parse(this.props.location.search.slice(1))
        if (this.props.location.state && (this.props.location.state.taskStatus === 3 || this.props.location.state.taskStatus === 1)) {
            if (this.state.buildNum === '0') {
                this.getBasicInfo()
            } else {
                this.refreshTaskDetail(parsedHash.curRecordNo)
            }
        } else {
            if (this.state.buildNum  === '0') {
                this.getBasicInfo()
            } else {
                this.getPipelineDetail()
            }
        }

        this.getHistoryList()
        this.setState({
            timerStart: new Date().getTime()
        })
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);

        this.setState = (state,callback)=>{
            return;
        }
    }

    render () {
        const {
            taskID,
            buildNum,
            platform,
            delModalVisible,
            taskCode,
            taskName,
            branchName,
            taskStatus,
            taskResult,
            distanceTime,
            execTimeStr,
            finalStep,
            waitCount,
            showHistory,
            historyStep
        } = this.state
        return (
            <div className="pipeline">
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/pipeline">流水线</Link></BreadcrumbItem>
                    <BreadcrumbItem>详情</BreadcrumbItem>
                </Breadcrumb>
                <Modal title="删除流水线"
                       visible={delModalVisible}
                       onOk={this.handleDeletePipeline}
                       onCancel={this.hideModal}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <p>是否删除该流水线 ？</p>
                </Modal>
                <section className="pipeline-box">
                    <div className="pipeline-header">
                        <Row gutter={16} type="flex" justify="space-between" align="middle">
                            <Col>
                                <Row gutter={16} type="flex" justify="space-between" align="middle">
                                    <Col>
                                        <h2>流水线详情</h2>
                                    </Col>
                                    <Col><Button onClick={()=>{this.showModal()}} ghost type="danger" shape="circle" icon="delete"/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row gutter={16} type="flex" justify="space-between" align="middle">
                                    <Col>
                                        <span>Tips: 有{waitCount}个任务正在等待</span>
                                    </Col>
                                    <Col>
                                        <Button disabled={taskStatus===1}
                                            type="primary" onClick={()=>{
                                            this.gotoEditPipeline()
                                        }}>编辑</Button>
                                    </Col>
                                    <Col>

                                        <Select placeholder="请选择构建历史"
                                                onChange={this.changeHistory}
                                                style={{width: 300}}>
                                            {
                                                this.state.historyBranch.map((item,key) => {
                                                    return <Option
                                                        title={item.recordNo+''}
                                                        value={item.recordNo}
                                                        key={key}
                                                    >{item.updateTime}</Option>
                                                })
                                            }
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
                                        <h2>{taskName} <span>（ID：{taskCode}）{!showHistory && taskStatus === 1 && <Icon type="loading" />}</span></h2>
                                    </Col>
                                    <Col span={12}>
                                        <div className="pipeline-item-user">
                                            {/*gitlab push by liaoshengjian*/}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="pipeline-item-content">
                                <Row>
                                    <Col span={20}>
                                        <div className="pipeline-item-main">
                                            {
                                                !showHistory && <p className="pipeline-item-timemeta">
                                                <span><i>最近执行时间：</i>{distanceTime}</span>
                                                <span><i>执行分支：</i>{branchName}</span>
                                                <span><i>最近执行时长：</i>{execTimeStr}</span>
                                                </p>
                                            }
                                            {showHistory && <p className="pipeline-item-timemeta">
                                                <span><i>执行时间：</i>{distanceTime}</span>
                                                <span><i>执行分支：</i>{branchName}</span>
                                                <span><i>执行时长：</i>{execTimeStr}</span>
                                            </p>}
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <div className="pipeline-item-ctrl">

                                            <Row gutter={16} type="flex" justify="space-between" align="middle">
                                                <Col>
                                                    <span>最近执行状态：</span>{this.pipelineRunStatusText(taskStatus,taskResult)}
                                                </Col>
                                                <Col>
                                                    <Button disabled={taskStatus===1 || taskStatus === 3} type="primary" onClick={()=>this.runTask()}>{enumButtonText[taskStatus]}</Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                                <Steps size="small"
                                       status={this.pipelineStepStatus(taskStatus,taskResult)}
                                       labelPlacement="vertical"
                                       current={this.pipelineStepCurrent()}
                                >
                                    <Step title="开始"></Step>

                                    {!showHistory && finalStep  && finalStep.map((item, index) => {
                                        return <Step title={enumStepsText[item[0]].title} key={index}
                                                     icon={this.setStepStatusIcon(item)}
                                                     description={
                                            item[1].map((item, index) => {

                                                return <Card
                                                        style={{width: 150, marginLeft: '-18%',background:this.setStepStatus(item)}}
                                                        title={item.stepName}
                                                        className={taskStatus===1?(item.stepStatus === 1? 'step-status-running':''): '' }
                                                        key={item.stepID}
                                                    >
                                                        <p>{item.stepDesc}</p>

                                                    </Card>
                                            })

                                        }>

                                        </Step>
                                    })}
                                    {showHistory && historyStep && historyStep.map((item, index) => {
                                        return <Step title={enumStepsText[item[0]].title} key={index} description={
                                            item[1].map((item, index) => {

                                                return <Card
                                                        style={{width: 150, marginLeft: '-18%',background:enumPipelineResultColor[item.historyResult]}}
                                                        title={item.stepName}
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
                {
                    !showHistory &&
                    <ExecutionReport className="pipeline-box" taskID={taskID} buildNum={buildNum} platform={platform}/>
                }
                {
                    showHistory  &&
                    <ExecutionReport className="pipeline-box" taskID={taskID} buildNum={this.state.historyBuildNum} platform={platform}/>
                }

            </div>
        )
    }
}

pipelineDetail = connect((state) => {
    return {
        taskID: state.taskID,
        projectId: state.projectId
    }
},{setStep,removeSteps,setSteps})(pipelineDetail)

export default pipelineDetail
