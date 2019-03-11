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
    console.log(props)
    this.state = {
      //测试类型
      testType: props.location.type,
      current: 0,

      platform: props.platform,

      addVisible: false,
      addConfirmLoading: false,
      //测试环境
      envList: [],
      selectedEnvID: '',
      //分支
      branchList: [],
      selectedBranchName: '',
      // 机型列表
      modalList: [],
      selectedModalItems: [],
      modalChildren: '',
      // 场景列表
      sceneDataList: [],
      chooseSceneID: [],
      buildType: props.type === 'branch' ? '1' : '2'
    }
  }

  /**
   * @desc 新建构建任务
   */
  addItem = () => {
    const { buildType, selectedBranchName, chooseSceneID, formDataTime, selectedEnvID, selectedModalItems } = this.state
    console.log(chooseSceneID)
    if (!selectedBranchName) {
      message.error('请选择“开发分支”')
      return
    } else if (selectedEnvID.lengtht < 1) {
      message.error('请选择“测试环境”')
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

    reqPost('/performance/task/submit', {
      projectID: Number(this.props.projectId),
      envID: selectedEnvID,
      buildType: buildType,
      branchName: selectedBranchName,
      sceneIds: chooseSceneID.join(','),
      phoneKeys: selectedModalItems.join(','),
    }).then(res => {
      if (res.code === 0) {
        Modal.success({ content: `构建成功` })
        buildType === '1' ?
          this.props.history.replace('/performanceConfig/branch') :
          this.props.history.replace('/performanceConfig/timer')

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
   * @desc 获取环境列表
   */
  getEnvList = () => {
    reqGet('/performance/env/list', {
      projectID: this.props.projectId,
    }).then(res => {
      this.setState({ envList: res.data })
    })
  }

  /**
   * @desc 切换环境
   * @param e
   */
  changeEnv = (e) => {
    console.log('radio checked', e.target.value)
    this.setState({
      selectedEnvID: e.target.value,
    })
  }

  /**
   * @desc 获取分支列表
   */
  getBranchList = () => {
    reqGet('/performance/branch/list', {
      projectID: this.props.projectId
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
   * @param value
   */
  changeBranch = (value) => {
    this.setState({
      selectedBranchName: value
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
        })
      }
    })
  }

  /**
   * @desc 修改新建定时时间
   * @param moment
   */
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
      this.setState({ modalList: res.data }, () => {
        const modalChildren = this.state.modalList.map((item) => {
          return <Option value={item.code} key={item.code}
                         title={item.text}>{item.text}</Option>
        })
        this.setState({ modalChildren: modalChildren })
      })
    })
  }

  /**
   * @desc 机型变化
   */
  changeModal = (selectedModalItems) => {
    this.setState({ selectedModalItems })
  }

  /**
   * @desc 改变场景
   * @param a
   */
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
    this.getEnvList()
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
      platform,

      envList,
      selectedEnvID,
      branchList,
      selectedBranchName,
      modalList,
      selectedModalItems,
      addVisible,
    } = this.state

    const filteredOptions = modalList.filter((o) => {
      console.log(o)
      console.log(selectedModalItems)
      console.log(!selectedModalItems.includes(o.code))
      if (selectedModalItems.includes('-1')) {
        return false
      } else {
        return !selectedModalItems.includes(o.code)
      }

    })

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    const BranchStep = <React.Fragment>
      <Form.Item
        label="编译环境"
        {...formItemLayout}
      >
        <Radio.Group value={selectedEnvID} onChange={this.changeEnv}>
          {envList.map((item) => {
            return <Radio value={item.code}>{item.text}</Radio>
          })
          }

        </Radio.Group>
      </Form.Item>
      {platform === 2 &&
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
      }
      <Form.Item
        label="测试机型"
        {...formItemLayout}
      >
        <Select placeholder="测试机型"
                mode="multiple"
                style={{ width: 300 }}
                showSearc
                onChange={this.changeModal}
        >
          {filteredOptions.map(item => (
            <Select.Option value={item.code} key={item.code}>
              {item.text}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="开发分支"
        {...formItemLayout}
      >
        <Select placeholder="开发分支"
                style={{ width: 300 }}
                showSearch
                value={selectedBranchName}
                onSearch={this.getBranchList}
                onChange={this.changeBranch}>
          {
            branchList.map((item) => {
              return <Option value={item.code} key={item.code}
                             title={item.text}>{item.text}</Option>
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
        <span className="ant-form-text">{this.state.selectedBranchName}</span>
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
                && <Button type="primary" onClick={() => this.next()}>下一步</Button>
              }
              {
                current === TestSteps.length - 1
                && <Button type="primary" onClick={this.addItem}>开始构建</Button>
              }
              {
                current > 0
                && (
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    上一步
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
    platform: state.project.platform,
    testBuildType: state.project.testBuildType
  }
})(PerformanceAdd)

export default PerformanceAdd
