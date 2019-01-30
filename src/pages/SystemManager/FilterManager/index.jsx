import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Breadcrumb, Table, message, Modal, Button, Row, Col, Form, Input, InputNumber } from 'antd'

import {reqGet,reqPost} from '@/api/api'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item
const FormItem = Form.Item;
const Search = Input.Search;
const confirm = Modal.confirm;

class FilterManager extends Component {
  constructor() {
    super()
    this.state = {
      filterList: [],
      newFilter: {},
      loading: false,
      confirmLoading:false,
      modalVisible: false,
      params: {
        limit: 10,
        page: 1,
        url: ''
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'filterId',
          key: 'filterId',
          width: "10%",
          align: "center"
        },
        {
          title: '链接',
          dataIndex: 'url',
          key: 'url',
          width: "20%"
        },
        {
          title: '权限名称',
          dataIndex: 'perms',
          key: 'perms',
          width: "20%",
        },
        {
          title: '编号',
          dataIndex: 'orderNum',
          key: 'orderNum',
          width: "20%"
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
              this.updateFilter(record.filterId)
            }}>修改</a><span style={{color: "#eee"}}> | </span><a onClick={() => {
              this.deleteFilter([record.filterId])
            }}>删除</a></div>
          }
        }
      ],
      modalTitle:'新增',
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
    this.getFilterList()
  }

  /**
   * @desc 获取菜单列表
   */
  getFilterList = () =>{
    this.setState({ loading: true });
    reqGet('/perms/list',this.state.params).then(res => {
      if(res.code === 0){
        const pagination = { ...this.state.pagination };
        const params = { ...this.state.params };
        pagination.total = res.page.totalCount;
        pagination.current = res.page.currPage;
        pagination.showTotal = () => {
          return '共 ' + res.page.totalCount+ ' 条';
        };
        this.setState({
          filterList:res.page.list,
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
   * @desc 关闭弹窗
   */
  onCloseModal = () =>{
    this.setState({modalVisible:false,confirmLoading:false})
  }
  /**
   * @desc 修改白名单
   */
  updateFilter = (filterId) =>{
    this.setState({
      confirmLoading:true,
      modalVisible:true,
      modalTitle:'修改'
    },()=>{
      reqGet(`/perms/info/${filterId}`).then(res => {
        if(res.code === 0){
          this.setState({newFilter:res.perms,confirmLoading:false})
          this.props.form.setFieldsValue({
            url:res.perms.url,
            orderNum:res.perms.orderNum,
          })
        }else{
          message.error(res.msg);
        }
      })
    })
  }
  /**
   * @desc 删除白名单
   */
  deleteFilter = (filterIds) =>{
    if(filterIds.length===0){
      message.warning("请选择删除的白名单")
      return
    }
    confirm({
      title: '',
      content: '该配置中可能存在重要数据，是否继续删除？（请谨慎操作！）',
      onOk:()=> {
        reqPost(`/perms/deleteByPermsIds`,filterIds).then(res => {
          if(res.code === 0){
            message.success("删除成功")
            this.getFilterList()
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
  handleTableChange = (pagination,url) => {
    const params = { ...this.state.params };
    if(pagination){
      params.page = pagination.current;
    }else{
      params.page = 1;
      params.url=url;
    }
    this.setState({ params: params }, this.getFilterList);
  }
  /**
   * @desc 新增白名单
   */
  onAddFilter = () =>{
    this.setState({
      modalVisible:true,
      newFilter:{},
      modalTitle:'新增'},()=>{
      this.props.form.setFieldsValue({
        url:'',
        orderNum:'',
      })
    })
  }

  /**
   * @desc 新增白名单/修改白名单
   */
  onCreateFilter = () =>{
    let successMsg="新增成功"
    this.props.form.validateFields(['url','orderNum'],(err, values) => {
      if (!err) {
        let filter= this.state.newFilter,postUrl='/perms/savePerms'
        if(filter.filterId){
          postUrl='/perms/upatePerms'
          successMsg="修改成功"
          values.filterId=filter.filterId
        }
        reqPost(postUrl,values).then(res => {
          if(res.code === 0){
            message.success(successMsg)
            this.setState({modalVisible:false},()=>{this.getFilterList()})
          }else{
            message.error(res.msg);
          }
        })
      }
    });
  }

  render() {
    const {columns, filterList,loading, newFilter, modalVisible, modalTitle, pagination, selectedRowKeys, confirmLoading} = this.state
    const { getFieldDecorator } = this.props.form;
    const fromItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>白名单</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <div style={{backgroundColor: "#fff", padding: 16}}>
            <Row>
              <Col span={6}>
                <Search
                  placeholder="链接"
                  enterButton="查询"
                  onSearch={value => this.handleTableChange('',value)}
                />
              </Col>
              <Col span={18}>
                <Button type="primary" onClick={()=>{this.onAddFilter()}} style={{marginLeft:16}}>新增</Button>
                <Button type="danger" onClick={()=>{this.deleteFilter(this.state.selectedRowKeys)}} style={{marginLeft:16}}>批量删除</Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              rowSelection={{
                selectedRowKeys,
                onChange: this.onSelectedRowKeys
              }}
              rowKey={record => record.filterId}
              pagination={pagination}
              dataSource={filterList}
              indentSize={0}
              loading={loading}
              bordered
              style={{marginTop: 16}}
              onChange={this.handleTableChange}/>
          </div>
        </div>
        <Modal
          title={modalTitle}
          width={600}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onOk={()=>{this.onCreateFilter()}}
          onCancel={()=>{this.onCloseModal()}}>
          <Form>
            <FormItem {...fromItemLayout} label="链接">
              {
                getFieldDecorator('url',{
                  rules: [{
                    required: true, message: '请填写链接'
                  }],
                  initialValue:newFilter.url
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="编号">
              {
                getFieldDecorator('orderNum',{
                  rules: [{
                    required: true, message: '请填写编号'
                  }],
                  initialValue:newFilter.orderNum
                })(
                  <InputNumber min={0}/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
const FilterManagerForm = Form.create()(FilterManager);
export default connect(state => {
  return {
    projectId: state.projectId
  }
}, {})(FilterManagerForm)
