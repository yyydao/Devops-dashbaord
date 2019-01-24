import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet, reqPostURLEncode } from '@/api/api'
import { Button, Breadcrumb, Row, Col, Card, Table, Modal, Input, Progress, message, Spin, Popover} from 'antd'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const confirm = Modal.confirm;

class Requirement extends Component{
  constructor(){
    super();
    this.state = {
      columns:[
        {
          title: 'ID',
          dataIndex: 'demandID',
          key: 'demandID',
          width:"8%",
        },
        {
          title: '需求集合',
          dataIndex: 'name',
          key: 'name',
          width:"30%"
        },
        {
          title: 'TAPD_ID',
          dataIndex: 'id',
          key: 'id',
          width:"8%",
        },
        {
          title: '进度',
          dataIndex: 'percentStage',
          key: 'percentStage',
          width:"10%",
          render:(text,record)=><Progress percent={parseInt(text,10)} />
        },
        {
          title: '状态',
          dataIndex: 'statuses',
          key: 'statuses',
          width:"8%",
          render:(text,record)=>{
            if(record.list){
              return <Popover placement="bottom" content={this.popoverContent(record.statuses)} trigger="click"><a>查看</a></Popover>
            }else{
              return record.statusStr
            }
          }
        },
        {
          title: '创建人',
          dataIndex: 'creator',
          key: 'creator',
          width:"6%",
        },
        {
          title: '预计开始',
          dataIndex: 'begin',
          key: 'begin',
          width:"10%",
        },
        {
          title: '预计结束',
          dataIndex: 'due',
          key: 'due',
          width:"10%",
        },
        {
          title: '操作',
          width:"10%",
          render: (text, record) => {if(record.id){return<div><a onClick={()=>this.showConfirm(record.demandID)}>删除</a><span style={{color:"#eee"}}> | </span><Link to={{pathname:'/package', query:{tapdID:record.id}}}>提测</Link></div>}}
        }
      ],
      listData: [],
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: null
      },
      params: {},
      loading: false,
      modalVisible:false,
      searchTapdId:'',
      searchRequirement:{},
      searchLoading:false
    }
  }
  componentWillMount(){
    this.setState({params:{
        limit: 10,
        page: 1,
        projectID:this.props.projectId
      }},()=>this.getTableData())
  }
  showConfirm = (demandID) =>{
    confirm({
      title: '',
      content: '该配置中可能存在重要数据，是否继续删除？（请谨慎操作！）',
      onOk:()=> {this.deleteRequirement(demandID)}
    });
  }
  popoverContent = (statuses) =>{
    if(statuses){
      return <div>{statuses.map((item,index)=><p key={index} className="status-container"><span>{item.status}</span><span>{item.size}个</span></p>)}</div>
    }else{
      return <div>暂无状态</div>
    }
  }
  /**
   * @desc 表格页数改变事件
   */
  handleTableChange = (pagination) => {
    const params = { ...this.state.params };
    params.page = pagination.current;
    this.setState({ params: params }, this.getTableData);
  }

  /**
   * @desc 获取tapd表格数据
   */
  getTableData = () => {
    this.setState({ loading: true });
    reqGet('demand/story/list', this.state.params).then(res => {
      if(res.code === 0){
        const pagination = { ...this.state.pagination };
        const params = { ...this.state.params };
        pagination.total = res.data.totalCount;
        pagination.showTotal = () => {
          return '共 ' + res.data.totalCount+ ' 条';
        };
        if(this.state.params.page>res.data.totalPage&&res.data.totalPage!==0){
          params.page=res.data.totalPage
          this.setState({params},()=>{this.getTableData()})
        }else{
          this.setState({
            loading: false,
            listData: res.data.list,
            pagination,
            params
          });
        }
      }else{
        this.setState({ loading: false });
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 获取某个tapd需求的数据
   */
  getRequirement = () =>{
    if(!this.state.searchTapdId) {
      message.info("请填入Tapd关联的父需求id")
      return
    }
    this.setState({searchLoading:true},()=>{
      reqGet('/demand/tapd/stories', {
        demandIDs:this.state.searchTapdId,
        projectID:this.props.projectId
      }).then(res => {
        if(res.code === 0){
          if(res.data===null){
            message.info(`未查询到"${this.state.searchTapdId}"对应的需求，请确认输入的TAPD_ID是否正确`)
            this.setState({searchRequirement:{},searchLoading:false})
          }else{
            this.setState({searchRequirement:res.data[0],searchLoading:false})
          }
        }else{
          message.error(res.msg);
        }
      })
    })
  }

  /**
   * @desc 创建需求集合
   */
  onCreateRequirement = () =>{
    if(!this.state.searchTapdId) {
      message.info("请填入Tapd关联的父需求id")
      return
    }
    if(!this.state.searchRequirement.name||this.state.searchRequirement.id!==this.state.searchTapdId) {
      this.setState({searchRequirement:{}})
      message.info("请点击刷新，获得需求集合名称")
      return
    }
    reqPost('/demand/story/add', {
      storyName:this.state.searchRequirement.name,
      storyID:this.state.searchTapdId,
      projectID:this.props.projectId
    }).then(res => {
      if(res.code === 0){
        message.success("创建成功")
        this.setState({
          modalVisible:false,
          searchLoading:false,
          searchTapdId:'',
          searchRequirement:{},
          params:{limit: 10, page: 1, projectID:this.props.projectId}
          },()=>this.getTableData())
      }else{
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 关闭Modal的事件
   */
  onCloseModal = () => {
    this.setState({modalVisible:false,searchLoading:false,searchRequirement:{},searchTapdId:''})
  }

  /**
   * @desc 删除需求
   */
  deleteRequirement = (id) => {
    reqPostURLEncode('demand/story/delete', {
      ID:id
    }).then(res => {
      if(res.code === 0){
        message.success("删除成功")
        this.setState({
          modalVisible:false,
          searchLoading:false
        },()=>this.getTableData())
      }else{
        message.error(res.msg);
      }
    })
  }

  render () {
    const {
      listData,
      columns,
      pagination,
      loading,
      modalVisible,
      searchTapdId,
      searchRequirement,
      searchLoading} = this.state
    const expandedRowRender = (record) => {
      console.log(record)
      const columns = [
        {
          title: 'ID',
          width:"8%",
          key:'demandID'
        },
        {
          title: '需求集合',
          dataIndex: 'name',
          key: 'name',
          width:"30%"
        },
        {
          title: 'TAPD_ID',
          dataIndex: 'id',
          key: 'id',
          width:"8%"
        },
        {
          title: '进度',
          dataIndex: 'percentStage',
          key: 'percentStage',
          width:"10%",
          render:(text,record)=><Progress percent={parseInt(text,10)} />
        },
        {
          title: '状态',
          dataIndex: 'statusStr',
          key: 'statusStr',
          width:"8%"
        },
        {
          title: '创建人',
          dataIndex: 'creator',
          key: 'creator',
          width:"6%"
        },
        {
          title: '预计开始',
          dataIndex: 'begin',
          key: 'begin',
          width:"10%"
        },
        {
          title: '预计结束',
          dataIndex: 'due',
          key: 'due',
          width:"10%"
        },
        {
          title: '操作',
          width:"10%",
          key:'edit'
        }
      ];
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
            extra={<Button type="primary" icon="plus" onClick={()=>{this.setState({modalVisible:true})}}>创建需求集合</Button>}>
            <Table
              columns={columns}
              rowKey={record => record.id}
              expandedRowRender={expandedRowRender}
              dataSource={listData}
              indentSize={0}
              pagination={pagination}
              loading={loading}
              onChange={this.handleTableChange}/>
          </Card>
        </div>
        <Modal
          title="创建需求集合"
          visible={modalVisible}
          onOk={()=>{this.onCreateRequirement()}}
          onCancel={()=>{this.onCloseModal()}}>
          <Spin spinning={searchLoading}>
          <Row>
            <Col span={20}><Input placeholder='TAPD_ID（填入Tapd关联的父需求id）' value={searchTapdId} onChange={(e)=>{this.setState({searchTapdId:e.target.value.trim()})}}/></Col>
            <Col span={4}><Button type="primary" style={{cssFloat:"right"}} onClick={()=>this.getRequirement()}>刷新</Button></Col>
          </Row>
          <Input placeholder="需求集合名称" readOnly style={{marginTop:16}} value={searchRequirement.name}/>
          <div style={{border:"1px solid #d9d9d9",borderRadius:4,marginTop:16,maxHeight:200,padding:8,overflowY:"scroll",minHeight:100}}>
            {
              searchRequirement.list&&searchRequirement.list.map((item,index)=>
                <p key={index} style={{marginBottom:8}}>{item.name}</p>)
            }
          </div>
          <p style={{marginTop:24,marginBottom:0}}>预计时间：   {searchRequirement.begin||'—'}{searchRequirement.begin&&searchRequirement.due?'~':'/'}{searchRequirement.due||'—'}</p>
          </Spin>
        </Modal>
      </div>
    )
  }
}

Requirement = connect((state) => {
  return {
    projectId: state.project.projectId
  }
})(Requirement)

export default Requirement
