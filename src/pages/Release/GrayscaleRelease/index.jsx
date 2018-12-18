import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'
import { Button, Breadcrumb, Row, Col, Card, Table, message } from 'antd'
import './index.scss'


const BreadcrumbItem = Breadcrumb.Item;
class GrayscaleRelease extends Component{
  constructor(){
    super();
    this.state = {
      projectId:'',
      platform:'',
      projectName:'',
      columns: [
        {
          title: '版本',
          dataIndex: 'appVersion',
          key: 'appVersion',
          // render: (text, record) => <Link to={`/dashboard/${record.id}`}>{ text }</Link>
        },
        {
          title: 'Build',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '大小',
          dataIndex: 'fileSize',
          key: 'fileSize'
        },
        {
          title: '下载次数',
          dataIndex: 'downloadCount',
          key: 'downloadCount'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime'
        },
        {
          title: '操作',
          render: (text, record) => <div><Link to={{pathname:'/addGrayscale', query:{packageID:record.packageID,versionID:record.id}}}>编辑</Link><span style={{color:"#eee"}}> | </span><a href={`${record.filePath}`}>下载</a></div>
        }
      ],
      listData: [],
      pagination: {
        pageSize: 7,
        total: 0,
        showTotal: null
      },
      loading: false,
      params: {
        limit: 7,
        page: 1,
        bundleID: 'com.tuandai.client'
      },
      downloadPath:''
    }
  }
  componentWillMount(){
    this.getPlatForm()
    this.getTableData()
  }
  /**
  * @desc 获取项目详情为了获取platform，区分是ios,还是Android
  * @params {int} [page] 页数，默认为1
  */
  getPlatForm = () => {
    reqPost('/project/projectInfo', {
      projectId:this.props.projectId
    }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.setState({
          platform:res.data.platform,
          projectName:res.data.description
        })
      }
    })
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
   * @desc 获取表格数据
   */
  getTableData = () => {
    this.setState({ loading: true });
    reqGet('/deploy/versionlist', this.state.params).then(res => {
      if(res.code === 0){
        const pagination = { ...this.state.pagination };
        const params = { ...this.state.params };
        params.bundleID = res.package.bundleID;
        pagination.total = res.data.totalCount;
        pagination.showTotal = () => {
          return '共 ' + res.data.totalCount+ ' 条';
        };

        this.setState({
          loading: false,
          listData: res.data.list,
          projectName:res.package.appName,
          downloadPath:res.package.downloadPath,
          pagination,
          params
        });
      }else{
        this.setState({ loading: false });
        message.error(res.msg);
      }
    })
  }
  render () {
    const {platform, projectName, listData, columns, pagination, loading, params, downloadPath} = this.state
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>灰度发布</BreadcrumbItem>
        </Breadcrumb>
        {platform===2&&
          <div>
            <div className="button-container">
              <span>{projectName}</span>
              <Button type="primary"><Link to="/addGrayscale">新发布</Link></Button>
              <Button>停止发布</Button>
            </div>
            <Row className="button-container">
              <Col span={8}><span className="item-name">Bundle ID：</span><span className="item-value">{params.bundleID}</span></Col>
              <Col span={8}><span className="item-name">下载地址：</span><a href={downloadPath} className="item-value">点击下载</a></Col>
            </Row>
            <div className="content-container">
              <Card title="版本信息">
                <Table columns={columns} rowKey={record => record.id} dataSource={listData} pagination={pagination} loading={loading} onChange={this.handleTableChange}/>
              </Card>
            </div>
          </div>
        }
      </div>
    )
  }
}

GrayscaleRelease = connect((state) => {
  return {
    projectId: state.projectId
  }
})(GrayscaleRelease)

export default GrayscaleRelease
