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
  Form, Radio, Input,
  Icon,
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
      testType: props.testBuildType,
      current: 0,

      platform: props.platform,

      //测试环境
      envList: [],
      selectedEnvID: '',
      selectedEnvName: '',
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
      //时间
      timeType: '',
      timeText: '',
      buildName: '',
      buildPwd: '',
      buildType: props.testBuildType === 'branch' ? '1' : '2'
    }
  }

  /**
   * @desc 新建构建任务
   */
  addItem = () => {
    const {
      buildType,
      selectedBranchName,
      chooseSceneID,
      selectedEnvID,
      selectedEnvName,
      selectedModalItems,
      timeType,
      timeText,
      buildName,
      buildPwd,
    } = this.state
    if (!selectedBranchName) {
      message.error('请选择“开发分支”')
      return
    } else if (selectedEnvID.lengtht < 1) {
      message.error('请选择“测试环境”')
      return
    } else if (chooseSceneID.length < 1) {
      message.error('请选择“执行场景”')
      return
    } else if (this.state.buildType === '2' && !timeType) {
      message.error('请选择“定时类型”')
      return
    } else if (this.state.buildType === '2' && !timeText) {
      message.error('请选择“定时时间”')
      return
    } else if (this.state.platform === '2' &&(selectedEnvName !== '测试环境' && selectedEnvName.length > 0) && !buildName) {
      message.error('请输入构建账号')
      return
    } else if (this.state.platform === '2' && (selectedEnvName !== '测试环境' && selectedEnvName.length > 0) &&!buildPwd) {
      message.error('请输入构建密码')
      return
    }

    let postData = {
      projectID: Number(this.props.projectId),
      envID: selectedEnvID,
      buildType: buildType,
      branchName: selectedBranchName,
      sceneIds: chooseSceneID.join(','),
      phoneKeys: selectedModalItems.join(','),
    }
    if (buildType === '2') {
      Object.assign(postData, { timeType, timeText })
    }
    if (this.state.platform === '2') {
      Object.assign(postData, { buildName, buildPwd })
    }

    reqPost('/performance/task/submit', postData).then(res => {
      if (res.code === 0) {
        Modal.success({ content: `构建成功` })
        this.next()
      } else {
        Modal.info({
          title: '提示',
          content: (
            <p>{res.msg}</p>
          ),
          onOk () {
          }
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
    const list = this.state.envList
    const v = e.target.value
    const checkedItem = list.filter(item => item.code === v)[0]
    const name = checkedItem['text']
    this.setState({
      selectedEnvID: e.target.value,
      selectedEnvName: name,
    }, () => {
      this.getSceneList()
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
   * @desc 刷新分支
   */
  refreshBranch = () => {
    reqGet('/performance/branch/refresh', {
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
   * @desc 获取场景列表
   */
  getSceneList = () => {
    reqGet('/testScene/performance/records', {
      projectID: this.props.projectId,
      envID: this.state.selectedEnvID
    }).then(res => {
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
      timeText: moment.format('HH:mm:ss')
    })
  }

  /**
   * 选择时间
   * @param e
   */
  onTimerTypeChange = (e) => {
    this.setState({
      timeType: e.target.value,
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
    if (selectedModalItems.includes('-1')) {
      selectedModalItems = ['-1']
    }
    this.setState({ selectedModalItems })
  }

  /**
   * @desc 改变场景
   * @param a
   */
  onSceneChange = (childrenKeys, parentKeys) => {
    this.setState({ chooseSceneID: childrenKeys })
  }

  /**
   * @desc  输入构建账号
   */
  onChangeBuildName = (e) => {
    this.setState({ buildName: e.target.value })
  }

  /**
   * @desc 输入构建密码
   */
  onChangeBuildPwd = (e) => {
    this.setState({ buildPwd: e.target.value })
  }

  next () {
    const {
      selectedEnvID,
      selectedEnvName,
      selectedBranchName,
      selectedModalItems,
      buildName,
      buildPwd,
    } = this.state
    if (this.state.current === 0) {
      if (selectedEnvID.length < 1) {
        message.error('请选择“编译环境”')
        return
      } else if (selectedModalItems.length < 1) {
        message.error('请选择测试机型')
        return
      } else if (selectedBranchName.length < 1) {
        message.error('请选择开发分支')
        return
      } else if (this.state.platform === '2' && (selectedEnvName !== '测试环境' && selectedEnvName.length > 0) && !buildName) {
        message.error('请输入构建账号')
        return
      } else if (this.state.platform === '2' && (selectedEnvName !== '测试环境' && selectedEnvName.length > 0) && !buildPwd) {
        message.error('请输入构建密码')
        return
      }

    }
    const current = this.state.current + 1
    this.setState({ current })
  }

  prev () {
    const current = this.state.current - 1
    this.setState({ current })
  }

  componentWillMount () {
    const buildType = window.localStorage.getItem('testBuildType')
    if (this.props && this.props.testBuildType === null) {
      this.setState({
        testType: buildType,
        buildType: buildType === 'branch' ? '1' : '2'
      })
    }
    this.getEnvList()
    this.getModalList()
    this.getBranchList()
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    window.localStorage.removeItem('testBuildType')
  }

  render () {
    const {
      current,
      platform,

      envList,
      selectedEnvID,
      selectedEnvName,
      branchList,
      selectedBranchName,
      modalList,
      selectedModalItems,
      timeType,
      buildName,
      buildPwd,
    } = this.state

    const filteredOptions = modalList.filter((o) => {
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
        <Radio.Group value={selectedEnvID}
                     onChange={this.changeEnv}>
          {envList.map((item, index) => {
            return <Radio value={item.code} key={index}>{item.text}</Radio>
          })
          }

        </Radio.Group>
      </Form.Item>
      {
        platform === '2' &&
        (selectedEnvName !== '测试环境' && selectedEnvName.length > 0) &&
        <React.Fragment>
          <Form.Item
            label="构建账号"
            {...formItemLayout}
          >
            <Input style={{ width: 450 }}
                   value={buildName}
                   onChange={this.onChangeBuildName}
                   prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>}
                   placeholder="构建账号"/>

          </Form.Item>
          <Form.Item
            label="构建密码"
            {...formItemLayout}
          >
            <Input.Password style={{ width: 450 }}
                            value={buildPwd}
                            onChange={this.onChangeBuildPwd}
                            prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>}
                            placeholder="构建账号密码"/>

          </Form.Item>
        </React.Fragment>
      }
      <Form.Item
        label="测试机型"
        {...formItemLayout}
      >
        <Select placeholder="选择测试机型"
                mode="multiple"
                allowClear={true}
                autoClearSearchValue={true}
                style={{ width: 450 }}
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
                style={{ width: 354 }}
                showSearch
                dropdownMatchSelectWidth={false}
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
        <Button type={'default'} style={{marginLeft:'8px'}} onClick={this.refreshBranch}>拉取分支</Button>
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
        <CustomTree senceList={this.state.sceneDataList} selectedChildren={this.state.chooseSceneID}
                    onSceneChange={this.onSceneChange}/>
      </Form.Item>
    </React.Fragment>

    const TimerStep = <React.Fragment>
      <Form.Item
        label="定时类型：："
        {...formItemLayout}
      >
        <Radio.Group onChange={this.onTimerTypeChange} value={timeType}>
          <Radio value={1}>每天</Radio>
          <Radio value={2}>固定日前</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="定时时间："
        {...formItemLayout}
      >
        <TimePicker onChange={this.changeTime}/>
      </Form.Item>
    </React.Fragment>

    const FinalStep = <React.Fragment>

      <h2>测试任务已经提交</h2>
      <p>您可以点击下方"查看任务"按钮，进入测试列表查看测试进度</p>
    </React.Fragment>

    const BasicStep = [{
      title: '选择测试分支',
      content: BranchStep,
    }, {
      title: '配置测试场景',
      content: SceneStep,
    }, {
      title: '提交测试',
      content: FinalStep,
    }]

    const TimerOptionsStep = { title: '配置定时时间', content: TimerStep }

    let TestSteps = BasicStep

    if (this.state.testType !== 'branch') {
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

          <div className="performance-add-main">
            <Steps current={current}>
              {TestSteps.map(item => <Step key={item.title} title={item.title}/>)}
            </Steps>
            <div className="steps-content">{TestSteps[current].content}</div>
            <div className="steps-action">
              {
                current < TestSteps.length - 1 && current !== TestSteps.length - 2
                && <Button type="primary" onClick={() => this.next()}>下一步</Button>
              }
              {
                current === TestSteps.length - 2
                && <Button type="primary" onClick={this.addItem}>开始构建</Button>
              }
              {
                current === TestSteps.length - 1
                && <Button type="primary" onClick={
                  this.state.testType === 'branch'
                    ? () => this.props.history.replace('/performanceConfig/branch')
                    : () => this.props.history.replace('/performanceConfig/timer')}>查看任务</Button>
              }
              {
                current > 0 && current !== TestSteps.length - 1
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
