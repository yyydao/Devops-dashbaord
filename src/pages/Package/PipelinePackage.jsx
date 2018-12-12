import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reqGet } from '@/api/api';
import './list.scss';

import {  Icon, Button, Modal, Select, Pagination, Layout, message } from 'antd';
import PipelinePackageDetail from './pipelinePackageDetail'
const Option = Select.Option;
const { Content, Sider } = Layout;


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
      //流水线列表
      pipelineList:[],
      //版本列表
      versionList:[],

      //筛选条件
      taskID:'',
      version:'',

      //状态集合
      statusList:["成功","等待构建","正在构建","构建失败","取消构建"],

        currentRecordNo:'',
        currentTaskID: '',
        currentBuildId: '',
        currentFileType: '',
    }
  }
  propTypes: {
    projectId: PropTypes.string.isRequired
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      projectId: nextProps.projectId
    },()=>{
      this.getPipelineList()
    });
  }
  componentWillMount () {
    this.getPipelineList()
  }

  /**
   * @desc 获取流水线列表
   */
  getPipelineList = () =>{
    const {projectId} = this.state
    reqGet('pipeline/package/taskselect', {projectID:projectId}).then(res => {
      if (res.code === 0) {
        let id=''
        if(res.data.length>0){
          id = res.data[0].taskID
        }
        this.setState({
          pipelineList:res.data,
          taskID:id},()=>{this.getVersionList()})
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取版本列表
   */
  getVersionList = () =>{
    const {taskID} = this.state
    reqGet('pipeline/package/packageversionselect', {
      taskID:taskID
    }).then(res => {
      if (res.code === 0) {
        let buildVersion=''
        if(res.data.length>0){
          buildVersion=res.data[0].versionCode
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
   * @desc 获取流水线包列表
   */
  getPackageList = () => {
    const {projectId, taskID, version,curPage} = this.state
    this.setState({currentBuildId:''})
    reqGet('pipeline/package/taskpackagelist', {
      projectID:projectId,
      taskID,
      versionCode:version,
      page:curPage,
      limit:10
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
    newState['curPage']=1
    this.setState(newState,()=>{
      if(key==="taskID"){
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
  onListItemClick = (item) =>{
    console.log(item)
    let dataList = this.state.dataList
      const buildID = item.buildID
      const recordNo = item.recordNo
      const fileType = item.fileType
      const taskID = item.taskID
    dataList.map(item=>{
      item.active = item.buildID === buildID ? true : false;
      return item
    })
    this.setState({
        dataList,
        currentRecordNo:recordNo,
        currentTaskID: taskID,
        currentBuildId: buildID,
        currentFileType:fileType,
    })
  }

  /**
   * @desc 下载按钮点击
   */
  onDownloadClick = (e,filePath) =>{
    e.preventDefault()
    e.stopPropagation()
    window.open(filePath)
  }

  /**
   * @desc 帮助
   */
  toggleDialogInfo = () => {
    Modal.info({
      title: '提示',
      content: (
          <p>归档【流水线】模块生成的安装包（含源包、加固包、补丁包）。</p>
      ),
      onOk() {}
    });
  }

  render() {
    const { totalCount, curPage, pipelineList, versionList,dataList, taskID, version} = this.state;

    return (
        <div className="package">
          <div className="package-title">
            <span style={{paddingRight:8,paddingLeft:8}}>流水线</span>
            <Select value={taskID}
                    style={{ width: 150, marginRight:24 }}
                    onChange={(e)=>{this.filterChange(e,'taskID')}}>
              {pipelineList.map((item,index) => {
                return <Option value={item.taskID} key={index}>{item.taskName}</Option>
              })}
            </Select>
            <span style={{paddingRight:8}}>版本</span>
            <Select value={version}
                    style={{ width: 150, marginRight:24 }}
                    onChange={(e)=>{this.filterChange(e,'version')}}>
              {versionList.map((item,index) => {
                return <Option value={item.versionCode} key={index}>{item.versionName}</Option>
              })}
            </Select>
            <Icon type="question-circle" style={{fontSize:24,color:"#000",verticalAlign:"middle",marginLeft:50}} onClick={()=>this.toggleDialogInfo()}/>
          </div>
          <div className="package-content">
            {
              dataList.length>0&&
              <Layout>
                  <Sider theme="light"
                         width={600}>
              <div className="package-content-left">
                <div className="package-list">
                  {dataList.map((item,index) =>{
                    return <a className="package-list-item"
                              key={index}
                              style={{background:item.active?"#eee":"#fff"}}
                              onClick={()=>{this.onListItemClick(item)}}>
                      <img src={require('@/assets/favicon.ico')} />
                      <p>
                        <span style={{color:"#39A1EE"}}>{item.fileName}</span>
                        <span style={{paddingLeft:8}}>buildId：{item.buildID}</span><br/>
                        <span>时间：{item.updateTime}</span><br/>
                        <span>提测人：{item.buildor}</span>
                      </p>
                      {!item.active&& <Button
                          type="primary"
                          style={{marginRight:"auto"}}
                          onClick={(e)=>{this.onDownloadClick(e,item.filePath)}}>下载</Button>}
                      {!item.active&&<Icon type="right"/>}
                    </a>
                  })
                  }
                </div>
                <Pagination onChange={(e)=>{this.onPaginationChange(e)}}
                            total={totalCount}
                            showTotal={total => `共 ${totalCount} 条`}
                            pageSize={10}
                            current={curPage}
                            style={{marginTop:16,cssFloat:"right"}}/>
              </div>
                  </Sider>
                  <Content>
                      { !!this.state.currentBuildId &&
                      <PipelinePackageDetail
                          buildId={this.state.currentBuildId}
                          recordNo={this.state.currentRecordNo}
                          taskID={this.state.currentTaskID}
                          fileType={this.state.currentFileType}
                      />
                      }
                  </Content>
              </Layout>
            }
          </div>
        </div>

    )
  }
}

PipelinePackage = connect((state) => {
  console.log(state)
  return {
    token: state.token,
    projectId: state.projectId
  }
})(PipelinePackage)

export default PipelinePackage;
