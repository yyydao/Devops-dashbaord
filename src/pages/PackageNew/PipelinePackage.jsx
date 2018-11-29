import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reqPost, reqGet } from '@/api/api';
import './list.scss';
import VersionPanel from './versionPanel';

import { Breadcrumb, Icon, Button, Input, Collapse, Modal, Select, Pagination, Popconfirm, message } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;
const Option = Select.Option;


class PipelinePackage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId:props.projectId,

      //控制列表数量以及当前页码
      totalCount: 100,
      curPage: 1,

      //列表list
      dataList: [],
      //环境列表
      envList:[],
      //版本列表
      versionList:[],

      //筛选条件
      envID:'',
      version:'',

      //状态集合
      statusList:["成功","等待构建","正在构建","构建失败","取消构建"]
    }
  }
  propTypes: {
    projectId: PropTypes.string.isRequired
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      projectId: nextProps.projectId
    },()=>{
      // this.getEnvList()
    });
  }
  componentWillMount () {
    // this.getEnvList()
  }

  /**
   * @desc 获取环境列表
   */
  getEnvList = () =>{
    const {projectId} = this.state
    reqGet('package/envselect', {projectID:projectId}).then(res => {
      if (res.code === 0) {
        let id=''
        res.data.map(item=>{if(item.name==="测试环境"){id=item.id}})
        this.setState({
          envList:res.data,
          envID:id////默认为测试环境
        },()=>{this.getVersionList()})
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取版本列表
   */
  getVersionList = () =>{
    const {projectId,envID} = this.state
    reqGet('package/versionselect', {
      projectID:projectId,
      envID:envID
    }).then(res => {
      if (res.code === 0) {
        let buildVersion=''
        if(res.data.length>0){
          buildVersion=res.data[0].buildVersion
        }
        this.setState({
          versionList:res.data,
          version:buildVersion
        },()=>this.getPackageList())
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取提测列表
   */
  getPackageList = () => {
    const {projectId, envID, status, version,curPage} = this.state
    console.log("llllll")
    reqGet('package/packagelist', {
      projectID:projectId,envID, status,version,page:curPage,limit:10
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          totalCount:res.data.totalCount,
          dataList:res.data.list,
        })
      } else {
        message.error(res.msg)
      }
    })
  }
  /**
   * @desc 筛选条件改变事件
   * @param e 条件被修改的值
   * @param key 条件字段
   */
  filterChange = (e,key) =>{
    let newState={}
    newState[key]=e
    this.setState(newState,()=>{
      if(key==="envID"){
        this.getVersionList()
      }else{
        this.getPackageList()
      }
    })
  }

  /**
   * @desc 分页的改变事件
   * @param page 修改成的页数
   */
  onPaginationChange = (page) =>{
    this.setState({curPage:page},()=>this.getPackageList())
  }

  /**
   * @desc 列表item的高亮显示以及详情页的调起
   * @param buildID
   */
  onListItemClick = (buildID) =>{
    let dataList = this.state.dataList
    dataList.map(item=>{
      item.active=item.buildID===buildID?true:false
    })
    this.setState({dataList})
  }

  /**
   * @desc 下载按钮点击
   */
  onDownloadClick = (e,url) =>{
    e.preventDefault()
    let host = window.location.host
    window.open(`http://${host}/download/downloadApk?filePath=${url}`)
  }

  /**
   * @desc 取消按钮事件
   */
  onCancleClick= (e,id) =>{
    e.preventDefault()
    const { envID } = this.state;
    reqPost('/package/cancel', {
      buildId: id,
      type: 0,
      envId: envID
    }).then((res) => {
      if (res.code != 0) {
        Modal.info({
          title: '提示',
          content: (
              <p>{res.msg}</p>
          ),
          onOk() {}
        });
      } else {
        this.getPackageList();
      }
    })
  }

  render() {
    const { totalCount, curPage, envList, versionList,dataList, envID, version, statusList} = this.state;

    return (
        <div className="package">
          <div className="package-title">
            <span style={{paddingRight:8,paddingLeft:8}}>流水线</span>
            <Select value={envID}
                    style={{ width: 150, marginRight:24 }}
                    onChange={(e)=>{this.filterChange(e,'envID')}}>
            </Select>
            <span style={{paddingRight:8}}>版本</span>
            <Select value={version}
                    style={{ width: 150, marginRight:24 }}
                    onChange={(e)=>{this.filterChange(e,'version')}}>
            </Select>
          </div>
          <div className="package-content">
            {
              dataList.length>0&&
              <div className="package-content-left">
                <div className="package-list">
                  {dataList.map((item,index) =>{
                    let fileName='', button=''
                    if(item.status===0){
                      fileName=<span style={{color:"#39A1EE"}}>{item.fileName}</span>
                      button=<Button
                          type="primary"
                          style={{marginRight:"auto"}}
                          onClick={(e)=>{this.onDownloadClick(e,item.filePath)}}>下载</Button>
                    }
                    if(item.status>0&&item.status<3){
                      fileName=<span style={{color:"#39A1EE"}}>{statusList[item.status]}</span>
                      button=<Button
                          type="primary"
                          style={{marginRight:"auto"}}
                          onClick={(e)=>{this.onCancleClick(e,item.buildID)}}>取消</Button>
                    }
                    if(item.status>0&&item.status<4){
                      fileName=<span style={{color:"#FF0000"}}>{statusList[item.status]}</span>
                      button=<Button
                          type="primary"
                          style={{marginRight:"auto"}}>查看</Button>
                    }
                    return <a className="package-list-item"
                              key={index}
                              style={{background:item.active?"#eee":"#fff"}}
                              onClick={()=>{this.onListItemClick(item.buildID)}}>
                      <img src={require('@/assets/favicon.ico')} />
                      <p>
                        {fileName}
                        <span style={{paddingLeft:8}}>buildId：{item.buildID}</span><br/>
                        <span>时间：{item.createTime}</span><br/>
                        <span>提测人：{item.developer}</span>
                      </p>
                      {!item.active&& button}
                      {!item.active&&<Icon type="right"/>}
                    </a>
                  })
                  }
                </div>
                <Pagination onChange={()=>{this.onPaginationChange}}
                            total={totalCount}
                            showTotal={total => `共 ${totalCount} 条`}
                            pageSize={10}
                            current={curPage}
                            style={{marginTop:16,cssFloat:"right"}}/>
              </div>
            }
          </div>
        </div>

    )
  }
}

PipelinePackage = connect((state) => {
  console.log(state)
  return {
    projectId: state.projectId
  }
})(PipelinePackage)

export default PipelinePackage;
