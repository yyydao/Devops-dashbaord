import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Breadcrumb, Table, message, Modal, Tree, Button, Row, Col, Form, Input, Switch } from 'antd'

import {reqGet,reqPost} from '@/api/api'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item
const FormItem = Form.Item;
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

class RoleManager extends Component {
  constructor() {
    super()
    this.state = {
      roleList: [],
      newRole:{},
      AllMenuList: [],
      loading: false,
      modalVisible:false,
      modalTitle:'新增',
      params: {
        limit: 10,
        page: 1,
        roleName: ''
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'roleId',
          key: 'roleId',
          width: "10%",
          align:"center"
        },
        {
          title: '名称',
          dataIndex: 'roleName',
          key: 'roleName',
          width: "30%"
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: "30%",
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
            return <div><a onClick={()=>{this.updateRole(record.roleId)}}>修改</a><span style={{color: "#eee"}}> | </span><a onClick={()=>{this.deleteRole([record.roleId])}}>删除</a></div>
          }
        }
      ],
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: null
      },
      selectedRowKeys:[],
      halfCheckedKeys:[],
      expandedKeys:[],
      isOver:false
    }
  }

  componentWillMount() {
    this.getRoleList()
    this.getMenuList()
  }

  /**
   * @desc 获取角色列表
   */
  getRoleList = () =>{
    this.setState({ loading: true });
    reqGet('/sys/role/list',this.state.params).then(res => {
      if(res.code === 0){
        const pagination = { ...this.state.pagination };
        const params = { ...this.state.params };
        pagination.total = res.page.totalCount;
        pagination.current = res.page.currPage;
        pagination.showTotal = () => {
          return '共 ' + res.page.totalCount+ ' 条';
        };
        this.setState({
          roleList:res.page.list,
          pagination,
          params,
          loading:false,
          selectedRowKeys:[]
        })
      }else{
        message.error(res.msg);
      }
    })
  }
  /**
   * @desc 表格选择栏改变事件
   */
  onSelectedRowKeys = (selectedRowKeys) =>{
    this.setState({selectedRowKeys})
  }
  /**
   * @desc 获取菜单列表
   */
  getMenuList = () =>{
    reqGet('/sys/menu/list').then(res => {
      if(res.code === 0){
        let AllMenuList=res.menuList
        this.setState({AllMenuList})
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
   * @desc 修改角色
   */
  updateRole = (roleId) =>{
    reqGet(`/sys/role/info/${roleId}`).then(res => {
      if(res.code === 0){
        let role=res.role
        if(role.unSelect){
          let halfcheck=role.unSelect.split(',')
          halfcheck.map(item=>{
            let index=role.menuIdList.indexOf(parseInt(item))
            if(index>-1){
              role.menuIdList.splice(index,1)
            }
          })
        }
        console.log(role.menuIdList)
        this.setState({
          newRole:role,
          modalTitle:'修改',
          modalVisible:true,
          expandedKeys:[]
        },()=>{
          this.props.form.setFieldsValue({roleName:res.role.roleName})
          // this.dealTreeData(JSON.parse(JSON.stringify(this.state.AllMenuList)))
        })
      }else{
        message.error(res.msg);
      }
    })
  }
  dealTreeData = (data) =>{
    let menuIdList =JSON.parse(JSON.stringify(this.state.newRole.menuIdList))
    data.map(item=>{
      if(menuIdList.indexOf(item.menuId)>-1){
        if(item.list){
          for(let i=0;i<item.list.length;i++){
            if(menuIdList.indexOf(item.list[i].menuId)<0){
              menuIdList.splice(menuIdList.indexOf(item.menuId),1)
              let newRole=JSON.parse(JSON.stringify(this.state.newRole))
              newRole.menuIdList=menuIdList
              this.setState({newRole,isOver:true},()=>{
                this.dealTreeData(JSON.parse(JSON.stringify(item.list)))
              })
              break;
            }
          }
        }
      }
      return item
    })
  }
  /**
   * @desc 删除角色
   */
  deleteRole = (roleIds) =>{
    if(roleIds.length===0){
      message.warning("请选择删除的角色")
      return
    }
    confirm({
      title: '',
      content: '该配置中可能存在重要数据，是否继续删除？（请谨慎操作！）',
      onOk:()=> {
        reqPost(`/sys/role/delete`,roleIds).then(res => {
          if(res.code === 0){
            message.success("删除成功")
            this.getRoleList()
          }else{
            message.error(res.msg);
          }
        })
      }
    });
  }
  /**
   * @desc 表格页数改变事件
   */
  handleTableChange = (pagination,roleName) => {
    const params = { ...this.state.params };
    if(pagination){
      params.page = pagination.current;
    }else{
      params.page = 1;
      params.roleName=roleName;
    }
    this.setState({ params: params }, this.getRoleList);
  }
  /**
   * @desc 新增角色
   */
  onAddRole = () =>{
    this.setState({
      modalVisible:true,
      modalTitle:'新增',
      newRole:{},
      expandedKeys:[]
      },()=>{
      this.props.form.setFieldsValue({roleName:''})
    })
  }
  /**
   * @desc 树状菜单渲染
   */
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.list && item.list.length>0) {
        return (
          <TreeNode title={item.name} key={item.menuId} dataRef={item}>
            {this.renderTreeNodes(item.list)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.menuId} dataRef={item}/>;
    });
  }
  /**
   * @desc 授权改变事件
   */
  menuIdListChanged = (checkedKeys,e) =>{
    let newRole = this.state.newRole
    newRole.menuIdList = checkedKeys
    this.setState({newRole,halfCheckedKeys:e.halfCheckedKeys})
  }
  /**
   * @desc 备注改变事件
   */
  onRemarkChanged = (e) =>{
    let newRole = this.state.newRole
    newRole.remark = e.target.value
    this.setState({newRole})
  }
  /**
   * @desc 是否用于注册改变事件
   */
  onUseRegisterChanged = (e) =>{
    let newRole = this.state.newRole
    newRole.useRegister = e
    this.setState({newRole})
  }
  /**
   * @desc 新增角色/修改角色
   */
  onCreateRole = () =>{
    let successMsg="新增成功"
    this.props.form.validateFields(['roleName'],(err, values) => {
      if (!err) {
        let role= JSON.parse(JSON.stringify(this.state.newRole)),postUrl='/sys/role/save'
        if(role.roleId){
          postUrl='/sys/role/update'
          successMsg="修改成功"
        }
        role.roleName=values.roleName
        role.useRegister=this.state.newRole.useRegister||false
        role.unSelect=this.state.halfCheckedKeys.join(',')
        role.menuIdList=[...this.state.newRole.menuIdList,...this.state.halfCheckedKeys]
        reqPost(postUrl,role).then(res => {
          if(res.code === 0){
            message.success(successMsg)
            this.setState({modalVisible:false},()=>{this.getRoleList()})
          }else{
            message.error(res.msg);
          }
        })
      }
    });
  }

  render() {
    const {columns, roleList,loading, newRole, modalVisible, pagination, selectedRowKeys, AllMenuList, modalTitle, expandedKeys} = this.state
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
          <BreadcrumbItem>角色管理</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <div style={{backgroundColor: "#fff", padding: 16}}>
            <Row>
              <Col span={6}>
                <Search
                  placeholder="角色名称"
                  enterButton="查询"
                  onSearch={value => this.handleTableChange('',value)}
                />
              </Col>
              <Col span={18}>
                <Button type="primary" onClick={()=>{this.onAddRole()}} style={{marginLeft:16}}>新增</Button>
                <Button type="danger" onClick={()=>{this.deleteRole(this.state.selectedRowKeys)}} style={{marginLeft:16}}>批量删除</Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              rowSelection={{
                selectedRowKeys,
                onChange: this.onSelectedRowKeys
              }}
              rowKey={record => record.roleId}
              pagination={pagination}
              dataSource={roleList}
              indentSize={0}
              loading={loading}
              bordered
              style={{marginTop: 16}}
              onChange={this.handleTableChange}/>
          </div>

        </div>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onOk={()=>{this.onCreateRole()}}
          onCancel={()=>{this.onCloseModal()}}>
          <Form>
            <FormItem {...fromItemLayout} label="角色名称">
              {
                getFieldDecorator('roleName',{
                  rules: [{
                    required: true, message: '请填写角色名称'
                  }],
                  initialValue:newRole.roleName
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="备注">
              <Input value={newRole.remark} onChange={(e)=>{this.onRemarkChanged(e)}}/>
            </FormItem>
            <FormItem {...fromItemLayout} label="是否用于注册">
              <Switch checked={newRole.useRegister} onChange={(e)=>{this.onUseRegisterChanged(e)}}/>
            </FormItem>
            <FormItem {...fromItemLayout} label="授权">
              <div className="tree-container">
                <Tree
                  checkable
                  onCheck={(checkedKeys,e)=>{this.menuIdListChanged(checkedKeys,e)}}
                  checkedKeys={newRole.menuIdList}
                  expandedKeys={expandedKeys}
                  onExpand={(expandedKeys)=>{this.setState({expandedKeys})}}
                >
                  {this.renderTreeNodes(AllMenuList)}
                </Tree>
              </div>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
const RoleManagerForm = Form.create()(RoleManager);
export default connect(state => {
  return {
    projectId: state.projectId
  }
}, {})(RoleManagerForm)
