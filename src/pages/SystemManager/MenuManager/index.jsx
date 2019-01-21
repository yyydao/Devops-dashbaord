import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Breadcrumb, Table, message, Modal, Tag, Icon, Button, Form, Input, Radio, Cascader, InputNumber} from 'antd'

import {reqGet} from '@/api/api'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class MenuManager extends Component {
  constructor() {
    super()
    this.state = {
      menuList: [
        {
          "menuId": 35,
          "parentId": 0,
          "name": "仪表盘",
          "url": "dashboard",
          "perms": "",
          "type": 1,
          "icon": "daohang",
          "orderNum": 0
        }, {
          "menuId": 36,
          "parentId": 0,
          "name": "流水线",
          "url": "pipeline",
          "perms": "",
          "type": 1,
          "icon": "mudedi",
          "orderNum": 1
        }, {
          "menuId": 126,
          "parentId": 0,
          "name": "需求",
          "url": "requirement",
          "perms": "",
          "type": 1,
          "icon": "daohang",
          "orderNum": 1
        }, {
          "menuId": 31,
          "parentId": 0,
          "name": "测试",
          "url": "",
          "perms": "",
          "type": 0,
          "icon": "shezhi",
          "orderNum": 2,
          "list": [{
            "menuId": 32,
            "parentId": 31,
            "name": "性能测试管理",
            "url": "performanceConfig",
            "perms": "",
            "type": 1,
            "icon": "mudedi",
            "orderNum": 0
          }, {
            "menuId": 125,
            "parentId": 31,
            "name": "云真机",
            "url": "stfDevices",
            "perms": "",
            "type": 1,
            "icon": "shoucang",
            "orderNum": 1
          }]
        }, {
          "menuId": 33,
          "parentId": 0,
          "name": "安装包",
          "url": "package",
          "perms": "",
          "type": 1,
          "icon": "editor",
          "orderNum": 4
        }, {
          "menuId": 34,
          "parentId": 0,
          "name": "发布",
          "url": "grayscale",
          "perms": "",
          "type": 1,
          "icon": "tubiao",
          "orderNum": 5
        }, {
          "menuId": 44,
          "parentId": 0,
          "name": "项目设置",
          "url": "",
          "perms": "",
          "type": 0,
          "icon": "shezhi",
          "orderNum": 6,
          "list": [{
            "menuId": 45,
            "parentId": 44,
            "name": "项目信息",
            "url": "projectinfo",
            "perms": "",
            "type": 1,
            "icon": "dangdifill",
            "orderNum": 0
          }, {
            "menuId": 46,
            "parentId": 44,
            "name": "成员管理",
            "url": "memberManager",
            "perms": "",
            "type": 1,
            "icon": "oss",
            "orderNum": 1
          }, {
            "menuId": 47,
            "parentId": 44,
            "name": "分支管理",
            "url": "branch",
            "perms": "",
            "type": 1,
            "icon": "menu",
            "orderNum": 2
          }, {
            "menuId": 48,
            "parentId": 44,
            "name": "配置管理",
            "url": "configManager",
            "perms": "",
            "type": 1,
            "icon": "shoucangfill",
            "orderNum": 3
          }, {
            "menuId": 49,
            "parentId": 44,
            "name": "通知管理",
            "url": "noticeManager",
            "perms": "",
            "type": 1,
            "icon": "log",
            "orderNum": 5
          }, {
            "menuId": 50,
            "parentId": 44,
            "name": "第三方配置",
            "url": "thirdparty",
            "perms": "",
            "type": 1,
            "icon": "role",
            "orderNum": 6
          }]
        }, {
          "menuId": 1,
          "parentId": 0,
          "name": "系统管理",
          "url": "",
          "perms": "",
          "type": 0,
          "icon": "system",
          "orderNum": 9,
          "open": false,
          "list": [{
            "menuId": 2,
            "parentId": 1,
            "name": "用户管理",
            "url": "sys/user",
            "perms": "",
            "type": 1,
            "icon": "admin",
            "orderNum": 1,
            "open": false,
            "isTop": false
          }, {
            "menuId": 3,
            "parentId": 1,
            "name": "角色管理",
            "url": "sys/role",
            "perms": "",
            "type": 1,
            "icon": "role",
            "orderNum": 2,
            "open": false,
            "isTop": false
          }, {
            "menuId": 4,
            "parentId": 1,
            "name": "菜单管理",
            "url": "sys/menu",
            "perms": "",
            "type": 1,
            "icon": "menu",
            "orderNum": 3,
            "open": false,
            "isTop": false
          }, {
            "menuId": 91,
            "parentId": 1,
            "name": "白名单",
            "url": "sys/filter",
            "perms": "",
            "type": 1,
            "icon": "zonghe",
            "orderNum": 4
          }],
          "isTop": false
        }],
      AllMenuList: [{
        menuId:0,
        name:"一级菜单",
        list:[ {
          "menuId": 35,
          "parentId": 0,
          "name": "仪表盘",
          "url": "dashboard",
          "perms": "",
          "type": 1,
          "icon": "daohang",
          "orderNum": 0
        }, {
          "menuId": 36,
          "parentId": 0,
          "name": "流水线",
          "url": "pipeline",
          "perms": "",
          "type": 1,
          "icon": "mudedi",
          "orderNum": 1
        }, {
          "menuId": 126,
          "parentId": 0,
          "name": "需求",
          "url": "requirement",
          "perms": "",
          "type": 1,
          "icon": "daohang",
          "orderNum": 1
        }, {
          "menuId": 31,
          "parentId": 0,
          "name": "测试",
          "url": "",
          "perms": "",
          "type": 0,
          "icon": "shezhi",
          "orderNum": 2,
          "list": [{
            "menuId": 32,
            "parentId": 31,
            "name": "性能测试管理",
            "url": "performanceConfig",
            "perms": "",
            "type": 1,
            "icon": "mudedi",
            "orderNum": 0
          }, {
            "menuId": 125,
            "parentId": 31,
            "name": "云真机",
            "url": "stfDevices",
            "perms": "",
            "type": 1,
            "icon": "shoucang",
            "orderNum": 1
          }]
        }, {
          "menuId": 33,
          "parentId": 0,
          "name": "安装包",
          "url": "package",
          "perms": "",
          "type": 1,
          "icon": "editor",
          "orderNum": 4
        }, {
          "menuId": 34,
          "parentId": 0,
          "name": "发布",
          "url": "grayscale",
          "perms": "",
          "type": 1,
          "icon": "tubiao",
          "orderNum": 5
        }, {
          "menuId": 44,
          "parentId": 0,
          "name": "项目设置",
          "url": "",
          "perms": "",
          "type": 0,
          "icon": "shezhi",
          "orderNum": 6,
          "list": [{
            "menuId": 45,
            "parentId": 44,
            "name": "项目信息",
            "url": "projectinfo",
            "perms": "",
            "type": 1,
            "icon": "dangdifill",
            "orderNum": 0
          }, {
            "menuId": 46,
            "parentId": 44,
            "name": "成员管理",
            "url": "memberManager",
            "perms": "",
            "type": 1,
            "icon": "oss",
            "orderNum": 1
          }, {
            "menuId": 47,
            "parentId": 44,
            "name": "分支管理",
            "url": "branch",
            "perms": "",
            "type": 1,
            "icon": "menu",
            "orderNum": 2
          }, {
            "menuId": 48,
            "parentId": 44,
            "name": "配置管理",
            "url": "configManager",
            "perms": "",
            "type": 1,
            "icon": "shoucangfill",
            "orderNum": 3
          }, {
            "menuId": 49,
            "parentId": 44,
            "name": "通知管理",
            "url": "noticeManager",
            "perms": "",
            "type": 1,
            "icon": "log",
            "orderNum": 5
          }, {
            "menuId": 50,
            "parentId": 44,
            "name": "第三方配置",
            "url": "thirdparty",
            "perms": "",
            "type": 1,
            "icon": "role",
            "orderNum": 6
          }]
        }, {
          "menuId": 1,
          "parentId": 0,
          "name": "系统管理",
          "url": "",
          "perms": "",
          "type": 0,
          "icon": "system",
          "orderNum": 9,
          "open": false,
          "list": [{
            "menuId": 2,
            "parentId": 1,
            "name": "用户管理",
            "url": "sys/user",
            "perms": "",
            "type": 1,
            "icon": "admin",
            "orderNum": 1,
            "open": false,
            "isTop": false
          }, {
            "menuId": 3,
            "parentId": 1,
            "name": "角色管理",
            "url": "sys/role",
            "perms": "",
            "type": 1,
            "icon": "role",
            "orderNum": 2,
            "open": false,
            "isTop": false
          }, {
            "menuId": 4,
            "parentId": 1,
            "name": "菜单管理",
            "url": "sys/menu",
            "perms": "",
            "type": 1,
            "icon": "menu",
            "orderNum": 3,
            "open": false,
            "isTop": false
          }, {
            "menuId": 91,
            "parentId": 1,
            "name": "白名单",
            "url": "sys/filter",
            "perms": "",
            "type": 1,
            "icon": "zonghe",
            "orderNum": 4
          }],
          "isTop": false
        }]
      }],
      columns: [
        {
          title: 'ID',
          dataIndex: 'menuId',
          key: 'menuId',
          width: "8%",
          align:"center"
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: "15%"
        },
        {
          title: '上级菜单',
          dataIndex: 'parentId',
          key: 'parentId',
          width: "10%",
          render:()=>""
        },
        {
          title: '图标',
          dataIndex: 'icon',
          key: 'icon',
          width: "10%",
          align:"center",
          render: (text, record) => <Icon type={text}/>
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          width: "10%",
          align:"center",
          render: (text, record) => {
            switch (text){
              case 1: return <Tag color="green">菜单</Tag>
                break;
              case 0: return <Tag color="cyan">目录</Tag>
                break;
            }
          }
        },
        {
          title: '排序号',
          dataIndex: 'orderNum',
          key: 'orderNum',
          width: "8%",
          align:"center"
        },
        {
          title: '菜单URL',
          dataIndex: 'url',
          key: 'url',
          width: "15%",
        },
        {
          title: '授权标志',
          dataIndex: 'perms',
          key: 'perms',
          width: "8%"
        },
        {
          title: '操作',
          width: "10%",
          render: (text, record) => {
            return <div><a>修改</a><span style={{color: "#eee"}}> | </span><Link
              to={{pathname: '/package', query: {tapdID: record.id}}}>删除</Link></div>
          }
        }
      ],
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: null
      },
      loading: false,
      params: {},
      newMenu:{},
      modalVisible:false
    }
  }

  componentWillMount() {
  }

  /**
   * @desc 表格页数改变事件
   */
  handleTableChange = (pagination) => {
    const params = {...this.state.params};
    params.page = pagination.current;
    this.setState({params: params}, this.getTableData);
  }

  /**
   * @desc 获取tapd表格数据
   */
  getTableData = () => {
    this.setState({loading: true});
    reqGet('demand/story/list', this.state.params).then(res => {
      if (res.code === 0) {
        const pagination = {...this.state.pagination};
        const params = {...this.state.params};
        pagination.total = res.data.totalCount;
        pagination.showTotal = () => {
          return '共 ' + res.data.totalCount + ' 条';
        };
        if (this.state.params.page > res.data.totalPage && res.data.totalPage !== 0) {
          params.page = res.data.totalPage
          this.setState({params}, () => {
            this.getTableData()
          })
        } else {
          this.setState({
            loading: false,
            listData: res.data.list,
            pagination,
            params
          });
        }
      } else {
        this.setState({loading: false});
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 关闭弹窗
   */
  onCloseModal = () =>{
    this.setState({modalVisible:false})
  }

  /**
   * @desc 新增菜单
   */
  onCreateMenu = () =>{
    this.props.form.validateFields(['name','type'],(err, values) => {
      if (!err) {
        console.log(err)
      }else{
        console.log(values)
      }
    });
  }

  render() {
    const {columns, menuList, pagination, loading, newMenu, modalVisible, AllMenuList} = this.state
    const { getFieldDecorator } = this.props.form;
    const expandedRowRender = (record1) => {
      const columns = [
        {
          title: 'ID',
          dataIndex: 'menuId',
          key: 'menuId',
          width: "8%",
          align:"center"
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: "15%"
        },
        {
          title: '上级菜单',
          dataIndex: 'parentId',
          key: 'parentId',
          width: "10%",
          render: (text, record) => record1.name
        },
        {
          title: '图标',
          dataIndex: 'icon',
          key: 'icon',
          width: "10%",
          align:"center",
          render: (text, record) => <Icon type={text}/>
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          width: "10%",
          align:"center",
          render: (text, record) => {
            switch (text){
              case 1: return <Tag color="green">菜单</Tag>
                break;
              case 0: return <Tag color="cyan">目录</Tag>
                break;
            }
          }
        },
        {
          title: '排序号',
          dataIndex: 'orderNum',
          key: 'orderNum',
          width: "8%",
          align:"center"
        },
        {
          title: '菜单URL',
          dataIndex: 'url',
          key: 'url',
          width: "15%",
        },
        {
          title: '授权标志',
          dataIndex: 'perms',
          key: 'perms',
          width: "8%"
        },
        {
          title: '操作',
          width: "10%",
          render: (text, record) => {
            return <div><a>修改</a><span style={{color: "#eee"}}> | </span><Link
              to={{pathname: '/package', query: {tapdID: record.id}}}>删除</Link></div>
          }
        }
      ]
      if(record1.list){
        return (
          <Table
            columns={columns}
            dataSource={record1.list}
            pagination={false}
            showHeader={false}
            indentSize={0}
            rowClassName="rowClass"
            rowKey={record => record.menuId}
          />
        );
      }else{
        return false
      }
    };
    const fromItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>菜单管理</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <div style={{backgroundColor: "#fff", padding: 16}}>
            <Button type="primary" onClick={()=>{this.setState({modalVisible:true})}}>新增菜单</Button>
            <Table
              columns={columns}
              rowKey={record => record.menuId}
              // expandedRowRender={expandedRowRender}
              childrenColumnName="list"
              dataSource={menuList}
              indentSize={0}
              pagination={pagination}
              loading={loading}
              bordered
              style={{marginTop: 16}}
              onChange={this.handleTableChange}/>
          </div>
        </div>
        <Modal
          title="新增"
          visible={modalVisible}
          onOk={()=>{this.onCreateMenu()}}
          onCancel={()=>{this.onCloseModal()}}>
          <Form>
            <FormItem {...fromItemLayout} label="类型">
              {
                getFieldDecorator('type',{
                  rules: [{
                    required: true, message: '请选择类型'
                  }],
                  initialValue:newMenu.type
                })(
                  <RadioGroup>
                    <Radio value={1}>目录</Radio>
                    <Radio value={2}>菜单</Radio>
                    <Radio value={3}>按钮</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="菜单名称">
              {
                getFieldDecorator('name',{
                  rules: [{
                    required: true, message: '请填写菜单名称'
                  }],
                  initialValue:newMenu.name
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="上级菜单">
              {
                getFieldDecorator('parentmMenu',{
                  rules: [{
                    type: 'array', required: true, message: '请选择上级菜单'
                  }],
                  initialValue:newMenu.parentmMenu
                })(
                  <Cascader options={AllMenuList} fieldNames={{value:"menuId",label:"name",children:"list"}} changeOnSelect placeholder=""/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="菜单路由">
              {
                getFieldDecorator('url',{
                  rules: [{
                    required: true, message: '请填写菜单路由'
                  }],
                  initialValue:newMenu.url
                })(
                  <Input />
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="授权标识">
              {
                getFieldDecorator('perms',{initialValue:newMenu.perms})(
                  <Input  placeholder="多个用逗号分隔, 如: user:list,user:create"/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="排序号">
              {
                getFieldDecorator('orderNum',{initialValue:newMenu.orderNum})(
                  <InputNumber min={0} />
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="菜单图标">
              {
                getFieldDecorator('icon',{initialValue:newMenu.icon})(
                  <Input  placeholder="可以参考antd框架的Icon,输入Icon名称即可"/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
const MenuManagerForm = Form.create()(MenuManager);
export default connect(state => {
  return {
    projectId: state.projectId
  }
}, {})(MenuManagerForm)
