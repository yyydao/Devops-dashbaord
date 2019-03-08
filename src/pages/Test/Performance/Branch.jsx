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

class PerformanceBranchTest extends Component {
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
      statusList: ['全部','成功', '等待构建', '正在构建', '构建失败', '取消构建'],
      status: '全部',
      // 机型列表
      modalList: ['全部'],
      modal: '全部'
    }
  }

  /**
   * @desc 获取表格数据
   */
  getTableData = () => {
    this.setState({ loading: true })

  }

  /**
   * @desc  新建测试
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
    reqGet('package/envselect', { projectID: projectId }).then(res => {
      if (res.code === 0) {
        let id = ''
        //钉钉进入该页面时，会带来一个envID，否则默认为测试环境
        if (this.state.envID) {
          id = this.state.envID
        } else {
          res.data.map(item => {
            if (item.name === '测试环境') {id = item.id}
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
    reqGet('package/versionselect', {
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
        }, () => this.getPackageList())
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取提测列表
   */
  getPackageList = () => {
    const { projectId, envID, status, versionID, curPage } = this.state
    this.setState({ currentBuild: '' })//隐藏详情

    reqGet('package/packagelist', {
      projectID: projectId, envID, status, versionID, page: curPage, limit: 6
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          totalCount: res.data.totalCount,
          dataList: res.data.list,
        }, () => {
          if (this.state.tapdList.length < 1) {
            this.getTapdList()
          }
          if (this.state.buildId) {
            this.onListItemClick(this.state.buildId)
          }
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  //获取主列表数据
  getList = (type, loadMore = 0) => {
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
    window.localStorage.setItem('detailBreadcrumbPath', JSON.stringify([{
      path: '/performanceConfig',
      name: '性能测试管理'
    }]))

    this.getEnvList()
    this.getBranchList()
    this.getVersionList()
  }

  componentDidMount () {
    this.getList('successList')
    this.getList('failureList')
    this.getList('buildingList')
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
          <BreadcrumbItem>分支测试</BreadcrumbItem>
        </Breadcrumb>

        <div className="devops-main-wrapper">
          <Row>
            <Col>
              <span style={{ paddingRight: 0 }}>环境：</span>
              <Select value={envID}
                      style={{ width: 150, marginRight: 32 }}
                      onChange={(e) => {this.filterChange(e, 'envID')}}>
                {envList.length > 0 && envList.map((item, index) => {
                  return <Option value={item.id} key={index}>{item.name}</Option>
                })}
              </Select>
              <span style={{ paddingRight: 0, paddingLeft: 40 }}>版本：</span>
              <Select value={versionID}
                      style={{ width: 150, marginRight: 40 }}
                      onChange={(e) => {this.filterChange(e, 'version')}}>
                {versionList.length > 0 && versionList.map((item, index) => {
                  return <Option value={item.buildVersion} key={index}>{item.appVersion}</Option>
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
                    return <Option value={item.name} key={item.id}
                                   title={item.name}>{item.name}</Option>
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
                    return <Option value={item.name} key={item.id}
                                   title={item.name}>{item.name}</Option>
                  })
                }
              </Select>
              <span style={{ paddingRight: 0, paddingLeft: 32 }}>机型：</span>
              <Select placeholder="机型"
                      style={{ width: 120 }}
                      showSearch
                      value={modal}
                      onSearch={this.getModal}
                      onChange={this.changeModal}>
                {
                  modalList.map((item) => {
                    return <Option value={item.name} key={item.id}
                                   title={item.name}>{item.name}</Option>
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
        </div>
      </div>
    )
  }
}

PerformanceBranchTest = connect((state) => {
  return {
    token: state.token,
    projectId: state.project.projectId
  }
})(PerformanceBranchTest)

export default PerformanceBranchTest
