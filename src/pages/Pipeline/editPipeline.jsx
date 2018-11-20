import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link,withRouter } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet, reqDelete } from '@/api/api'

import { setStep,removeSteps,setSteps } from '@/store/action'
import {stepParamstoArray, stepParamstoObject } from '@/utils/utils.js'

import {
    Steps,
    Form,
    Input,
    Breadcrumb,
    Switch,
    Card,
    Button,
    Icon,
    Select,
    Modal,
    message,
    Dropdown,
    Menu
} from 'antd'
import qs from 'qs'

const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
const Option = Select.Option
const FormItem = Form.Item

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

const pipelineID = [
    {id: 0, name: '代码拉取',stepCode: 0},
    {id: 1, name: '单元测试',stepCode: 1},
    {id: 2, name: '静态扫描',stepCode: 2},
    {id: 3, name: '编译打包',stepCode: 3},
    {id: 4, name: '安全扫描',stepCode: 4},
    {id: 5, name: 'UI测试',stepCode: 5},
    {id: 6, name: '性能测试',stepCode: 6},
    {id: 7, name: '加固',stepCode: 7},
    {id: 8, name: '补丁',stepCode: 8},
    {id: 9, name: '包管理',stepCode: 9},
    {id: -1, name: '自定义',stepCode: -1},
]

class Edit extends Component {
    constructor (props) {
        super(props)

        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            branchList: [],
            formDataBranch: null,
            fullSteps: [],
            stepsList: []
        }
    }

    //显示新建窗口
    showModal = (itemStepCategory) => {
        this.setState({
            addVisible: true,
            stepCategory: itemStepCategory
        })
    }
    hideModal = () => {
        this.setState({
            addVisible: false
        })
    }

    isJsonString =(str) =>{
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
    }
    transLocalStorage =(notParsed) => {
        let paredStepList = notParsed
        if(Array.isArray(notParsed) ){
            for (let i = 0; i < notParsed.length; i++) {

                const stepElement = notParsed[i][1]
                if(stepElement){
                    for (let j = 0; j < stepElement.length; j++) {
                        const stepElementElement = stepElement[j]
                        if(this.isJsonString(stepElementElement.stepParams)){
                            paredStepList[i][1][j].stepParams = JSON.parse(stepElementElement.stepParams)
                        }
                    }
                }

            }
        }
        return paredStepList
    }


    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let notFormattedSteps = this.state.fullSteps, formattedSteps = [];
                console.log(notFormattedSteps)
                for (let i = 0; i < notFormattedSteps.length; i++) {
                    const notFormattedStep = notFormattedSteps[i]
                    if(notFormattedStep[1] && notFormattedStep[1].length>0){
                        const notFormattedStep = notFormattedSteps[i]
                        if(notFormattedStep[1] && notFormattedStep[1].length>0){
                            formattedSteps.push(...notFormattedStep[1])
                        }
                    }
                }

                let ddStatusBoolean = this.props.form.getFieldValue('ddStatusSwitch')
                reqPost('/pipeline/updatetask', {
                    projectID: this.props.projectId,
                    ...values,
                    branchName:this.state.branchName,
                    branchID:this.state.branchID,
                    ddStatus: ddStatusBoolean ? 1:0,
                    steps: formattedSteps,
                    taskID:this.props.match.params.taskID
                }).then(res => {
                    if (parseInt(res.code, 0) === 0) {
                        message.success('项目修改成功！')
                        this.props.history.push(`/pipeline`)
                    } else {
                        message.error(res.msg)
                    }
                })
            }
        })

    }

    handleDeleteTask = (item) =>{
        console.log(`item ${JSON.stringify(item)}`)
        let { setSteps } = this.props;
        let stepsList = this.state.stepsList
        let oldSteps = this.state.fullSteps
        if(!!item.stepID){
            reqDelete(`/pipeline/deltaskstep/${item.stepID}`,{}).then(res=>{
                if(res.code === 0){

                    for (let i = 0; i < stepsList.length; i++) {
                        const stepElement = stepsList[i]
                        if(stepElement.stepID+'' === item.stepID+''){
                            stepsList.splice(i,1)
                        }
                    }
                    for (let i = 0; i < oldSteps.length; i++) {
                        if (oldSteps[i][0] === item.stepCategory+'') {
                            let steps = oldSteps[i][1]
                            console.log(steps)
                            for (let j = 0; j < steps.length; j++) {
                                console.log(steps[j].stepID+'' === item.stepID+'')
                                if(steps[j].stepID+'' === item.stepID+''){
                                    oldSteps[i][1].splice(j,1)
                                }
                            }

                        }
                    }
                    setSteps(oldSteps)
                    this.setState({stepsList: stepsList})
                    this.setState({fullSteps: oldSteps})
                    this.setState({stepsList: stepsList})
                    // setSteps(this.state.stepsList)
                }else{
                    message.error(res.msg)
                }
            })
        }else{
            this.setState({stepsList: stepsList})
            setSteps(this.state.stepsList)
        }



    }

    handleEditTask = (item) =>{
        console.log(item)
        if(item.stepID){
            this.props.history.push({
                pathname:`/pipeline/task/edit/${item.stepID}`,
                search:  this.props.location.search,
                state: {
                    stepID:item.stepID,
                    stepCode: item.stepCode,
                    stepCategory: item.stepCategory,
                    existPipeline: true,
                    taskID: this.props.match.params.taskID,
                    branchID:this.state.branchID,
                    branchName:this.state.branchName,
                    jenkinsJob: this.props.form.getFieldValue('jenkinsJob'),
                }
            })

        }else{
            this.props.history.push({
                pathname:'/pipeline/task/edit',
                state: {
                    stepCode: item.stepCode,
                    stepCategory: item.stepCategory,
                    existPipeline: true,
                    taskID: this.props.match.params.taskID,
                    branchID:this.state.branchID,
                    branchName:this.state.branchName,
                    jenkinsJob: this.props.form.getFieldValue('jenkinsJob'),
                }
            })

        }

    }

    handleAddNewTask = (item) => {
        let stepsList = this.state.stepsList
        let stepCodeList = []
        for (let i = 0; i < stepsList.length; i++) {
            const stepsListElement = stepsList[i]
            stepCodeList.push(stepsListElement.stepCode)
        }
        if(stepCodeList.includes(item.stepCode)){
            message.error('请勿重复创建同类型任务')
            return
        }else{
            this.handleJumpToTask(item)
        }

        // for (let i = 0; i < stepsList.length; i++) {
        //     const stepElement = stepsList[i]
        //     console.log(stepElement)
        //     if(stepElement.stepCategory+'' === this.state.stepCategory+''){
        //         if(stepElement.stepCode+'' === item.stepCode+''){
        //             message.error('请勿重复创建同类型任务')
        //             return
        //         }else{
        //             this.handleJumpToTask(item)
        //         }
        //     }else{
        //         this.handleJumpToTask(item)
        //     }
        // }

    }

    handleJumpToTask = (item)=>{
        let data = this.props.form.getFieldsValue();
        this.props.history.push({
                state:  {
                    branchID:this.state.branchID,
                    branchName:this.state.branchName,
                    stepCode: item.id,
                    existPipeline: true,
                    taskID: this.props.match.params.taskID,
                    fullSteps: this.state.fullSteps,
                    stepsList: this.state.stepsList,
                    stepCategory: this.state.stepCategory,
                    jenkinsJob: this.props.form.getFieldValue('jenkinsJob'),
                    ...data
                },
                pathname: `/pipeline/task/add`,
                search:  this.props.location.search,
            })
    }

    //获取分支列表
    getBranchList = (value = '') => {
        reqPost('/branch/selectBranch', {
            projectId: this.props.projectId,
            branchName: value,
            pageSize: 1000,
            pageNum: 1,
            type: 1,
            search: value ? 1 : ''
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    branchList: res.data
                })
            }else{
                message.error(res.msg)
            }
        })
    }

    //修改选中分支
    changeBranch = (branchObject) => {
        console.log(branchObject)
        this.setState({branchID:branchObject.key})
        this.setState({branchName:branchObject.label})
    }

    setPipelineInfo(){
        const parsedHash = qs.parse(this.props.location.search.slice(1));
        console.log(parsedHash)
        reqGet('/pipeline/taskdetail', {
            taskID: this.props.match.params.taskID,
            buildNum: parsedHash.buildNumber
        }).then((res) => {
            if (res.code === 0) {
                if(res.task === null){
                    message.error('数据不完整，无任务信息')
                    return
                }
                let branchID = res.task.branchID
                this.props.form.setFieldsValue({
                    taskName: res.task.taskName,
                    ddStatusSwitch:res.task.ddStatus === 1,
                    branchObject:{key:branchID},
                    jenkinsJob: res.task.jenkinsJob,
                });

                this.setState({branchID: res.task.branchID })
                this.setState({branchName: res.task.branchName })
            }else{
                message.error(res.msg)
            }
        })


    }

    componentWillMount () {

        let currentEditedPipeline =JSON.parse(localStorage.getItem('currentEditedPipeline'))
        let fullSteps = currentEditedPipeline ? currentEditedPipeline.fullSteps: []
        let stepsList =  currentEditedPipeline ? currentEditedPipeline.stepsList: []
        let parsedFullSteps = this.transLocalStorage(fullSteps)
        let parsedStepsList = this.transLocalStorage(stepsList)
        if(!this.props.location.state){
            console.log('1')

            this.setState({stepsList:parsedStepsList})
            this.setState({fullSteps:parsedFullSteps})
        }else{
            console.log('2')
            if(!!this.props.location.state.fullSteps){
                this.setState({fullSteps:this.transLocalStorage(this.props.location.state.fullSteps)})
            }else{
                this.setState({fullSteps:this.transLocalStorage(fullSteps)})
            }
            if(!!this.props.location.state.stepsList){
                this.setState({stepsList:this.transLocalStorage(this.props.location.state.stepsList)})
            }else{
                this.setState({stepsList:this.transLocalStorage(stepsList)})
            }


        }
        this.getBranchList()

    }

    componentDidMount () {
        this.setPipelineInfo();

    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {
            addVisible,
            addConfirmLoading,
            taskStatus,
            stepCategory,
            fullSteps,
            stepsList
        } = this.state

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        }
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        }

        const gridStyle = {
            width: '25%',
            textAlign: 'center',
        }

        return (
            <div id="pipeline-add">
                <Modal title="创建任务"
                       visible={addVisible}
                       onOk={this.addItem}
                       confirmLoading={addConfirmLoading}
                       onCancel={this.hideModal}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <Card>
                        {pipelineID.map((item, index) => {
                            return (
                                <Card.Grid key={index} style={gridStyle} onClick={()=>this.handleAddNewTask(item)}>{item.name}</Card.Grid>
                            )
                        })}

                    </Card>

                </Modal>

                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/pipeline">流水线</Link></BreadcrumbItem>
                    <BreadcrumbItem>编辑</BreadcrumbItem>
                </Breadcrumb>
                <section className="pipeline-box">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="流水线名称"
                        >
                            {getFieldDecorator('taskName', {
                                rules: [{required: true, message: '请输入'}]
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="执行分支"
                        >
                            {getFieldDecorator('branchObject', {
                                rules: [{required: true, message: '请选择开发分支'}],
                            })(
                                <Select placeholder="请选择开发分支"
                                        showSearch
                                        labelInValue
                                        onSearch={this.getBranchList}
                                        onChange={this.changeBranch}
                                        style={{width: 300}}
                                >
                                    {
                                        this.state.branchList.map((item) => {
                                            return <Option value={item.id} key={item.id}
                                                           title={item.name}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Jenkins Job"
                        >
                            {getFieldDecorator('jenkinsJob', {
                                rules: [{required: true, message: '请输入'}]
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="钉钉消息："
                        >
                            {getFieldDecorator('ddStatusSwitch', {valuePropName: 'checked'})(
                                <Switch/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="选择流水线节点"
                        >
                        </FormItem>

                        <div className="pipeline-item-content">


                            <Steps size="small" labelPlacement="vertical" current={taskStatus}>
                                <Step title="开始"></Step>
                                {
                                    fullSteps.map((item, index) => {
                                        return <Step title={enumStepsText[item[0]].title} key={index} description={<div>
                                            {item[1].map((item, index) => {
                                                // console.log(item)
                                                return <Card
                                                    style={{width: 150, marginLeft: '-18%'}}
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
                                                    key={index}
                                                >
                                                    <p>{item.stepDesc}</p>
                                                </Card>
                                            })}
                                            <Button icon="plus" type="default" onClick={() => {
                                                this.showModal(item[0])
                                            }}>添加任务</Button>
                                        </div>
                                        }>
                                        </Step>
                                    })
                                }
                                <Step title="完成" description={<div></div>}></Step>
                            </Steps>
                        </div>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">保存</Button>
                        </FormItem>
                    </Form>
                    <section className="pipeline-main">
                        <div className="pipeline-item">
                        </div>
                    </section>
                </section>
            </div>
        )
    }
}

Edit = connect((state) => {
    return {
        projectId: state.projectId
    }
}, {setStep,removeSteps,setSteps})(Edit)

const pipelineEdit = Form.create()(Edit)

export default withRouter(pipelineEdit)
