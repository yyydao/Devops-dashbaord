import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Breadcrumb, Table, message, Modal, Checkbox, Button, Row, Col, Form, Input, Radio, Tag} from 'antd'

import {reqGet, reqPost} from '@/api/api'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item
const FormItem = Form.Item;
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;

class UserManager extends Component {
  constructor() {
    super()
    this.state = {
      userList: [],
      newUser: {},
      loading: false,
      confirmLoading: false,
      modalVisible: false,
      params: {
        limit: 10,
        page: 1,
        nickName: ''
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'userId',
          key: 'userId',
          width: "10%",
          align: "center"
        },
        {
          title: '昵称',
          dataIndex: 'nickName',
          key: 'nickName',
          width: "15%"
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: "22%",
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          width: "15%"
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: "8%",
          render: (text) => {
            switch (text) {
              case 1:
                return <Tag color="green">正常</Tag>
              case 0:
                return <Tag color="red">禁用</Tag>
              default:
                return <Tag color="gray">未知</Tag>
            }
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: "20%",
        },
        {
          title: '操作',
          width: "10%",
          render: (text, record) => {
            return <div><a onClick={() => {
              this.updateUser(record.userId)
            }}>修改</a><span style={{color: "#eee"}}> | </span><a onClick={() => {
              this.deleteUser([record.userId])
            }}>删除</a></div>
          }
        }
      ],
      modalTitle: '新增',
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: null
      },
      selectedRowKeys: [],
      plainOptions: [
        {label: '超级管理员', value: 1},
        {label: '项目管理员', value: 2},
        {label: 'developer', value: 3},
        {label: '测试人员', value: 4}
      ]
    }
  }

  componentWillMount() {
    this.getUserList()
    this.getRoleList()
  }

  /**
   * @desc 获取用户列表
   */
  getUserList = () => {
    this.setState({loading: true});
    reqGet('/sys/user/list', this.state.params).then(res => {
      if (res.code === 0) {
        const pagination = {...this.state.pagination};
        const params = {...this.state.params};
        pagination.total = res.page.totalCount;
        pagination.current = res.page.currPage;
        pagination.showTotal = () => {
          return '共 ' + res.page.totalCount + ' 条';
        };
        this.setState({
          userList: res.page.list,
          pagination,
          params,
          loading: false,
          selectedRowKeys: []
        })
      } else {
        message.error(res.msg);
      }
    })
  }
  /**
   * @desc 获取角色列表
   */
  getRoleList = () => {
    this.setState({loading: true});
    reqGet('/sys/role/select').then(res => {
      if (res.code === 0) {
        this.setState({
          plainOptions: res.list,
        })
      } else {
        message.error(res.msg);
      }
    })
  }
  /**
   * @desc 表格选择栏改变事件
   */
  onSelectedRowKeys = (selectedRowKeys) => {
    this.setState({selectedRowKeys})
  }

  /**
   * @desc 关闭弹窗
   */
  onCloseModal = () => {
    this.setState({modalVisible: false, confirmLoading: false})
  }
  /**
   * @desc 修改用户
   */
  updateUser = (userId) => {
    this.setState({
      confirmLoading: true,
      modalVisible: true,
      modalTitle: '修改'
    }, () => {
      reqGet(`/sys/user/info/${userId}`).then(res => {
        if (res.code === 0) {
          this.setState({newUser: res.user, confirmLoading: false})
          this.props.form.setFieldsValue({
            username: res.user.username,
            nickName: res.user.nickName,
            email: res.user.email,
            mobile: res.user.mobile,
            roleIdList: res.user.roleIdList,
            status: res.user.status
          })
        } else {
          message.error(res.msg);
        }
      })
    })
  }
  /**
   * @desc 删除用户
   */
  deleteUser = (userIds) => {
    if (userIds.length === 0) {
      message.warning("请选择删除的用户")
      return
    }
    confirm({
      title: '',
      content: '该配置中可能存在重要数据，是否继续删除？（请谨慎操作！）',
      onOk: () => {
        reqPost(`/sys/user/delete`, userIds).then(res => {
          if (res.code === 0) {
            message.success("删除成功")
            this.getUserList()
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }
  /**
   * @desc 表格页数改变事件
   */
  handleTableChange = (pagination, nickName) => {
    const params = {...this.state.params};
    if (pagination) {
      params.page = pagination.current;
    } else {
      params.page = 1;
      params.nickName = nickName;
    }
    this.setState({params: params}, this.getUserList);
  }
  /**
   * @desc 新增用户
   */
  onAddUser = () => {
    this.setState({modalVisible: true, newUser: {}, modalTitle: '新增'}, () => {
      this.props.form.setFieldsValue({
        username: '',
        password: '',
        psw: '',
        nickName: '',
        email: '',
        mobile: '',
        projectCode: '',
        roleIdList: [],
        status: 1
      })
    })
  }

  /**
   * @desc 确认密码是否正确
   */
  pswConfirm = (rule, value, callback) => {
    if (value === this.props.form.getFieldValue("password") || !value) {
      callback();
      return;
    }
    callback("请确认密码是否正确");
  }

  passwordConfirm = (rule, value, callback) => {
    let psw = this.props.form.getFieldValue("psw")
    if (psw) {
      this.props.form.validateFields(['psw'], {force: true})
    }
    callback();
    return;
  }
  /**
   * @desc 新增用户/修改用户
   */
  onCreateUser = () => {
    let successMsg = "新增成功"
    let fields = this.state.modalTitle === '新增' ? ['username', 'psw', 'password', 'mobile', 'nickName', 'projectCode', 'email', 'roleIdList', 'status'] : ['username', 'psw', 'password', 'mobile', 'nickName', 'email', 'roleIdList', 'status']
    this.props.form.validateFields(fields, (err, values) => {
      if (values.password && !values.psw) {
        message.error("请填写确认密码")
        return
      }
      if (!err) {
        let user = this.state.newUser, postUrl = '/sys/user/save'
        if (user.userId) {
          postUrl = '/sys/user/update'
          successMsg = "修改成功"
          values.userId = user.userId
        }
        reqPost(postUrl, values).then(res => {
          if (res.code === 0) {
            message.success(successMsg)
            this.setState({modalVisible: false}, () => {
              this.getUserList()
            })
          } else {
            message.error(res.msg);
          }
        })
      }
    });
  }

  render() {
    const {columns, userList, loading, newUser, modalVisible, modalTitle, pagination, selectedRowKeys, plainOptions, confirmLoading} = this.state
    const {getFieldDecorator} = this.props.form;
    const fromItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20}
      }
    };
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>用户管理</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <div style={{backgroundColor: "#fff", padding: 16}}>
            <Row>
              <Col span={6}>
                <Search
                  placeholder="昵称"
                  enterButton="查询"
                  onSearch={value => this.handleTableChange('', value)}
                />
              </Col>
              <Col span={18}>
                <Button type="primary" onClick={() => {
                  this.onAddUser()
                }} style={{marginLeft: 16}}>新增</Button>
                <Button type="danger" onClick={() => {
                  this.deleteUser(this.state.selectedRowKeys)
                }} style={{marginLeft: 16}}>批量删除</Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              rowSelection={{
                selectedRowKeys,
                onChange: this.onSelectedRowKeys
              }}
              rowKey={record => record.userId}
              pagination={pagination}
              dataSource={userList}
              indentSize={0}
              loading={loading}
              bordered
              style={{marginTop: 16}}
              onChange={this.handleTableChange}/>
          </div>
        </div>
        <Modal
          title={modalTitle}
          width={700}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onOk={() => {
            this.onCreateUser()
          }}
          onCancel={() => {
            this.onCloseModal()
          }}>
          <Form>
            <FormItem {...fromItemLayout} label="用户名">
              {
                getFieldDecorator('username', {
                  rules: [{
                    required: true, message: '请填写用户名'
                  }],
                  initialValue: newUser.username
                })(
                  <Input/>
                )
              }
            </FormItem>
            {
              modalTitle === '新增' &&
              <FormItem {...fromItemLayout} label="密码">
                {
                  getFieldDecorator('password', {
                    rules: [{
                      validator: this.passwordConfirm
                    }, {
                      required: true, message: '请填写密码'
                    }],
                    initialValue: newUser.password
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
            }
            {
              modalTitle === '修改' &&
              <FormItem {...fromItemLayout} label="密码">
                {
                  getFieldDecorator('password', {
                    rules: [{
                      validator: this.passwordConfirm
                    }]
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
            }
            {
              modalTitle === '新增' &&
              <FormItem {...fromItemLayout} label="确认密码">
                {
                  getFieldDecorator('psw', {
                    rules: [{
                      validator: this.pswConfirm
                    }, {
                      required: true, message: '请填写确认密码'
                    }],
                    initialValue: newUser.psw
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
            }
            {
              modalTitle === '修改' &&
              <FormItem {...fromItemLayout} label="确认密码">
                {
                  getFieldDecorator('psw', {
                    rules: [{
                      validator: this.pswConfirm
                    }]
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
            }
            <FormItem {...fromItemLayout} label="昵称">
              {
                getFieldDecorator('nickName', {
                  rules: [{
                    required: true, message: '请填写昵称'
                  }],
                  initialValue: newUser.nickName
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="邮箱">
              {
                getFieldDecorator('email', {
                  initialValue: newUser.email
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="手机号码">
              {
                getFieldDecorator('mobile', {
                  rules: [{pattern: '^1[34578]\\d{9}$', message: '请确认手机号码是否正确'}, {
                    required: true, message: '请填写手机号码'
                  }],
                  initialValue: newUser.mobile
                })(
                  <Input/>
                )
              }
            </FormItem>
            {
              modalTitle === '新增' &&
              <FormItem {...fromItemLayout} label="项目编码">
                {
                  getFieldDecorator('projectCode', {initialValue: newUser.projectCode})(
                    <Input/>
                  )
                }
              </FormItem>
            }
            <FormItem {...fromItemLayout} label="角色">
              {
                getFieldDecorator('roleIdList', {initialValue: newUser.roleIdList})(
                  <CheckboxGroup style={{width: '100%'}}>
                    <Row>
                      {
                        plainOptions.map((item, index) =>
                          <Col span={6} style={{marginTop: 8}} key={index}>
                            <Checkbox value={item.roleId}>{item.roleName}</Checkbox>
                          </Col>
                        )
                      }
                    </Row>
                  </CheckboxGroup>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="状态">
              {
                getFieldDecorator('status', {initialValue: newUser.status})(
                  <RadioGroup>
                    <Radio value={0}>禁用</Radio>
                    <Radio value={1}>正常</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const UserManagerForm = Form.create()(UserManager);
export default connect(state => {
  return {
    projectId: state.projectId
  }
}, {})(UserManagerForm)
