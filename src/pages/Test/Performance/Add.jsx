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
  Pagination,
  Popconfirm,
  Modal,
  Form,  Radio,
} from 'antd'


import CustomTree from '@/components/CustomTree'

const BreadcrumbItem = Breadcrumb.Item
const Option = Select.Option
const Step = Steps.Step;

class PerformanceAdd extends Component {
  constructor (props) {
    super(props)

    this.state = {
      current: 0,

      addVisible: false,
      addConfirmLoading: false,
      branchList: [],
      sceneDataList: [],

      //场景选择-变化选择框
      changeParentSceneItem: [],
      //场景选择-全体一级Option
      parentsSceneList: [],
      //场景选择-当前二级Option
      currentChildrenSceneList: [],
      // 场景选择-全选Indeterminate状态
      checkAllSceneIndeterminate: false,
      // 全选
      sceneCheckAll: false,
      // 场景选择-当前一级id数组
      currentParentsScene: [],
      //  场景选择-当前二级id数组
      currentChildScene: [],
      // 所有选中子ID
      chooseSceneID: [],

      formDataBranch: null,
      formDataTime: '',

      taskListVisible: false,
      taskListTotalCount: 1,
      taskListPage: 1,
      taskList: [],

      typeValue: 1,
      typeList: [
        {
          name: '分支测试',
          value: 1
        },
        {
          name: '定时测试',
          value: 2
        },
        {
          name: '提测包测试',
          value: 3
        }
      ],

      timer: null,
      timerStart: null,
      buildingOldSize: 0,
      buildingList: {
        title: '正在构建',
        url: '/task/building/list',
        loading: false,
        page: 1,
        list: []
      },

      successList: {
        title: '构建成功',
        url: '/task/success/list',
        loading: false,
        page: 1,
        list: []
      },

      failureList: {
        title: '构建失败',
        url: '/task/failure/list',
        loading: false,
        page: 1,
        list: []
      }
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


  //获取分支列表
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

  //修改选中分支
  changeBranch = (formDataBranch) => {
    this.setState({
      formDataBranch
    })
  }

  //显示定时任务列表
  showTaskList = () => {
    this.setState({
      taskListVisible: true
    })

    this.getTimerList()
  }

  //隐藏定时任务列表
  hideTaskList = (res) => {
    this.setState({
      taskListVisible: false
    })
  }

  //获取场景列表
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

  //获取定时任务列表
  getTimerList = (page) => {
    console.log(page)
    reqPost('/task/timer/list', {
      projectId: Number(this.props.projectId),
      pageNum: page === undefined ? this.state.taskListPage : page,
      pageSize: 10
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          taskList: res.data,
          taskListTotalCount: res.total,
        })
      }
    })
  }

  //删除定时任务列表项
  deleteTask = (taskId) => {
    reqPost('/task/timer/delete', {
      taskId,
      projectId: this.props.projectId
    }).then(res => {
      if (res.code === 0) {
        this.getTimerList()
      }
    })
  }

  //修改类型
  changeType = (e) => {
    let typeValue = e * 1 + 1
    clearTimeout(this.state.timer)

    this.setState({
      typeValue: typeValue,
      buildingList: {
        ...this.state.buildingList,
        list: []
      },
      successList: {
        ...this.state.successList,
        list: []
      },
      failureList: {
        ...this.state.failureList,
        list: []
      },
      timer: null
    }, () => {
      this.getList('buildingList')
      this.getList('successList')
      this.getList('failureList')
    })
  }

  //获取主列表数据
  getList = (type, loadMore = 0) => {
    if (this.state[type].loading) {
      return
    }

    if (this.state.timer) {
      clearTimeout(this.state.timer)
      this.setState({
        timer: null
      })
    }

    const tabType = this.state.typeValue
    const newState = {}
    newState[type] = {
      ...this.state[type],
      loading: true
    }
    this.setState(newState)

    reqPost(this.state[type].url, {
      projectId: Number(this.props.projectId),
      type: this.state.typeValue,
      page: loadMore === 0 ? 1 : this.state[type].page + 1,
      count: type === 'buildingList' ? 20 : 3
    }).then(res => {
      if (res.code === 0) {
        const newState = {},
          dataSize = res.data.length,
          nextPage = dataSize > 0 ? this.state[type].page + 1 : this.state[type].page

        newState[type] = {
          ...this.state[type],
          list: loadMore === 0 ? res.data : this.state[type].list.concat(res.data),
          page: loadMore === 0 ? 1 : nextPage
        }

        if (type === 'buildingList') {
          if (this.state.buildingOldSize !== dataSize) {
            newState.buildingOldSize = dataSize

            if (this.state.buildingOldSize > dataSize) {
              this.getList('successList')
              this.getList('failureList')
            }
          }

          if (dataSize > 0 && tabType === this.state.typeValue && new Date().getTime() - this.state.timerStart < 3600000) {
            newState.timer = setTimeout(this.getList.bind(this, 'buildingList'), 10e3)
          }
        }

        this.setState(newState)
      }
    }).finally(() => {
      const newState = {}
      newState[type] = {
        ...this.state[type],
        loading: false
      }
      this.setState(newState)
    })
  }

  //取消正在构建任务
  cancelTask = (buildId) => {
    reqPost('/task/cancel', {
      buildId: buildId,
      type: this.state.typeValue
    }).then(res => {
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

  //转到包详情页
  toDetail = (buildId) => {
    reqPost('/task/getBuildId', {
      buildId
    }).then((res) => {
      if (res.code === 0) {
        this.props.history.push(`/package/detail/${res.data.id}`)
      }
    })
  }
  onSceneChange = (a) => {
    this.setState({ chooseSceneID: a })
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  componentWillMount () {
    window.localStorage.setItem('detailBreadcrumbPath', JSON.stringify([{
      path: '/performanceConfig',
      name: '性能测试管理'
    }]))
    this.getBranchList()
    this.getSceneList()
  }

  componentDidMount () {
    this.getList('successList')
    this.getList('failureList')
    this.getList('buildingList')
    this.setState({
      timerStart: new Date().getTime()
    })
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  render () {
    const {
      current,
      branchList,
      addVisible,
      addConfirmLoading,
      typeValue,
      taskListVisible,
      taskList,
      taskListTotalCount,
      typeList, buildingList, successList, failureList, formDataBranch
    } = this.state



    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const FirstStep = <React.Fragment>
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
          <span className="ant-form-text">China</span>
        </Form.Item>
        <Form.Item
          label="测试机型"
          {...formItemLayout}
        >
          <Select placeholder="测试机型"
                  style={{ width: 300 }}
                  showSearch
                  value={formDataBranch}>
            {
              branchList.map((item) => {
                return <Option value={item.name} key={item.id}
                               title={item.name}>{item.name}</Option>
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

    const SecondStep = <React.Fragment>
        <Form.Item
          label="源码分支"
          {...formItemLayout}
        >
          <span className="ant-form-text">China</span>
        </Form.Item>
        <Form.Item
          label="测试场景"
          {...formItemLayout}
        >
          <CustomTree data={this.state.sceneDataList} onSceneChange={this.onSceneChange}/>
        </Form.Item>
    </React.Fragment>

    const BranchSteps = [{
      title: 'First',
      content: FirstStep,
    }, {
      title: 'Second',
      content: SecondStep,
    }, {
      title: 'Last',
      content: 'Last-content',
    }];



    return (
      <div className="performance">
        <Modal title="新增提测性能测试"
               visible={addVisible}
               centered
               onOk={this.addItem}
               confirmLoading={addConfirmLoading}
               onCancel={this.hideModal}
               maskClosable={false}
               destroyOnClose={true}
               width={720}
        >
          <div className="performance-modal-item">
            <label className="performance-modal-item-label">开发分支：</label>
            <div className="performance-modal-item-content">

            </div>
          </div>

          {
            typeValue === 2 && <div className="performance-modal-item">
              <label className="performance-modal-item-label">定时时间：</label>
              <div className="performance-modal-item-content">
                {
                  addVisible && <TimePicker onChange={this.changeTime}/>
                }
              </div>
            </div>
          }
          <div className="performance-modal-item">

          </div>
        </Modal>

        <Modal
          title="定时任务列表"
          visible={taskListVisible}
          onCancel={this.hideTaskList}
          wrapClassName="performance-task-list"
          width={740}
        >
          <div className="performance-task-list-container">
            {
              taskList.map((item, index) => {
                return <div className="performance-task-list-item" key={item.id}>
                  <img src={require('@/assets/favicon.ico')} alt={'icon'}/>
                  <p className="performance-task-list-item-content">
                    <span>分支:{item.branchName}</span>
                    <span>场景:{item.scene}</span>
                    <span>定时时间:{item.fixTime}</span>
                  </p>
                  <Popconfirm placement="top" title="确定删除该项吗？" onConfirm={() => {
                    this.deleteTask(item.id)
                  }} okText="Yes" cancelText="No">
                    <Button type="danger">删除</Button>
                  </Popconfirm>
                </div>
              })
            }
          </div>
          <div className="performance-task-list-pagination">
            <Pagination pageSize={10} defaultCurrent={1} total={taskListTotalCount}
                        onChange={this.getTimerList}/>
          </div>
        </Modal>


        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/performanceConfig">性能测试管理</Link></BreadcrumbItem>
          {/*@todo：根据状态显示面包屑*/}
          <BreadcrumbItem>分支测试</BreadcrumbItem>
          <BreadcrumbItem>新增测试</BreadcrumbItem>
        </Breadcrumb>

        <div className="devops-main-wrapper">

          <div className="performance-main">
            <Steps current={current}>
              {BranchSteps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content">{BranchSteps[current].content}</div>
            <div className="steps-action">
              {
                current < BranchSteps.length - 1
                && <Button type="primary" onClick={() => this.next()}>Next</Button>
              }
              {
                current === BranchSteps.length - 1
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
    projectId: state.project.projectId
  }
})(PerformanceAdd)

export default PerformanceAdd
