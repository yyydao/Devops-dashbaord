import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Breadcrumb, Table, message, Modal, Tag, Icon, Button, Form, Input, Radio, Cascader, InputNumber} from 'antd'

import {reqGet,reqPost} from '@/api/api'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class MenuManager extends Component {
  constructor() {
    super()
    this.state = {
      menuList: [],
      AllMenuList: [{
        menuId:0,
        parentList:[0],
        name:"一级菜单",
        list:[]
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
          dataIndex: 'parentName',
          key: 'parentName',
          width: "10%",
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
          width: "8%",
          align:"center",
          render: (text, record) => {
            switch (text){
              case 2: return <Tag color="gray">按钮</Tag>
                break;
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
          width: "4%",
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
          width: "14%"
        },
        {
          title: '操作',
          width: "10%",
          render: (text, record) => {
            return <div><a onClick={()=>{this.updateMenu(record)}}>修改</a><span style={{color: "#eee"}}> | </span><a onClick={()=>{this.deleteMenu(record.menuId)}}>删除</a></div>
          }
        }
      ],
      loading: false,
      newMenu:{},
      modalVisible:false,
      modalTitle:'新增',
      menuType:0
    }
  }

  componentWillMount() {
    this.getMenuList()
  }

  /**
   * @desc 获取菜单列表
   */
  getMenuList = () =>{
    reqGet('/sys/menu/list').then(res => {
      if(res.code === 0){
        let AllMenuList=this.state.AllMenuList
        AllMenuList[0].list=res.menuList
        this.setState({menuList:res.menuList,AllMenuList},()=>{this.dealData(this.state.AllMenuList[0].list)})
      }else{
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
   * @desc 修改菜单
   */
  updateMenu = (menu) =>{
    let obj={
      type:menu.type,
      name:menu.name,
      parentList:menu.parentList,
    }
    if(menu.type===0||menu.type===1){
      obj.orderNum=menu.orderNum
      obj.icon=menu.icon
    }
    if(menu.type===2||menu.type===1){
      obj.perms=menu.perms
    }
    if(menu.type===1){
      obj.url=menu.url
    }
    this.setState({
      menuType:menu.type,
      modalTitle:'修改',
      newMenu:JSON.parse(JSON.stringify(menu)),
      modalVisible:true
    },()=>{
      this.props.form.setFieldsValue(obj)
    })
  }
  /**
   * @desc 删除菜单
   */
  deleteMenu = (menuId) =>{
    reqPost(`/sys/menu/delete/${menuId}`,{}).then(res => {
      if(res.code === 0){
        message.success("删除成功")
        this.getMenuList()
      }else{
        message.error(res.msg);
      }
    })
  }
  /**
   * @desc 给每个选项都添加一个父级集合
   */
  dealData = (menulist,parentList) => {
    menulist.map(item=>{
      if(item.parentId===0){
        item.parentList=[0]
      }else{
        item.parentList=[...parentList]
        item.parentList.push(item.parentId)
      }

      if(item.list){
        this.dealData(item.list,item.parentList)
      }
    })
  }
  /**
   * @desc 新增菜单
   */
  createMenu = () =>{
    this.setState({
      newMenu:{
        type:0,
        parentList:[0]
      },
      menuType:0,
      modalVisible:true,
      modalTitle:'新增'
    },()=>{
      this.props.form.setFieldsValue({type:0,name:'',parentList:[0],orderNum:0,icon:""})
    })
  }
  /**
   * @desc 新增菜单/修改菜单
   */
  onCreateMenu = () =>{
    let successMsg="新增成功"
    let validateField=['name','type','parentList','orderNum','icon']
    if(this.state.menuType===1){
      validateField=['name','type','parentList','url','perms','orderNum','icon']
    }
    if(this.state.menuType===2){
      validateField=['name','type','parentList','perms']
    }
    this.props.form.validateFields(validateField,(err, values) => {
      if (!err) {
        let menu= this.state.newMenu,postUrl='/sys/menu/save',params=JSON.parse(JSON.stringify(values))
        params.parentId=params.parentList[params.parentList.length-1]
        if(menu.menuId){
          params.menuId=menu.menuId
          postUrl='/sys/menu/update'
          successMsg="修改成功"
        }
        delete params.parentList
        reqPost(postUrl,params).then(res => {
          if(res.code === 0){
            message.success(successMsg)
            this.setState({modalVisible:false},()=>{this.getMenuList()})
          }else{
            message.error(res.msg);
          }
        })
      }
    });
  }

  render() {
    const {columns, menuList,loading, newMenu, modalVisible, AllMenuList, menuType, modalTitle} = this.state
    const { getFieldDecorator } = this.props.form;
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
            <Button type="primary" onClick={()=>{this.createMenu()}}>新增菜单</Button>
            <Table
              columns={columns}
              rowKey={record => record.menuId}
              childrenColumnName="list"
              dataSource={menuList}
              indentSize={0}
              pagination={false}
              loading={loading}
              bordered
              style={{marginTop: 16}}/>
          </div>

        </div>
        <Modal
          title={modalTitle}
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
                  <RadioGroup onChange={(e)=>{this.setState({menuType:e.target.value})}}>
                    <Radio value={0}>目录</Radio>
                    <Radio value={1}>菜单</Radio>
                    <Radio value={2}>按钮</Radio>
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
                getFieldDecorator('parentList',{
                  rules: [{
                    type: 'array', required: true, message: '请选择上级菜单'
                  }],
                  initialValue:newMenu.parentList
                })(
                  <Cascader options={AllMenuList} fieldNames={{value:"menuId",label:"name",children:"list"}} changeOnSelect placeholder=""/>
                )
              }
            </FormItem>
            {menuType===1&&
            <FormItem {...fromItemLayout} label="菜单路由">
              {
                getFieldDecorator('url',{
                  rules: [{ required: true, message: '菜单路由'}],
                  initialValue:newMenu.url
                })(
                  <Input />
                )
              }
            </FormItem>
            }
            {
              (menuType===1|| menuType===2)&&
              <FormItem {...fromItemLayout} label="授权标识">
                {
                  getFieldDecorator('perms',{initialValue:newMenu.perms})(
                    <Input  placeholder="多个用逗号分隔, 如: user:list,user:create"/>
                  )
                }
              </FormItem>
            }
            {
              (menuType===0|| menuType===1)&&
              <FormItem {...fromItemLayout} label="排序号">
                {
                  getFieldDecorator('orderNum',{initialValue:newMenu.orderNum})(
                    <InputNumber min={0} />
                  )
                }
              </FormItem>
            }
            {
              (menuType===0|| menuType===1)&&
              <FormItem {...fromItemLayout} label="菜单图标">
                {
                  getFieldDecorator('icon',{initialValue:newMenu.icon})(
                    <Input  placeholder="可以参考antd框架的Icon,输入Icon名称即可"/>
                  )
                }
              </FormItem>
            }
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
