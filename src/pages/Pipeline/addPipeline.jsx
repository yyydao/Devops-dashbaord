import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import './index.scss'
import { reqPost } from '@/api/api'
import { isJsonString } from '@/utils/utils'

import Acode from '@/assets/svg/pipelining_icon_acode.svg'
import StaticScanning from '@/assets/svg/pipelining_icon_static_scanning.svg'
import UT from '@/assets/svg/pipelining_icon_unit_testing.svg'
import Compile from '@/assets/svg/pipelining_icon_compile.svg'
import Security from '@/assets/svg/pipelining_icon_app_scanning.svg'
import UIT from '@/assets/svg/pipelining_icon_ui_test.svg'
import PerformanceTest from '@/assets/svg/pipelining_icon_performance.svg'
import Reinforce from '@/assets/svg/pipelining_icon_reinforce.svg'
import Patching from '@/assets/svg/pipelining_icon_patching.svg'
import Package from '@/assets/svg/pipelining_icon_package.svg'
import Custom from '@/assets/svg/pipelining_icon_custom.svg'

import { setStep, removeSteps, setSteps } from '@/store/actions/pipeline'

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
  Menu,
  Row,
  Col,
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
  { id: 0, name: '代码拉取', stepCode: 0, component: () => (<Acode/>) },
  { id: 1, name: '单元测试', stepCode: 1, component: () => (<UT/>) },
  { id: 2, name: '静态扫描', stepCode: 2, component: () => (<StaticScanning/>) },
  { id: 3, name: '编译打包', stepCode: 3, component: () => (<Compile/>) },
  { id: 4, name: '安全扫描', stepCode: 4, component: () => (<Security/>) },
  { id: 5, name: 'UI测试', stepCode: 5, component: () => (<UIT/>) },
  { id: 6, name: '性能测试', stepCode: 6, component: () => (<PerformanceTest/>) },
  { id: 7, name: '加固', stepCode: 7, component: () => (<Reinforce/>) },
  { id: 8, name: '补丁', stepCode: 8, component: () => (<Patching/>) },
  { id: 9, name: '包管理', stepCode: 9, component: () => (<Package/>) },
  { id: -1, name: '自定义', stepCode: -1, component: () => (<Custom/>) },
]

class AddPipeline extends Component {
  constructor (props) {
    super(props)

    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      branchList: [],
      formDataBranch: null,
      stepCategory: 1,
      ddStatusSwitch: false,
      stepsList: [[1, []], [2, []], [3, []]]
    }
  }

  //显示新建窗口
  showModal = (stepCategory) => {
    this.props.form.validateFieldsAndScroll(['jenkinsJob'], (err, values) => {
      if (!err) {
        this.setState({
          addVisible: true,
          stepCategory: stepCategory
        })
      }
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
        let notFormattedSteps = this.state.stepsList, formattedSteps = []
        for (let i = 0; i < notFormattedSteps.length; i++) {
          const notFormattedStep = notFormattedSteps[i]
          if (notFormattedStep[1] && notFormattedStep[1].length > 0) {
            formattedSteps.push(...notFormattedStep[1])
          }
        }
        let ddStatus = values.ddStatusSwitch ? 1 : 0
        reqPost('/pipeline/addtask', {
          projectID: this.props.projectId,
          ...values,
          steps: formattedSteps,
          ddStatus: ddStatus,
          branchName: this.state.branchName,
          branchID: this.state.branchID
        }).then(res => {
          if (parseInt(res.code, 0) === 0) {
            message.success('项目新增成功！')
            this.props.history.push(`/pipeline`)
          } else {
            message.error(res.msg)
          }
        })
      }
    })

  }

  handleDeleteTask = (item) => {
    let { setSteps } = this.props
    let stepsList = this.state.stepsList
    for (let i = 0; i < stepsList.length; i++) {
      const stepElement = stepsList[i]
      if (stepElement[0] === item.stepCategory) {
        for (let j = 0; j < stepElement[1].length; j++) {
          const stepElementElement = stepElement[1][j]
          console.log(stepElementElement)
          if (stepElementElement.stepCode === item.stepCode) {
            stepElement[1].splice(j, 1)
          }
        }
      }
    }
    this.setState({ stepsList: stepsList })
    setSteps(this.state.stepsList)
  }

  handleEditTask = (item) => {
    console.log(item)
    let data = this.props.form.getFieldsValue()
    this.props.history.push({
      pathname: '/pipeline/task/edit',
      state: {
        stepCode: item.stepCode,
        stepCategory: item.stepCategory,
        existPipeline: false,
        jenkinsJob: this.props.form.getFieldValue('jenkinsJob'),
        fullSteps: this.state.fullSteps,
        stepsList: this.state.stepsList,
        branchID: this.state.branchID,
        branchName: this.state.branchName,
        ...data
      }
    })

  }

  handleJumpToTask = (item) => {
    let data = this.props.form.getFieldsValue()
    console.log(data)
    this.props.history.push({
        pathname: `/pipeline/task/add`,
        state: {
          branchID: this.state.branchID,
          branchName: this.state.branchName,
          stepCode: item.id,
          stepCategory: this.state.stepCategory,
          addNewPipeline: true,
          jenkinsJob: this.props.form.getFieldValue('jenkinsJob'),
          ...data
        }

      }
    )
  }

  handleAddNewTask = (item) => {
    let stepsList = this.state.stepsList
    let stepCodeList = []
    for (let i = 0; i < stepsList.length; i++) {
      const categoryItem = stepsList[i][1]
      for (let j = 0; j < categoryItem.length; j++) {
        const categoryItemElement = categoryItem[j]
        stepCodeList.push(categoryItemElement.stepCode)
      }

    }
    if (stepCodeList.includes(item.stepCode)) {
      message.error('请勿重复创建同类型任务')
      return
    } else {
      this.handleJumpToTask(item)
    }

    // for (let i = 0; i < this.state.stepsList.length; i++) {
    //         const stepElement = stepsList[i]
    //         if(stepElement[0] === this.state.stepCategory){
    //             if(stepElement[1].length>0){
    //                 for (let j = 0; j < stepElement[1].length; j++) {
    //                     const stepElementElement = stepElement[1][j]
    //                     if(stepElementElement.stepCode === item.stepCode){
    //                         message.error('请勿重复创建同类型任务')
    //                     }else{
    //                         this.handleJumpToTask(item)
    //                     }
    //                 }
    //
    //             }else{
    //                 this.handleJumpToTask(item)
    //             }
    //
    //         }
    //     }

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
      } else {
        message.error(res.msg)
      }
    })
  }

  //修改选中分支
  changeBranch = (branchObject) => {
    console.log(branchObject)
    this.setState({ branchID: branchObject.key })
    this.setState({ branchName: branchObject.label })
  }


  transLocalStorage = (notParsed) => {
    let paredStepList = notParsed
    if (Array.isArray(notParsed)) {
      for (let i = 0; i < notParsed.length; i++) {
        const stepElement = notParsed[i][1]
        if (stepElement) {
          for (let j = 0; j < stepElement.length; j++) {
            const stepElementElement = stepElement[j]
            if (isJsonString(stepElementElement.stepParams)) {
              paredStepList[i][1][j].stepParams = JSON.parse(stepElementElement.stepParams)
            }
          }
        }

      }
    }
    return paredStepList
  }

  componentDidMount () {
    let tempStep = JSON.parse(localStorage.getItem('steps')), formatedStep = []
    this.getBranchList()
    let taskName, jenkinsJob, branchID = '', branchName = ''
    if (this.props.location.state) {
      taskName = this.props.location.state.taskName
      branchID = this.props.location.state.branchID ? this.props.location.state.branchID : ''
      jenkinsJob = this.props.location.state.jenkinsJob
      branchName = this.props.location.state.branchName
    }

    this.props.form.setFieldsValue({
      taskName: taskName,
      // branchID: branchID,
      branchObject: { key: branchID },
      jenkinsJob: jenkinsJob,
      ddStatusSwitch: this.state.ddStatusSwitch,
    })
    console.log(tempStep)
    formatedStep = this.transLocalStorage(tempStep)
    let stepsList = tempStep ? formatedStep : this.state.stepsList

    this.setState({ stepsList: stepsList })
    this.setState({ fullSteps: formatedStep })
    this.setState({ branchID: branchID })
    this.setState({ branchName: branchName })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const {
      addVisible,
      addConfirmLoading,
      taskStatus,
      stepsList
    } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
          offset: 0,
        },
      },
    }

    const gridStyle = {
      border: '1px solid rgba(0,0,0,0.15)',
      borderRadius: '8px',
      width: 110,
      height: 80,
      textAlign: 'center',
      marginTop: 32,
    }

    return (
      <div id="pipeline-add">
        <Modal title="创建任务"
               visible={addVisible}
               confirmLoading={addConfirmLoading}
               onCancel={this.hideModal}
               maskClosable={false}
               destroyOnClose={true}
               width={600}
               className='pipeline-task-modal'
               okText={'确定'}
               cancelText={'取消'}
        >

          <Card>
            <Row type="flex" justify="start">
              {pipelineID.map((item, index) => {
                return (

                  <Col key={index} span={6}>
                    <Card.Grid style={gridStyle}
                               onClick={() => this.handleAddNewTask(item)}>
                      <p><Icon component={item.component} style={{ fontSize: '32px' }}></Icon></p>
                      <p><span className={'taskName'}>{item.name}</span></p>
                    </Card.Grid>
                  </Col>

                )
              })}
            </Row>


          </Card>

        </Modal>

        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/pipeline">流水线</Link></BreadcrumbItem>
          <BreadcrumbItem>新增流水线</BreadcrumbItem>
        </Breadcrumb>
        <section className="pipeline-box pipeline-modify">
          <Card title="新增流水线" style={{ margin: 24 }}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                style={{ width: 386 }}
                {...formItemLayout}
                label="流水线名称"
              >
                {getFieldDecorator('taskName', {
                  rules: [{ required: true, message: '请输入' }]
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem
                style={{ width: 386 }}
                {...formItemLayout}
                label="执行分支"
              >
                {getFieldDecorator('branchObject', {
                  rules: [{ required: true, message: '请选择开发分支' }]
                })(
                  <Select placeholder="请选择开发分支"
                          showSearch
                          labelInValue
                          onSearch={this.getBranchList}
                          onChange={this.changeBranch}
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
                style={{ width: 386 }}
                {...formItemLayout}
                label="Jenkins Job"
              >
                {getFieldDecorator('jenkinsJob', {
                  rules: [{ required: true, message: '请输入Jenkins Job' }]
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem
                style={{ width: 386 }}
                {...formItemLayout}
                label="钉钉消息："
              >
                {getFieldDecorator('ddStatusSwitch', { valuePropName: 'checked' })(
                  <Switch/>
                )}
              </FormItem>
              <FormItem
                style={{
                  width: 386,
                  marginTop: 40,
                  fontSize: 14,
                  color: 'rgba(0,0,0,0.85)',
                  lineHeight: 22
                }}
                {...formItemLayout}
                label="选择流水线节点"
              >
              </FormItem>

            <div className="pipeline-item-content">


              <Steps size="small" labelPlacement="vertical" current={taskStatus}>
                <Step title="开始"></Step>
                {
                  stepsList.map((item, index) => {
                    return <Step title={enumStepsText[item[0]].title} key={index} description={<div>
                      {item[1].map((item, index) => {
                        // console.log(item)
                        return <div className='task-item' key={index}>
                          <Row type='flex' align='space-around' justify='middle' className='task-item-row'>
                            <Col span={20}>
                              <p className='item-info step-name' >{item.stepName}</p>
                              <p className='item-info step-desc'>{item.stepDesc}</p>
                            </Col>
                            <Col span={4} className='item-control-col'>
                              <Dropdown overlay={<Menu>
                                <Menu.Item>
                                  <a target="_blank" rel="noopener noreferrer" onClick={() => {
                                    this.handleEditTask(item)
                                  }
                                  }>编辑任务</a>
                                </Menu.Item>
                                <Menu.Item>
                                  <a target="_blank" rel="noopener noreferrer" onClick={() => {
                                    this.handleDeleteTask(item)
                                  }
                                  }>删除任务</a>
                                </Menu.Item>
                              </Menu>} placement="bottomCenter">
                                <Icon type="setting" theme="outlined"/>
                              </Dropdown>
                            </Col>
                          </Row>
                        </div>
                      })}
                      <Button style={{
                        width: 180,
                        marginLeft: '-37%',
                        background: '#F8F8F8',
                        border: '1px solid #F8F8F8',
                        textAlign: 'center',
                        padding: '4px',
                        height: '48px',
                        color: '#1890ff',
                        fontSize: '14px',
                        lineHeight: '24px',
                        marginTop: '8px',
                      }}
                              icon="plus" type="default" onClick={() => {
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
            <FormItem
              style={{ width: 386 }}
              {...tailFormItemLayout} >
              <Button style={{ marginTop: 40 }} type="primary" htmlType="submit">新建</Button>
            </FormItem>
            </Form>
          </Card>

        </section>
      </div>
    )
  }
}

AddPipeline = connect((state) => {
  return {
    projectId: state.projectId
  }
}, { setStep, removeSteps, setSteps })(AddPipeline)

const pipelineAdd = Form.create()(AddPipeline)

export default withRouter(pipelineAdd)
