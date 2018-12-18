import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Breadcrumb, Table, message, Modal, Checkbox, Row, Col, Card } from 'antd'

import { reqPost, checkPermission } from '@/api/api'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item
const confirm = Modal.confirm
const CheckboxGroup = Checkbox.Group

class MemberManager extends Component {
  constructor () {
    super()
    this.columns = [
      {
        title: '账号',
        dataIndex: 'userAccount',
        key: 'userAccount'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '手机号码',
        dataIndex: 'mobilePhone',
        key: 'mobilePhone'
      },
      {
        title: '管理员',
        dataIndex: 'admin',
        key: 'admin',
        render: (text) => {
          return text ? <span>是</span> : <span>否</span>
        }
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (this.state.hasDeleteBtn && <a onClick={() => this.handleDelete(record.userId)}>删除</a>)
        }
      }
    ]
    this.state = {
      modalVisible: false,
      loading: false,
      data: [],
      selectUserList: [],
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      hasAddUserBtn: false,
      hasDeleteBtn: false
    }
  }

  componentWillMount () {
    this.getUserList()
    this.selectUser()
    this.getPermission()
  }

  async getPermission () {
    const hasDeleteBtn = await checkPermission('/project/deleteUserInProject')
    const hasAddUserBtn = await checkPermission('/project/addUser2Project')
    this.setState({
      hasDeleteBtn,
      hasAddUserBtn
    })
  }

  getUserList () {
    const { projectId } = this.props
    this.setState({ loading: true })
    reqPost('/project/listUser', { projectId: projectId }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.setState({
          loading: false,
          data: res.data
        })
      } else {
        this.setState({ loading: false })
        message.error(res.msg)
      }
    })
  }

  handleDelete = (id) => {
    confirm({
      title: '删除提示',
      content: '确认删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        reqPost('/project/deleteUserInProject', {
          projectId: this.props.projectId,
          userId: id
        }).then(res => {
          if (parseInt(res.code, 0) === 0) {
            message.success('删除成功！')
            this.getUserList()
            this.selectUser()
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  }

  selectUser () {
    const { projectId } = this.props
    reqPost('/project/selectUser', { projectId: projectId }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.setState({ selectUserList: res.data })
      } else {
        message.error(res.msg)
      }
    })
  }

  showModal = () => {
    this.setState({ modalVisible: true })
  }

  handleOk = () => {
    reqPost('/project/addUser2Project', {
      projectId: this.props.projectId,
      userIds: this.state.checkedList
    }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        message.success('添加成员成功！')
        this.setState({ modalVisible: false })
        this.getUserList()
        this.selectUser()
      } else {
        this.setState({
          modalVisible: false,
          checkedList: []
        })
        message.error(res.msg)
      }
    })
  }

  handleCancel = () => {
    this.setState({ modalVisible: false })
  }

  onCheckAllChange = (e) => {
    let checkedList = []
    /*eslint-disable array-callback-return*/
    this.state.selectUserList.map(item => {
      checkedList.push(item.userId)
    })

    this.setState({
      checkedList: e.target.checked ? checkedList : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  onChange = (checkedList) => {
    const { selectUserList } = this.state
    this.setState({
      checkedList,
      checkAll: checkedList.length === selectUserList.length,
      indeterminate: !!checkedList.length && (checkedList.length < selectUserList.length)
    })
  }

  render () {
    return (
      <div className="">
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>成员管理</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <Card title="成员管理">
            {
              this.state.hasAddUserBtn && <p className="addMember" onClick={this.showModal}>+ 新增成员</p>
            }
            <Table columns={this.columns} dataSource={this.state.data} rowKey={record => record.userId}
                   pagination={false} loading={this.state.loading}></Table>
          </Card>
        </div>


        { /* 添加用户弹窗 */}
        <Modal title="新增项目成员" visible={this.state.modalVisible} onOk={this.handleOk} onCancel={this.handleCancel}
               okText="确认" cancelText="取消">
          <div className="checkbox-container">
            <Checkbox indeterminate={this.state.indeterminate} checked={this.state.checkAll}
                      onChange={this.onCheckAllChange}>全选</Checkbox>
            <div style={{ marginTop: 24 }}>
              <CheckboxGroup value={this.state.checkedList} onChange={this.onChange}>
                <Row>
                  {
                    this.state.selectUserList.map((item, index) => {
                      return <Col key={index} style={{ marginBottom: 24 }}><Checkbox
                        value={item.userId}>{item.name}</Checkbox></Col>
                    })
                  }
                </Row>
              </CheckboxGroup>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default connect(state => {
  return {
    projectId: state.projectId
  }
}, {})(MemberManager)
