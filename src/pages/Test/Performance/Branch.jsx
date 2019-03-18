import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import { reqGet, reqDelete } from '@/api/api'
import { setTestBuildType } from '@/store/actions/project'
import {truncate} from '@/utils/utils'

import {
  Breadcrumb,
  Button,
  Modal,
  Select,
  Icon,
  Row,
  Col,
  Table,
  message,
  Popover,
  Popconfirm,
} from 'antd'
import { bindActionCreators } from 'redux'

const BreadcrumbItem = Breadcrumb.Item
const Option = Select.Option

class PerformanceBranchTest extends Component {
  constructor (props) {
    super(props)

    this.state = {
      projectId: props.projectId,
      testBuildType: 'branch',
      curPage: 1,

      logModalVisible: false,
      logLoading: false,
      logData: '',

      columns: [
        {
          title: 'ID',
          dataIndex: 'rowNum',
          key: 'rowNum'
        },
        {
          title: '分支',
          dataIndex: 'branchName',
          key: 'branchName',
          width: '20%'
        },
        {
          title: '版本',
          dataIndex: 'appVersion',
          key: 'appVersion',
          width: '5%'
        },
        {
          title: '环境',
          dataIndex: 'envName',
          key: 'envName',
          width: '5%',
        },
        {
          title: '场景',
          dataIndex: 'sceneTexts',
          key: 'sceneTexts',
          width: '20',
          render: (text) => <Popover content={<p style={{ width: 180, marginBottom: 0 }}>{text}</p>}
                                     trigger="hover">
            {truncate(text,10)}<Icon type="exclamation-circle" />
          </Popover>
        },
        {
          title: '创建人',
          dataIndex: 'nickName',
          key: 'nickName',
          width: '5%'
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: '10%'
        },
        {
          title: '状态',
          dataIndex: 'statusText',
          key: 'statusText',
          width: '5%'
        }, {
          title: '机型',
          dataIndex: 'phones',
          key: 'phones',
          width: '10%',
          render: (text, record) => <div>
            {(text && text.length > 1) ? '组合' : text && text[0] && text[0].phoneName}
          </div>
        },
        {
          title: '操作',
          width: '20%',
          dataIndex: 'result',
          render: (text, record) => <div>
            {record &&
            record.phones && record.phones.length === 1 &&
            record.status === 1 &&
            (record.result === 1 ?
              <a href={`${window.location.origin}/performance/task/phone/report?phoneID=${record.phones[0].phoneID}`} target='_blank'>查看报告<span
                style={{ color: '#eee' }}> | </span></a>
              : <a onClick={() => this.showLog(record.phones[0].phoneID)}>查看日志<span
                style={{ color: '#eee' }}> | </span></a>)}
            <Popconfirm title="删除构建任务?" onConfirm={() => this.handleDeleteTask(record.taskID)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
            {record.status === 1 &&
            record.result === 1 &&
            <a href={`${window.location.origin}/performance/task/package/download?taskID=${record.taskID}`}><span
              style={{ color: '#eee' }}> | </span>下载</a>
            }
          </div>
        }
      ],
      listData: [],

      // 分支列表
      branchList: [],
      branchID: '-1',
      //环境列表
      envList: [],
      envID: -1,
      //版本列表
      versionList: [],
      versionID: -1,
      //状态集合
      statusList: [],
      status: -2,
      // 机型列表
      modalList: [],
      modal: '-1'
    }
  }

  /**
   * @desc 获取表格数据
   */
  getTableData = () => {
    this.setState({ loading: true })

  }

  /**
   * @desc  新建测试，跳转到新增页面
   */
  goToAdd = () => {
    this.props.history.push({
      pathname: '/performanceConfig/add',
      state: {
        type: 'branch'
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
          id = res.data && res.data[0] && res.data[0].code
        }
        this.setState({
          envList: res.data,
          envID: id
        }, () => {
          this.getVersionList()
        })
      } else {
        message.error(res.msg)
      }
    })
  }
  /**
   * @desc 修改环境
   */
  changeEnv = (envID) => {
    this.setState({
      envID
    }, () => {
      this.getList()
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
        let id = ''
        //钉钉进入该页面时，会带来一个envID，否则默认为全部
        if (this.state.branchID) {
          id = this.state.branchID
        } else {
          id = res.data && res.data[0] && res.data[0].code
        }

        this.setState({
          branchList: res.data,
          branchID: id,
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
    }, () => {
      this.getList()
    })
  }

  /**
   * @desc 获取版本列表
   */
  getVersionList = () => {
    const { projectId, envID } = this.state
    reqGet('/performance/task/package/versions', {
      projectID: projectId,
      envID: envID
    }).then(res => {
      if (res.code === 0) {
        let id = ''
        if (this.state.versionID) {
          id = this.state.versionID
        } else {
          id = res.data && res.data[0] && res.data[0].code
        }
        this.setState({
          versionList: res.data,
          versionID: id
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 修改版本
   * @param versionID
   */
  changeVersion = (versionID) => {
    this.setState({
      versionID
    }, () => {
      this.getList()
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
        let id = ''
        if (this.state.status) {
          id = this.state.status
        } else {
          id = res.data && res.data[0] && res.data[0].code
        }
        this.setState({
          statusList: res.data,
          status: id,
        })
      }
    })
  }

  /**
   * @desc 切换状态
   * @param status
   */
  changeStatus = (status) => {
    this.setState({
      status
    }, () => {
      this.getList()
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
        let id = ''
        if (this.state.modal) {
          id = this.state.modal
        } else {
          id = res.data && res.data[0] && res.data[0].code
        }
        this.setState({
          modalList: res.data,
          modal: id
        })
      }
    })
  }

  /**
   * @desc 切换机型
   * @param modal
   */
  changeModal = (modal) => {
    this.setState({
      modal
    }, () => {
      this.getList()
    })
  }

  /**
   * @desc 获取列表
   */
  getList = () => {
    const { projectId, envID, status, versionID, branchID, modal, curPage } = this.state
    reqGet('/performance/task/list', {
      'projectID': projectId,
      'envID': envID,
      'versionLong': versionID,
      'branchName': branchID,
      'status': status,
      'phoneKey': modal,
      'buildType': 1,
      'page': curPage,
      'limit': 10
    }).then(res => {
      if (res.code === 0) {
        if (res.data && res.data !== null) {
          this.setState({ listData: res.data })
        } else {
          this.setState({ listData: null })
        }

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
   * @desc 删除构建任务
   */
  handleDeleteTask = (taskID) => {
    const self = this
    reqDelete(`/performance/task/delete/${taskID}`).then(res => {
      if (res.code === 0) {
        Modal.success({
          title: '成功',
          content: (
            <p>{`删除成功`}</p>
          ),
          onOk () {
            return self.getList()
          }
        })
      }
    })
  }

  /**
   * @desc 下载
   * @param taskID
   */
  handleDownload = (taskID) => {
    reqGet(`/performance/task/package/download`, { taskID: taskID })
  }

  showReport = (phoneID) => {
    this.setState({ logModalVisible: true, logLoading: true, logData: '', logType: 0 }, () => {
      reqGet('/performance/task/phone/report', { phoneID }).then((res) => {
        if (res.code === 0) {
          this.setState({ logData: res.data, logLoading: false })
        } else {
          this.setState({ logLoading: false })
          message.error(res.msg)
        }
      })
    })
  }

  showLog = (phoneID) => {

    this.setState({ logModalVisible: true, logLoading: true, logData: '', logType: 1 }, () => {
      reqGet('/performance/task/phone/logs', { phoneID }).then((res) => {
        if (res.code === 0) {
          this.setState({ logData: res.data, logLoading: false })
        } else {
          this.setState({ logLoading: false })
          message.error(res.msg)
        }
      })
    })
  }

  componentWillMount () {
    this.props.setTestBuildType('branch')
    window.localStorage.setItem('testBuildType', 'branch')
    this.getEnvList()
    this.getBranchList()
    this.getStatusList()
    this.getModalList()
    this.getList()
  }

  componentDidMount () {
  }

  componentWillUnmount () {
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
      modal,

      logModalVisible,
      logLoading,
      logData,
      logType,
    } = this.state

    const expandedRowRender = (record) => {
      const expandedColumns = [
        {
          title: 'buildNum',
          dataIndex: 'buildNum',
          key: 'buildNum'
        }, {
          title: '机型',
          dataIndex: 'phoneName',
          key: 'phoneName',
        },
        {
          title: '操作',
          key: 'edit',
          render: (text, record) => <div>
            {record &&
            record.status === 1 &&
            (record.result === 1 ?
              <a href={`${window.location.origin}/performance/task/phone/report?phoneID=${record.phoneID}`} target='_blank'>查看报告</a>
              : <a onClick={() => this.showLog(record.phoneID)}>查看日志</a>)}
          </div>
        }
      ]
      return (
        <Table
          columns={expandedColumns}
          dataSource={record.phones}
          pagination={false}
          showHeader={false}
          indentSize={0}
          rowClassName="rowClass"
          rowKey={record => record.buildNum}
        />
      )
    }
    return (
      <div className="performance">
        <Modal
          title={logType === 1 ? '查看日志' : '查看报告'}
          className="logModal"
          width="80%"
          visible={logModalVisible}
          onCancel={() => {this.setState({ logModalVisible: false, logLoading: false })}}
          confirmLoading={logLoading}>
          <div dangerouslySetInnerHTML={{ __html: logData }} style={{ maxHeight: 600, overflowY: 'scroll' }}/>
        </Modal>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/performanceConfig">性能测试管理</Link></BreadcrumbItem>
          <BreadcrumbItem>分支测试</BreadcrumbItem>
        </Breadcrumb>
        <div className={'devops-main-controlArea'}>
          <Row>
            <Col>
              <span>环境：</span>
              <Select value={envID}
                      style={{ width: 100, marginRight: 40 }}
                      onChange={this.changeEnv}>
                {envList.length > 0 && envList.map((item, index) => {
                  return <Option value={item.code} key={index}>{item.text}</Option>
                })}
              </Select>
              <span>版本：</span>
              <Select value={versionID}
                      style={{ width: 100 }}
                      onChange={this.changeVersion}>
                {versionList.length > 0 && versionList.map((item, index) => {
                  return <Option value={item.code} key={index}>{item.text}</Option>
                })}
              </Select>
              <span style={{ paddingRight: 0, paddingLeft: 40 }}>开发分支：</span>
              <Select placeholder="开发分支"
                      style={{ width: 100 }}
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
              <span style={{ paddingRight: 0, paddingLeft: 40 }}>状态：</span>
              <Select placeholder="状态"
                      style={{ width: 100 }}
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
              <span style={{ paddingRight: 0, paddingLeft: 40 }}>机型：</span>
              <Select placeholder="机型"
                      style={{ width: 100 }}
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

            </Col>
          </Row>
        </div>


        <div className="devops-main-wrapper">
          <main className='performance-list-main'>
            <div role="tablist" className="ant-tabs-bar ant-tabs-top-bar">
              <div className="ant-tabs-extra-content" style={{ float: 'right', paddingRight: '35px' }}>
                <Button type="primary" onClick={this.goToAdd}>新增测试</Button>
              </div>
              <div className="ant-tabs-nav-container">
                <div className="ant-tabs-nav-wrap">
                  <div className="ant-tabs-nav-scroll">
                    <div className="ant-tabs-nav">
                      <div>
                        <div className="ant-tabs-tab" style={{ 'fontWeight': '500' }}>分支测试
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              expandedRowRender={expandedRowRender}
              rowKey={record => record.rowNum}
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

function mapStateToProps (state) {
  const { project } = state
  if (project.projectId) {
    return {
      projectId: project.projectId,
      testBuildType: project.testBuildType
    }
  }

  return {
    projectId: null,
    testBuildType: null
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setTestBuildType: bindActionCreators(setTestBuildType, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceBranchTest)
