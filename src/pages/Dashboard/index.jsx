import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Row, Col, Tag, Button, message, Divider, Select, Card, Modal } from 'antd';

import PipelineChart from './chart/PipelineChart';
import UnitTestChart from './chart/UnitTestChart';
import UiTestChart from './chart/UiTestChart';
import PackageChart from './chart/PackageChart';
import FluencyChart from './chart/FluencyChart';
import CpuChart from './chart/CpuChart';
import { reqPost, reqGet} from '@/api/api';
import './index.scss';
import DataSet from "@antv/data-set";

const BreadcrumbItem = Breadcrumb.Item;
const Option = Select.Option;



class Dashboard extends Component{
  constructor(){
    super();
    this.state = {
      currentTaskId: "",
      taskList: [],
      basicInformation: {},
      monitorData: {},
      reportType: [
        'pipelines',
        'unitTestMonitors',
        'uiTestMonitors',
        'cpuMemoryAnalysis',
        'fluentColdStartTimeAnalysis',
        'packageBodyMonitors']
    }
  }

  componentWillMount(){
    window.localStorage.setItem('oldProjectId', this.props.projectId);
    this.getTaskList()
  }

  /**
   * @desc 获取流水线列表
   */
  getTaskList(){
    reqGet('/pipeline/tasklist', {
      projectID: this.props.projectId,
      page: 1,
      limit: 100
    }).then((res) => {
      if (res.code === 0) {
        if(res.data.list.length > 0){
          this.setState({
            taskList:res.data.list,
           currentTaskId:res.data.list[0].taskID
          })
          this.getBasicInfor()
        }else{
          message.info('暂无流水线')
        }
      }
    })
  }

  /**
   * @desc 流水线改变响应事件
   */
  onPipeLineChange = (e) =>{
    this.setState({currentTaskId:e})
    this.getBasicInfor(e)
  }

  /**
   * @desc 获取基本数据
   */
  getBasicInfor = (currentTaskId=this.state.currentTaskId) =>{
    reqGet('/dashboard/basicInfor', {
      taskId:currentTaskId
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          basicInformation:res.basicInformation
        })
        this.getAllMonitorReport()
      }
    })
  }

  /**
   * @desc 获取仪表盘各项数据
   */
  getAllMonitorReport = () =>{
    let that=this;
      reqGet('/dashboard/report', {
        taskId:this.state.currentTaskId,
      }).then((res) => {
        if (res.code === 0) {
          res.data.unitTestMonitors.map(item=>item.sqaleValue=parseFloat(item.sqaleValue))
          const type=[,'源码','加固','补丁']
          res.data.packageBodyMonitors.map(item=>{item.appFileSize=parseFloat(item.appFileSize);item.name=type[item.packageType]})
          this.setState({monitorData:res.data})
          this.dealUiData(res.data.uiTestMonitors)
          this.dealCpuData(res.data.cpuMemoryAnalysis||[])
          this.dealFluencyData(res.data.fluentColdStartTimeAnalysis||[])
        }
      })
  }
  /**
   *  @desc 处理uiTestMonitors仪表盘数据
   *  @param data 仪表盘数据
   */
  dealUiData = (data) =>{
    const ds = new DataSet();
    const dv = ds.createView('ui').source(data);
    dv.transform({
      type: "fold",
      fields: ["features", "scenarios","steps"],
      // 展开字段集
      key: "successRate",
      // key字段
      value: "successRateValue" // value字段
    });
    let result = this.state.monitorData
    result.uiTestMonitors = dv
    this.setState({result})
  }
  /**
   *  @desc 处理cpuMemoryAnalysis仪表盘数据
   *  @param data 仪表盘数据
   */
  dealCpuData = (data) =>{
    let dat=[
        {
          cpuAverage:'19.25%',
          createTime:'2018-10-26 09:58:38.0',
          memoryAverage:'227.43MB',
          memoryMax:'309.0MB',
          cpuMax:'36.2%'
        },
      {
        cpuAverage:'39.25%',
        createTime:'2018-10-24 09:58:38.0',
        memoryAverage:'127.43MB',
        memoryMax:'109.0MB',
        cpuMax:'72.2%'
      },
    ]
    let cData=[]
    data.map(item=>{
      for(let i in item){
        if(i.indexOf('cpuAverage')!==-1){
          cData.push({
            cpu:'平均CPU',
            cpuValue:parseFloat(item[i]),
            createTime:item['createTime']
          })
        }
        if(i.indexOf('cpuMax')!==-1){
          cData.push({
            cpu:'最高CPU',
            cpuValue:parseFloat(item[i]),
            createTime:item['createTime']
          })
        }
        if(i.indexOf('memoryAverage')!==-1){
          cData.push({
            memory:'平均内存',
            memoryValue:parseFloat(item[i]),
            createTime:item['createTime']
          })
        }
        if(i.indexOf('memoryMax')!==-1){
          cData.push({
            memory:'最高内存',
            memoryValue:parseFloat(item[i]),
            createTime:item['createTime']
          })
        }
      }
    })
    let result = this.state.monitorData
    result.cpuMemoryAnalysis = cData
    this.setState({result})
  }
  /**
   *  @desc 处理cpuMemoryAnalysis仪表盘数据
   *  @param data 仪表盘数据
   */
  dealFluencyData = (data) =>{
    let dat=[
      {
        smAverage:'58帧/s',
        createTime:'2018-10-26 09:58:38.0',
        coldStartTime:'0.847秒',
        smMin:'9帧/s',
      },
      {
        smAverage:'42帧/s',
        createTime:'2018-10-27 09:58:38.0',
        coldStartTime:'10秒',
        smMin:'12帧/s',
      }
    ]
    let cData=[]
    data.map(item=>{
      for(let i in item){
        if(i.indexOf('smAverage')!==-1){
          cData.push({
            sm:'平均FPS',
            smValue:parseFloat(item[i]),
            createTime:item['createTime']
          })
        }
        if(i.indexOf('smMin')!==-1){
          cData.push({
            sm:'最低FPS',
            smValue:parseFloat(item[i]),
            createTime:item['createTime']
          })
        }
        if(i.indexOf('coldStartTime')!==-1){
          cData.push({
            coldStartTime:'冷启动时间',
            coldStartTimeValue:parseFloat(item[i]),
            createTime:item['createTime']
          })
        }
      }
    })
    let result = this.state.monitorData
    result.fluentColdStartTimeAnalysis = cData
    this.setState({result})
  }

  /**
   * @desc 页面跳转
   * @param url 页面路径
   * @param type 包类型
   */
  openUrl = (url,type) =>{
    if(!url){
      type?message.info('暂无加固包可下载'):message.info('暂无原包可下载')
      return
    }
    let host = window.location.host
    let url1=url.substring(url.indexOf('./')+1)
    window.open(`http://${host}${url1}`)
  }


  render(){
    const {currentTaskId, taskList, basicInformation, monitorData} = this.state;
    return(
        <div>
          <Breadcrumb className="devops-breadcrumb">
            <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
            <BreadcrumbItem>仪表盘</BreadcrumbItem>
          </Breadcrumb>
          {currentTaskId &&
          <div>
            <Select defaultValue={currentTaskId} onChange={e => {this.onPipeLineChange(e)}} style={{minWidth:200}}>
            {taskList.map((item,index)=><Option value={item.taskID} key={index}>{item.taskName}</Option>)}
            </Select>
            <Card  title="基本信息" style={{marginTop: 30}}>
              <Row>
                <Col span={8} className="info-menu">
                  <div><Tag color="#2db7f5">Identifier</Tag> {basicInformation.packageName}</div>
                  <div><Tag color="#2db7f5">SDK Name</Tag>{basicInformation.displayName}</div>
                  <div><Tag color="#2db7f5">versionCode</Tag>{basicInformation.versionCode}</div>
                  <div><Tag color="#2db7f5">versionName</Tag>{basicInformation.versionName}</div>
                  <div><Tag color="#2db7f5">appFileSize</Tag>{basicInformation.appFileSize}</div>
                  <div><Tag color="#2db7f5">minSdk</Tag>{basicInformation.minSdk}</div>
                  <div><Tag color="#2db7f5">targetSdk</Tag>{basicInformation.targetSdk}</div>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={8}>
                      <span className="data_title">代码总行数</span>
                      <p className="data_num" style={{color:"#2db7f5"}}>{basicInformation.codeTotalRow||0}</p>
                    </Col>
                    <Col span={8} offset={1}>
                      <span className="data_title">测试数</span>
                      <p className="data_num" style={{color:"#2db7f5"}}>{basicInformation.testQuantity||0}</p>
                    </Col>
                    <Col span={8} >
                      <span className="data_title">Bugs</span>
                      <p className="data_num" style={{color:"#f50"}}>{basicInformation.bugQuantity||0}</p>
                    </Col>
                    <Col span={8}>
                      <span className="data_title">漏洞</span>
                      <p className="data_num" style={{color:"#f50"}}>{basicInformation.vulnerabilities||0}</p>
                    </Col>
                    <Col span={8}>
                      <span className="data_title">坏味道</span>
                      <p className="data_num" style={{color:"#f50"}}>{basicInformation.codeSmells||0}</p>
                    </Col>
                  </Row>
                </Col>
                <Col span={4} className="btn-group">
                  <p>
                    <Button type="primary" onClick={(e)=>{this.openUrl(basicInformation.reinforceAppPath,0)}}>原包下载</Button>
                  </p>
                  <Button type="primary" onClick={(e)=>{this.openUrl(basicInformation.reinforceAppPath,1)}}>加固包下载</Button>
                </Col>
              </Row>
            </Card>
            <Card  title="流水线监控分析" style={{marginTop: 30}}>
              <PipelineChart pipeLineData={monitorData.pipelines}></PipelineChart>
            </Card>
            <Card  title="单元测试监控分析" style={{marginTop: 30}}>
              <UnitTestChart unitData={monitorData.unitTestMonitors}></UnitTestChart>
            </Card>
            <Card  title="UI测试监控分析" style={{marginTop: 30}}>
              <UiTestChart uiData={monitorData.uiTestMonitors}></UiTestChart>
            </Card>
            <Card  title="深度性能分析" style={{marginTop: 30}}>
              <Card type="inner" title="CPU&内存分析">
                <CpuChart cpuData={monitorData.cpuMemoryAnalysis}></CpuChart>
              </Card>
              <Card type="inner" title="流畅度&冷启动时间分析" style={{marginTop: 18}}>
                <FluencyChart fluencyData={monitorData.fluentColdStartTimeAnalysis}></FluencyChart>
              </Card>
              <Card type="inner" title="包体监控分析" style={{marginTop: 18}}>
                <PackageChart packageData={monitorData.packageBodyMonitors}></PackageChart>
              </Card>
            </Card>
            </div>
          }
        </div>
    )
  }
}

// const DashboardForm = Form.create()(Dashboard);
export default connect(state => {
  return{
    projectId: state.projectId
  }
}, {})(Dashboard);