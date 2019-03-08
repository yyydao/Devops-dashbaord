import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import { reqGet, reqPost } from '@/api/api'

import {
  Breadcrumb,
  Steps,
  Button,
  Select,
  message,
  TimePicker,
  Modal,
  Form, Radio, Input, Icon,
} from 'antd'

import CustomTree from '@/components/CustomTree'

const BreadcrumbItem = Breadcrumb.Item
const Option = Select.Option
const Step = Steps.Step

class PerformanceAdd extends Component {
  constructor (props) {
    super(props)

    this.state = {
      //测试类型
      testType: props.type,
      current: 0,

      platform: props.platform,

      addVisible: false,
      addConfirmLoading: false,

      branchList: [],
      sceneDataList: [],
      // 机型列表
      modalList: [],
      modal: '',

      chooseSceneID: [],

    }
  }

  //新建构建任务
  addItem = () => {
    const { typeValue, formDataBranch, chooseSceneID, formDataTime } = this.state
    console.log(chooseSceneID)
    if (!formDataBranch) {
      message.error('请选择“开发分支”')
      return
    } else if (chooseSceneID.length < 1) {
      message.error('请选择“执行场景”')
      return
    } else if (this.state.typeValue === 2 && !formDataTime) {
      message.error('请选择“定时时间”')
      return
    }

    this.setState({
      addConfirmLoading: true
    })

    reqPost('/task/addSubmit', {
      projectId: Number(this.props.projectId),
      buildType: typeValue,
      branchName: formDataBranch,
      sceneId: chooseSceneID.join(','),
      fixTime: formDataTime
    }).then(res => {
      this.hideModal()

      if (res.code === 0) {
        this.getList('buildingList')
      } else {
        Modal.info({
          title: '提示',
          content: (
            <p>{res.msg}</p>
          ),
          onOk () {}
        })
      }

    })
  }

  /**
   * @desc 获取分支列表
   * @param value
   */
  getBranchList = (value = '') => {
    reqPost('/branch/selectBranch', {
      projectId: this.props.projectId,
      branchName: value,
      pageSize: 100,
      pageNum: 1,
      type: 2,
      search: value ? 1 : ''
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          branchList: res.data
        })
      }
    })
  }

  /**
   * @desc 修改选中分支
   * @param formDataBranch
   */
  changeBranch = (formDataBranch) => {
    this.setState({
      formDataBranch
    })
  }

  /**
   * @desc 获取场景列表
   */
  getSceneList = () => {
    reqGet('/testScene/list/' + this.props.projectId).then(res => {
      if (res.code * 1 === 0) {
        this.setState({
          parentsSceneList: res.data.map(item => {
            return {
              name: item.name,
              id: item.id,
              indeterminate: false,
              checked: false
            }
          }),
          sceneDataList: res.data
        }, () => {
          console.log(this.state.parentsSceneList)
        })
      }
    })
  }

  //修改新建定时时间
  changeTime = (moment) => {
    this.setState({
      formDataTime: moment.format('HH:mm:ss')
    })
  }
  /**
   * @desc 获取机型列表
   */
  getModalList = () => {
    reqGet(`/dictionary/performance/phonelist/`, {
      projectID: this.props.projectId
    }).then(res => {
      this.setState({modalList:res.data})
    })
  }

  onSceneChange = (a) => {
    this.setState({ chooseSceneID: a })
  }

  next () {
    const current = this.state.current + 1
    this.setState({ current })
  }

  prev () {
    const current = this.state.current - 1
    this.setState({ current })
  }

  componentWillMount () {
    this.getModalList()
    this.getBranchList()
    this.getSceneList()
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    const {
      current,
      branchList,
      modalList,
      addVisible,
      formDataBranch
    } = this.state

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    const BranchStep = <React.Fragment>
      <Form.Item
        label="编译环境"
        {...formItemLayout}
      >
        <Radio.Group>
          <Radio value="a">测试环境</Radio>
          <Radio value="b">灰度环境</Radio>
          <Radio value="c">正式环境</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="构建账号"
        {...formItemLayout}
      >
        <Input style={{ width: 300 }}
               prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>}
               placeholder="构建账号"/>
        <Input style={{ width: 300 }}
               prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="password"
               placeholder="构建账号密码"/>
      </Form.Item>
      <Form.Item
        label="测试机型"
        {...formItemLayout}
      >
        <Select placeholder="测试机型"
                mode="multiple"
                style={{ width: 300 }}
                showSearch
                value={formDataBranch}>
          {
            modalList.map((item) => {
              return <Option value={item.text} key={item.code}
                             title={item.text}>{item.text}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        label="开发分支"
        {...formItemLayout}
      >
        <Select placeholder="开发分支"
                style={{ width: 300 }}
                showSearch
                value={formDataBranch}
                onSearch={this.getBranchList}
                onChange={this.changeBranch}>
          {
            branchList.map((item) => {
              return <Option value={item.name} key={item.id}
                             title={item.name}>{item.name}</Option>
            })
          }
        </Select>
      </Form.Item>
    </React.Fragment>

    const SceneStep = <React.Fragment>
      <Form.Item
        label="源码分支"
        {...formItemLayout}
      >
        <span className="ant-form-text">{this.state.branchName}</span>
      </Form.Item>
      <Form.Item
        label="测试场景"
        {...formItemLayout}
      >
        <CustomTree data={this.state.sceneDataList} onSceneChange={this.onSceneChange}/>
      </Form.Item>
    </React.Fragment>

    const TimerStep = <React.Fragment>
      <label className="performance-modal-item-label">定时时间：</label>
      <div className="performance-modal-item-content">
        {
          addVisible && <TimePicker onChange={this.changeTime}/>
        }
      </div>
    </React.Fragment>

    const BasicStep = [{
      title: '选择测试分支',
      content: BranchStep,
    }, {
      title: '配置测试场景',
      content: SceneStep,
    }, {
      title: '提交测试',
      content: 'Last-content',
    }]

    const TimerOptionsStep = [
      {
        title: '配置定时时间',
        content: TimerStep,
      }
    ]

    let TestSteps = BasicStep
    if (this.state.testType === 'branch') {
      BasicStep.splice(2, 0, TimerOptionsStep)
    }
    console.log(TestSteps)

    return (
      <div className="performance">
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/performanceConfig">性能测试管理</Link></BreadcrumbItem>
          {this.state.testType === 'branch' ?
            <BreadcrumbItem><Link to="/performanceConfig/branch">分支测试</Link></BreadcrumbItem> :
            <BreadcrumbItem><Link to="/performanceConfig/timer">定时测试</Link></BreadcrumbItem>
          }
          <BreadcrumbItem>新增测试</BreadcrumbItem>
        </Breadcrumb>

        <div className="devops-main-wrapper">

          <div className="performance-main">
            <Steps current={current}>
              {TestSteps.map(item => <Step key={item.title} title={item.title}/>)}
            </Steps>
            <div className="steps-content">{TestSteps[current].content}</div>
            <div className="steps-action">
              {
                current < TestSteps.length - 1
                && <Button type="primary" onClick={() => this.next()}>Next</Button>
              }
              {
                current === TestSteps.length - 1
                && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
              }
              {
                current > 0
                && (
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    Previous
                  </Button>
                )
              }
            </div>
          </div>
        </div>


      </div>
    )
  }
}

PerformanceAdd = connect((state) => {
  return {
    projectId: state.project.projectId,
    platform: state.project.platform
  }
})(PerformanceAdd)

export default PerformanceAdd
