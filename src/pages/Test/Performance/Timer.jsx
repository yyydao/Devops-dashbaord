import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import { reqGet, reqPost } from '@/api/api'

import {
  Breadcrumb,
  Button,
  Modal,
  Select,
  Row,
  Col,
  Table,
  message
} from 'antd'

const BreadcrumbItem = Breadcrumb.Item
const Option = Select.Option

class PerformanceTimerTest extends Component {
  constructor (props) {
    super(props)

    this.state = {
      projectId: props.projectId,

      columns: [
        {
          title: 'ID',
          width: '8%',
          key: 'demandID'
        },
        {
          title: '分支',
          dataIndex: 'branch',
          key: 'branch',
          width: '30%'
        },
        {
          title: '版本',
          dataIndex: 'version',
          key: 'version',
          width: '8%'
        },
        {
          title: '环境',
          dataIndex: 'env',
          key: 'env',
          width: '10%',
        },
        {
          title: '场景',
          dataIndex: 'scene',
          key: 'scene',
          width: '8%'
        },
        {
          title: '创建人',
          dataIndex: 'creator',
          key: 'creator',
          width: '6%'
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
          width: '10%'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: '10%'
        }, {
          title: '机型',
          dataIndex: 'type',
          key: 'type',
          width: '10%'
        },
        {
          title: '操作',
          width: '10%',
          key: 'edit'
        },
        {
          title: '操作',
          width: '10%',
          render: (text, record) => {
            if (record.id) {
              return <div><a onClick={() => this.showConfirm(record.demandID)}>删除</a><span
                style={{ color: '#eee' }}> | </span><Link
                to={{ pathname: '/package', query: { tapdID: record.id } }}>提测</Link></div>
            }
          }
        }
      ],
      listData: [],

      // 分支列表
      branchList: [],
      branchID: 0,
      //环境列表
      envList: [],
      envID: 0,
      //版本列表
      versionList: [],
      versionID: 0,
      //状态集合
      statusList: [],
      status: '全部',
      // 机型列表
      modalList: ['全部'],
      modal: '全部'
    }
  }

  /**
   * @desc  新建测试，跳转到新增页面
   */
  goToAdd = () => {
    this.props.history.push({
      pathname: '/performanceConfig/add',
      state: {
        type: 'timer'
      }
    })
  }


  // 显示定时任务列表
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

  /**
   * @desc 获取环境列表
   */
  getEnvList = () => {
    const { projectId } = this.state
    reqGet('/performance/env/listall', { projectID: projectId }).then(res => {
      if (res.code === 0) {
        let id = ''
        //钉钉进入该页面时，会带来一个envID，否则默认为全部
        if (this.state.envID) {
          id = this.state.envID
        } else {
          res.data.map(item => {
            if (item.code === -1) {id = item.code}
            return item
          })
        }
        this.setState({
          envList: res.data,
          envID: id
        }, () => {this.getVersionList()})
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取分支列表
   */
  getBranchList = (value = '') => {
    reqGet('/performance/task/branchs', {
      projectID: this.props.projectId,
      buildType: 1
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
   */
  changeBranch = (branchID) => {
    this.setState({
      branchID
    })
  }

  /**
   * @desc 获取版本列表
   */
  getVersionList = () => {
    const { projectId, envID, selectDisabled } = this.state
    reqGet('/performance/package/versionlist', {
      projectID: projectId,
      envID: envID
    }).then(res => {
      if (res.code === 0) {
        let buildVersion = ''
        if (this.state.buildId) {
          buildVersion = this.state.versionID
        } else {
          if (res.data.length > 0 && !selectDisabled) {
            buildVersion = res.data[0].buildVersion
          }
        }
        this.setState({
          versionList: res.data,
          versionID: buildVersion
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取状态列表
   */
  getStatusList = () => {
    reqGet('performance/task/statuslist', {
      projectID: this.props.projectId,
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          statusList: res.data
        })
      }
    })
  }

  /**
   * @desc 切换状态
   * @param status
   */
  changeStatus =(status)=>{
    this.setState({
      status
    })
  }

  /**
   * @desc 获取机型列表
   */
  getModalList = () => {
    reqGet('/performance/task/phones', {
      projectID: this.props.projectId,
      buildType: 1
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          modalList: res.data
        })
      }
    })
  }

  /**
   * @desc 切换机型
   * @param modal
   */
  changeModal = (modal)=>{
    this.setState({
      modal
    })
  }

  /**
   * @desc 获取提测列表
   */
  getPackageList = () => {
    const { projectId, envID, status, versionID, curPage } = this.state
    console.log({
      projectId, envID, status, versionID, curPage
    })
  }

  //获取主列表数据
  getList = () => {
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

  componentWillMount () {
    this.getEnvList()
    this.getBranchList()
  }

  componentDidMount () {
  }

  render () {
    const {
      listData,
      columns,
      pagination,
      loading,

      envID,
      envList,
      versionList,
      versionID,
      branchList,
      branchID,
      statusList,
      status,
      modalList,
      modal
    } = this.state

    const expandedRowRender = (record) => {
      console.log(record)
      const columns = [
        {
          title: 'ID',
          width: '8%',
          key: 'demandID'
        },
        {
          title: '分支',
          dataIndex: 'branch',
          key: 'branch',
          width: '30%'
        },
        {
          title: '版本',
          dataIndex: 'version',
          key: 'version',
          width: '8%'
        },
        {
          title: '环境',
          dataIndex: 'env',
          key: 'env',
          width: '10%',
        },
        {
          title: '场景',
          dataIndex: 'scene',
          key: 'scene',
          width: '8%'
        },
        {
          title: '创建人',
          dataIndex: 'creator',
          key: 'creator',
          width: '6%'
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
          width: '10%'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: '10%'
        }, {
          title: '机型',
          dataIndex: 'type',
          key: 'type',
          width: '10%'
        },
        {
          title: '操作',
          width: '10%',
          key: 'edit'
        }
      ]
      return (
        <Table
          columns={columns}
          dataSource={record.list}
          pagination={false}
          showHeader={false}
          indentSize={0}
          rowClassName="rowClass"
          rowKey={record => record.id}
        />
      )
    }

    return (
      <div className="performance">
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/performanceConfig">性能测试管理</Link></BreadcrumbItem>
          <BreadcrumbItem>定时测试</BreadcrumbItem>
        </Breadcrumb>

        <div className="devops-main-wrapper">
          <main className='performance-list-main'>
          <Row>
            <Col>
              <span style={{ paddingRight: 0 }}>环境：</span>
              <Select value={envID}
                      style={{ width: 150, marginRight: 32 }}
                      onChange={(e) => {this.filterChange(e, 'envID')}}>
                {envList.length > 0 && envList.map((item, index) => {
                  return <Option value={item.code} key={index}>{item.text}</Option>
                })}
              </Select>
              <span style={{ paddingRight: 0 }}>版本：</span>
              <Select value={versionID}
                      style={{ width: 150 }}
                      onChange={(e) => {this.filterChange(e, 'version')}}>
                {versionList.length > 0 && versionList.map((item, index) => {
                  return <Option value={item.code} key={index}>{item.text}</Option>
                })}
              </Select>
              <span style={{ paddingRight: 0, paddingLeft: 32 }}>开发分支：</span>
              <Select placeholder="开发分支"
                      style={{ width: 120 }}
                      showSearch
                      value={branchID}
                      onSearch={this.getBranchList}
                      onChange={this.changeBranch}>
                {
                  branchList.map((item) => {
                    return <Option value={item.code} key={item.code}
                    >{item.text}</Option>
                  })
                }
              </Select>
              <span style={{ paddingRight: 0, paddingLeft: 32 }}>状态：</span>
              <Select placeholder="状态"
                      style={{ width: 120 }}
                      showSearch
                      value={status}
                      onSearch={this.getStatusList}
                      onChange={this.changeStatus}>
                {
                  statusList.map((item) => {
                    return <Option value={item.code} key={item.code}>{item.text}</Option>
                  })
                }
              </Select>
              <span style={{ paddingRight: 0, paddingLeft: 32 }}>机型：</span>
              <Select placeholder="机型"
                      style={{ width: 120 }}
                      showSearch
                      value={modal}
                      onSearch={this.getModalList}
                      onChange={this.changeModal}>
                {
                  modalList.map((item) => {
                    return <Option value={item.code} key={item.code}>{item.text}</Option>
                  })
                }
              </Select>
              <Button type="primary" onClick={this.goToAdd}>新增测试</Button>
            </Col>
          </Row>

          <Table
            columns={columns}
            rowKey={record => record.id}
            expandedRowRender={expandedRowRender}
            dataSource={listData}
            indentSize={0}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}/>
          </main>
        </div>
      </div>
    )
  }
}

PerformanceTimerTest = connect((state) => {
  return {
    token: state.token,
    projectId: state.project.projectId
  }
})(PerformanceTimerTest)

export default PerformanceTimerTest
