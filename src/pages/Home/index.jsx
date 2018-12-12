import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Icon, Table, Modal, Form, Radio, message } from 'antd';

import { reqPost } from '@/api/api';
import './index.scss';

const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

class Home extends Component{
  constructor(){
    super();
    this.state = {
      proModalVisible: false,
      formData: {
        projectName: '',
        desc: '',
        address: '',
        platform: ''
      },
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => <Link to={`/dashboard/${record.id}`}>{ text }</Link>
        },
        {
          title: '创建者',
          dataIndex: 'creator',
          key: 'creator'
        },
        {
          title: '成员数',
          dataIndex: 'memberCount',
          key: 'memberCount'
        },
        {
          title: '迭代数',
          dataIndex: 'buildCount',
          key: 'buildCount'
        },
        {
          title: '最新版本',
          dataIndex: 'lastVersion',
          key: 'lastVersion'
        }
      ],
      hasPermission: false,
      data: [],
      loading: false,
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: null
      },
      params: {
        pageSize: 10,
        pageNum: 1,
        projectName: ''
      },
      platformList: [],
    }
  }

  componentWillMount(){
    this.hasAddProjectPermission();
    this.getTableData();
  }

  hasAddProjectPermission(){
    reqPost('/permission/hasAddProjectPermission').then(res => {
      if(parseInt(res.code, 0) === 0){
        this.setState({ hasPermission: res.data });
      }else{
        message.error(res.msg);
      }
    })
  }

  getTableData = () => {
    this.setState({ loading: true });
    reqPost('/project/listProjectByUser', this.state.params).then(res => {
      if(res.code === 0){
        const pagination = { ...this.state.pagination };
        pagination.total = res.count;
        pagination.showTotal = () => {
          return '共 ' + res.count + ' 条';
        };
        this.setState({
          loading: false,
          data: res.data,
          pagination
        });
      }else{
        this.setState({ loading: false });
        message.error(res.msg);
      }
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const params = { ...this.state.params };
    params.pageNum = pagination.current;
    this.setState({ params: params }, this.getTableData);
  }

  SearchEvent = (value, e) => {
    const params = { ...this.state.params };
    params.projectName = value;
    params.pageNum = 1;
    this.setState({ params }, this.getTableData);
  }

  getPlatformList = () => {
    reqPost('/config/listPlatform').then(res => {
      if(parseInt(res.code, 0) === 0){
        this.setState({ platformList: res.data });
      }else{
        message.error(res.msg);
      }
    })
  }

  showModal = () => {
    this.setState({ proModalVisible: true });
    this.getPlatformList();
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err){
        reqPost('/project/addProject', values).then(res => {
          if(parseInt(res.code, 0) === 0){
            message.success('项目新增成功！');
            this.setState({ proModalVisible: false });
            this.props.form.resetFields();
            this.getTableData();
          }else{
            message.error(res.msg);
          }
        })
      }
    })
  }

  handleCancel = (e) => {
    this.setState({ proModalVisible: false });
    this.props.form.resetFields();
  }

  render(){
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
    let appQRcode = (type) =>{
      return <div style={{width:170,margin:"0px 75px",position:"relative"}}>
        {
          type==='iOS'&& <img src={`${window.location.origin}/version/getQRCode?platform=2`} style={{width:170,height:170,display:'block'}} alt=""/>
        }
        {
          type==='Android'&& <img src={`${window.location.origin}/version/getQRCode?platform=1`} style={{width:170,height:170,display:'block'}} alt=""/>
        }
        {!type&&
        <div className="qrCode-mask">
          <span>即将开放</span>
        </div>
        }
        <p style={{textAlign:"center",marginTop:8,color:"#000"}}>【DevOps】{type}下载</p>
      </div>
    }
    return(
        <div className="home-card">
          <div className="header clear">
            <p className="search">我参与的项目：<Search placeholder="请输入并按回车搜索" onSearch={this.SearchEvent} style={{width: 180}} /></p>
            <p className="actions">
              {
                this.state.hasPermission && <a onClick={this.showModal}><Icon type="plus-circle" />新建项目</a>
              }
              <Link to="/personal"><Icon type="user" />个人信息</Link>
            </p>
          </div>
          <Table columns={this.state.columns} rowKey={record => record.id} dataSource={this.state.data} pagination={this.state.pagination} loading={this.state.loading} onChange={this.handleTableChange}/>
          <div className="appQRcodeContainer">
            {appQRcode('iOS')}
            {appQRcode('Android')}
          </div>
          { /* 新建项目弹窗 */ }
          <Modal title="新建项目" visible={this.state.proModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} okText="确认" cancelText="取消">
            <Form>
              <FormItem {...fromItemLayout} label="项目名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '必填项' }]
                })(
                    <Input />
                )}
              </FormItem>
              <FormItem {...fromItemLayout} label="项目描述">
                {getFieldDecorator('description', {
                  rules: [{ required: true, message: '必填项' }]
                })(
                    <TextArea />
                )}
              </FormItem>
              <FormItem {...fromItemLayout} label="GitHub地址">
                {getFieldDecorator('gitUrl', {
                  rules: [{ required: true, message: '必填项' }]
                })(
                    <Input />
                )}
              </FormItem>
              <FormItem {...fromItemLayout} label="平台">
                {getFieldDecorator('platform', {
                  rules: [{ required: true }],
                  initialValue: 1
                })(
                    <RadioGroup>
                      {
                        this.state.platformList.map((item, index) => {
                          return <Radio key={index} value={item.id}>{item.name}</Radio>
                        })
                      }
                    </RadioGroup>
                )}
              </FormItem>
            </Form>
          </Modal>
        </div>
    )
  }
}

const WrapperHome = Form.create()(Home);
export default WrapperHome;
