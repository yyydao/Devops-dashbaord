import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link,withRouter } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet, reqDelete } from '@/api/api'

import { setStep,removeSteps,setSteps } from '@/store/action'

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
    {id: 0, name: '代码拉取'},
    {id: 1, name: '单元测试'},
    {id: 2, name: '静态扫描'},
    {id: 3, name: '编译打包'},
    {id: 4, name: '安全扫描'},
    {id: 5, name: 'UI测试'},
    {id: 6, name: '性能测试'},
    {id: 7, name: '加固'},
    {id: 8, name: '补丁'},
    {id: 9, name: '包管理'},
    {id: -1, name: '自定义'},
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

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let notFormattedSteps = this.state.fullSteps, formattedSteps = [];
                // console.log(notFormattedSteps)
                for (let i = 0; i < notFormattedSteps.length; i++) {
                    const notFormattedStep = notFormattedSteps[i]
                    if(notFormattedStep[1] && notFormattedStep[1].length>0){
                        let stepData = notFormattedStep[1]
                        // console.log(stepData)
                        for (let j = 0; j < stepData.length; j++) {
                            const stepDatumString = stepData[j].stepParams
                            // console.log(stepDatumString)
                            const stepDatum = JSON.parse(stepDatumString)
                            let obj={ };
                            stepDatum.map((item,index)=>{
                                obj[item.json_jsonParams] = item.json_jsonValue;
                            })
                            notFormattedStep[1][j].stepParams = obj
                        }
                        formattedSteps.push(...notFormattedStep[1])
                    }

                }
                console.log({steps: formattedSteps})
                reqPost('/pipeline/updatetask', {
                    projectID: this.props.projectId,
                    ...values,
                    branchID:this.props.form.getFieldValue('branchID'),
                    ddStatus:0,
                    steps: formattedSteps,
                    taskID:this.props.match.params.taskID
                }).then(res => {
                    if (parseInt(res.code, 0) === 0) {
                        message.success('项目修改成功！')
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
                }
            })
        }else{
            this.setState({stepsList: stepsList})
            setSteps(this.state.stepsList)
        }



    }

    handleEditTask = (item) =>{
        console.log(item)
        this.props.history.push({
            pathname:'/pipeline/task/edit',
            state: {
                stepCode: item.stepCode,
                stepCategory: item.stepCategory,
                editable:true,
                existPipeline: true,
                taskID: this.props.match.params.taskID
            }
        })

    }

    //获取分支列表
    getBranchList = (value = '') => {
        reqPost('/branch/selectBranch', {
            projectId: this.props.projectId,
            branchName: value,
            pageSize: 100,
            pageNum: 1,
            type: 1,
            search: value ? 1 : ''
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    branchList: res.data
                })
            }
        })
    }

    //修改选中分支
    changeBranch = (changedBrancID) => {
        console.log(`changedBrancID ${changedBrancID}`)
        this.setState({branchID:changedBrancID})
    }

    setPipelineInfo(){
        reqGet('/pipeline/taskdetail', {
            taskID: this.props.match.params.taskID
        }).then((res) => {
            if (res.code === 0) {
                console.log(res)
                this.props.form.setFieldsValue({
                    taskName: res.task.taskName,
                    // branchID:  res.task.branchID,
                    branchID: res.task.branchID ,
                    jenkinsJob: res.task.jenkinsJob,
                });
            }
        })


    }

    componentWillMount () {

        let currentEditedPipeline =JSON.parse(localStorage.getItem('currentEditedPipeline'))
        let fullSteps = currentEditedPipeline ? currentEditedPipeline.fullSteps: []
        let stepsList =  currentEditedPipeline ? currentEditedPipeline.stepsList: []
        if(!this.props.location.state){
            console.log('1')

            this.setState({stepsList:stepsList})
            this.setState({fullSteps:fullSteps})
        }else{
            console.log('2')
            if(!!this.props.location.state.fullSteps){
                this.setState({fullSteps:this.props.location.state.fullSteps})
            }else{
                this.setState({fullSteps:fullSteps})
            }
            if(!!this.props.location.state.stepsList){
                this.setState({stepsList:this.props.location.state.stepsList})
            }else{
                this.setState({stepsList:stepsList})
            }


        }

        this.setPipelineInfo();
    }

    componentDidMount () {

        this.getBranchList()
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
                                <Link key={index}
                                      to={{
                                          pathname: `/pipeline/task/add`,
                                          state: {
                                              stepCode: item.id,
                                              stepCategory: stepCategory,
                                              existPipeline: true,
                                              taskID: this.props.match.params.taskID,
                                              fullSteps: this.state.fullSteps,
                                              stepsList: this.state.stepsList,
                                              jenkinsJob: this.props.form.getFieldValue('jenkinsJob'),
                                          }
                                      }}>
                                    <Card.Grid style={gridStyle}>{item.name}</Card.Grid>
                                </Link>
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
                            {getFieldDecorator('branchID', {
                                rules: [{required: true, message: '请选择开发分支'}],
                            })(
                                <Select placeholder="请选择开发分支"
                                        showSearch
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
                            {getFieldDecorator('ddStatus', {valuePropName: 'checked'})(
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
