import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'
import { Button, Breadcrumb, Row, Col, Card, Table, Tree, Modal, Input, Progress} from 'antd'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const { TreeNode } = Tree;

class Requirement extends Component{
  constructor(){
    super();
    this.state = {
      projectId: '',
      columns:[
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width:"10%",
        },
        {
          title: '需求集合',
          dataIndex: 'name',
          key: 'name',
          width:"13%",
        },
        {
          title: 'TAPD_ID',
          dataIndex: 'tapd_id',
          key: 'tapd_id',
          width:"10%",
        },
        {
          title: '进度',
          dataIndex: 'progress',
          key: 'progress',
          width:"10%",
          render:(text,record)=><Progress percent={parseInt(text,10)} />
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width:"10%",
        },
        {
          title: '创建人',
          dataIndex: 'user',
          key: 'user',
          width:"10%",
        },
        {
          title: '预计开始',
          dataIndex: 'begin',
          key: 'begin',
          width:"13%",
        },
        {
          title: '预计结束',
          dataIndex: 'end',
          key: 'end',
          width:"13%",
        },
        {
          title: '操作',
          width:"10%",
          render: (text, record) => {if(record.id){return<div><a href="javascript:void(0);">删除</a><span style={{color:"#eee"}}> | </span><a href="javascript:void(0);">提测</a></div>}}
        }
      ],
      data: [
        {
          id:"00001",
          name:"v5.4.0",
          tapd_id:"12456",
          progress: '10%',
          status: '进行中',
          user: 'wuyanzu',
          begin: '2018-12-27 08:00:00',
          end: '2018-12-27 08:00:00'
        },
        {
          id:"00002",
          name:"v5.4.0",
          tapd_id:"124567",
          progress: '10%',
          status: '进行中',
          user: 'wuyanzu',
          begin: '2018-12-27 08:00:00',
          end: '2018-12-27 08:00:00'
        }],
      pagination: {
        pageSize: 7,
        total: 0,
        showTotal: null
      },
      loading: false,
      modalVisible:false,
      treeData:[{
        title: '0-0',
        key: '0-0',
        children: [{
          title: '0-0-0',
          key: '0-0-0',
          children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
          ],
        }, {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
          ],
        }, {
          title: '0-0-2',
          key: '0-0-2',
        }],
      }, {
        title: '0-1',
        key: '0-1',
        children: [
          { title: '0-1-0-0', key: '0-1-0-0' },
          { title: '0-1-0-1', key: '0-1-0-1' },
          { title: '0-1-0-2', key: '0-1-0-2' },
        ],
      }, {
        title: '0-2',
        key: '0-2',
      }]
    }
  }
  componentWillMount(){
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} dataRef={item} />;
  })

  render () {
    const {
      data,
      columns,
      pagination,
      loading,
      modalVisible} = this.state
    const expandedRowRender = (record) => {
      const columns = [
        {
          title: 'ID',
          width:"10%",
          key:'id'
        },
        {
          title: '需求集合',
          dataIndex: 'name',
          key: 'name',
          width:"13%"
        },
        {
          title: 'TAPD_ID',
          dataIndex: 'tapd_id',
          key: 'tapd_id',
          width:"10%"
        },
        {
          title: '进度',
          dataIndex: 'progress',
          key: 'progress',
          width:"10%",
          render:(text,record)=><Progress percent={parseInt(text,10)} />
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width:"10%"
        },
        {
          title: '创建人',
          dataIndex: 'user',
          key: 'user',
          width:"10%"
        },
        {
          title: '预计开始',
          dataIndex: 'begin',
          key: 'begin',
          width:"13%"
        },
        {
          title: '预计结束',
          dataIndex: 'end',
          key: 'end',
          width:"13%"
        },
        {
          title: '操作',
          width:"10%",
          key:'edit'
        }
      ];

      let data1=[];
      data1.push(record)
        return (
          <Table
            columns={columns}
            dataSource={data1}
            pagination={false}
            showHeader={false}
            indentSize={0}
            rowKey={record => record.tapd_id}
          />
        );
    };
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>需求</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <Card
            title="需求集合"
            className="add-requirement"
            extra={<Button type="primary" icon="plus" onClick={()=>{this.setState({modalVisible:true})}}>创建需求列表</Button>}>
            <Table
              columns={columns}
              rowKey={record => record.tapd_id}
              expandedRowRender={expandedRowRender}
              dataSource={data}
              indentSize={0}
              pagination={pagination}
              loading={loading}
              onExpand={(expanded, record)=>{console.log(expanded, record)}}/>
          </Card>
        </div>
        <Modal
          title="创建需求列表"
          visible={modalVisible}
          onOk={()=>{this.setState({modalVisible:false})}}
          onCancel={()=>{this.setState({modalVisible:false})}}>
          <Input placeholder="需求集合名称，如：v5.4.3"/>
          <Row style={{marginTop:24}}>
            <Col span={20}><Input placeholder='TAPD_ID（填入Tapd关联的父需求id，多个需求以";"分号间隔）'/></Col>
            <Col span={4}><Button type="primary" style={{cssFloat:"right"}}>刷新</Button></Col>
          </Row>
          <div style={{border:"1px solid #d9d9d9",borderRadius:4,marginTop:24,maxHeight:200,padding:8,overflowY:"scroll"}}>
            <Tree showLine>
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </div>
          <p style={{marginTop:24}}>预计时间：   —/—</p>
        </Modal>
      </div>
    )
  }
}

Requirement = connect((state) => {
  return {
    projectId: state.projectId
  }
})(Requirement)

export default Requirement
