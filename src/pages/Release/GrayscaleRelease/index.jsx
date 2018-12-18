import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'
import { Button, Breadcrumb, Row, Col, Card, Table, message, Icon } from 'antd'
import Edit from '@/pages/Setting/ConfigManager/Edit';
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
      androidColumns:[
        {
          title: '特征Key',
          dataIndex: 'featureName',
          key: 'featureName',
          // render: (text, record) => <Link to={`/dashboard/${record.id}`}>{ text }</Link>
        },
        {
          title: '特征描述',
          dataIndex: 'detail',
          key: 'detail',
          // render: (text, record) => <Edit name='detail'panelIndex ={record.key} defaultValue={record.detail} handleConfirm={this.changeEdit}/>
        },
        {
          title: '选取值',
          dataIndex: 'featureValue',
          key: 'featureValue',
          // render: (text, record) => <Link to={`/dashboard/${record.id}`}>{ text }</Link>
        },
        {
          title: '操作',
          render: (text, record) => <a>删除</a>
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
      downloadPath:'',
      androidData:{
        "id": 1,
        "projectId": 63,
        "version": "5.4.2",
        "expectQuantitty": 3000,
        "actualQuantity": 1500,
        "expression": "^1[0-1]",
        "featureItems": [
          {
            "featureName": "T-G1-Device",
            "featureValue": "cdfd23afc2a-3f",
            "checked": false,
            "detail": "设备唯一编码"
          },
          {
            "featureName": "T-G1-Device",
            "featureValue": "cdfd23afc2a-3f",
            "checked": false,
            "detail": "设备唯一编码"
          }
        ]
      }
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
        },()=>{
          if(res.data.platform===1){
            this.getAndroidGrayScaleData()
          }
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

  /**
   * @desc 文本编辑事件
   * @param value string 文本编辑内容
   * @param key string 文本编辑字段
   * @param index num 环境下标
   */
  changeEdit = (value, index, key) => {
    if(key==="version"){
      let androidData = this.state.androidData
      androidData[key] = value
      this.setState({androidData})
    }else{
      console.log(index)
      // let androidData = this.state.androidData
      // androidData.featureItems[index][key] = value
      // this.setState({androidData})
    }
  }

  /**
   * @desc 获取android灰度发布主页数据
   */
  getAndroidGrayScaleData = () =>{
    reqGet('/distribute/queryInformationt', {projectId:this.props.projectId}).then(res => {
      if(res.code === 0){

      }else{

      }
    })
  }
  render () {
    const {platform, projectName, listData, columns, androidColumns, pagination, loading, params, downloadPath, androidData} = this.state
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>灰度发布</BreadcrumbItem>
        </Breadcrumb>
        {platform===1&&
          <div>
            <div className="button-container">
              <span>{projectName}</span>
            </div>
            <div className="content-container">
              <Card title="分布情况">
                <div className="config-project-item">
                  <span>分发版本：</span>
                  <Edit name='version'  defaultValue={androidData.version} handleConfirm={this.changeEdit}/>
                </div>
                <p><span style={{paddingRight:8,marginBottom:0}}>实际分发数/预计分发数：</span>{androidData.actualQuantity}/{androidData.expectQuantitty}</p>
              </Card>
              <Card
                title="灰度特征及策略管理"
                className="gray-feature"
                extra={<Button type="primary"><Icon type="plus"/>新增特征</Button>}>
                <Table columns={androidColumns} rowKey={record => record.id} dataSource={androidData.featureItems} pagination={false}/>
              </Card>
            </div>
          </div>
        }
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
