import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Breadcrumb, Row, Col, Button, message, Select, Card, Popover, Slider, Icon, DatePicker, Checkbox } from 'antd'

import PipelineChart1 from './chart/PipelineChart1'
import UnitTestChart from './chart/UnitTestChart'
import UiTestChart from './chart/UiTestChart'
import PackageChart from './chart/PackageChart'
import FluencyChart from './chart/FluencyChart'
import CpuChart from './chart/CpuChart'
import { reqGet } from '@/api/api'
import './index.scss'
import DataSet from '@antv/data-set'
// import { setProjectId } from '@/store/action'
import { setProjectId } from '@/store/actions/project'
import moment from 'moment'
import { bindActionCreators } from 'redux'

const BreadcrumbItem = Breadcrumb.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      projectId: props.projectId,
      currentTaskId: '',
      taskList: [],
      basicInformation: {},
      monitorData: {},
      reportType: [
        'pipelines',
        'unitTestMonitors',
        'uiTestMonitors',
        'cpuMemoryAnalysis',
        'fluentColdStartTimeAnalysis',
        'packageBodyMonitors'],
      sliderValue: 1,
      popoverVisable: false,
      sliderBtnName: '最近2周',
      //是否选择自定义时间
      isCheckCustomDate: false,
      startTime: '',
      endTime: '',
      selectedStartTime: '',
      selectedEndTime: '',
      marks: {
        0: '1周',
        1: '2周',
        2: '3周',
        3: '1个月',
        4: '2个月',
        5: '3个月'
      }
    }
  }

  componentWillMount () {
    const id = this.props.match.params.id
    if (id) {
      this.props.setProjectId(id)
    } else {
      let newId = window.localStorage.getItem('projectId')
      this.props.setProjectId(newId)
    }
    this.setState({
      startTime: moment().subtract(13, 'days'),
      endTime: moment(),
      selectedStartTime: moment().subtract(13, 'days'),
      selectedEndTime: moment()
    })
    this.getTaskList(id)
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
    this.setState({
      projectId: nextProps.projectId
    },()=>this.getTaskList(this.state.projectId))
  }

  /**
   * @desc 获取流水线列表
   */
  getTaskList = (projectId) => {
    reqGet('/pipeline/tasklist', {
      projectID: projectId,
      page: 1,
      limit: 100
    }).then((res) => {
      if (res.code === 0) {
        if (res.data.list.length > 0) {
          this.setState({
            taskList: res.data.list,
            currentTaskId: res.data.list[0].taskID
          })
          this.getBasicInfor()
        } else {
          message.info('暂无流水线')
        }
      }
    })
  }

  /**
   * @desc 流水线改变响应事件
   */
  onPipeLineChange = (e) => {
    this.setState({ currentTaskId: e })
    this.getBasicInfor(e)
  }

  /**
   * @desc 获取基本数据
   */
  getBasicInfor = (currentTaskId = this.state.currentTaskId) => {
    reqGet('/dashboard/basicInfor', {
      taskId: currentTaskId
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          basicInformation: res.basicInformation
        })
        this.getAllMonitorReport()
      }
    })
  }

  /**
   * @desc 获取仪表盘各项数据
   */
  getAllMonitorReport = () => {
    reqGet('/dashboard/report', {
      taskId: this.state.currentTaskId,
      dataType: 2,
      startTime: this.state.startTime.format('YYYY-MM-DD'),
      endTime: this.state.endTime.format('YYYY-MM-DD')
    }).then((res) => {
      if (res.code === 0) {
        this.setState({ selectedEndTime: this.state.endTime, selectedStartTime: this.state.startTime })
        res.data.unitTestMonitors.map(item => item.sqaleValue = parseFloat(item.sqaleValue))
        const type = ['', '源码', '加固', '补丁']
        res.data.packageBodyMonitors.map(item => {
          item.appFileSize = parseFloat(item.appFileSize)
          item.name = type[item.packageType]
          return item
        })
        this.dealUiData(res.data)
      }
    })
  }
  /**
   *  @desc 处理uiTestMonitors仪表盘数据
   *  @param data 仪表盘数据
   */
  dealUiData = (data) => {
    const ds = new DataSet()
    const dv = ds.createView('ui').source(data.uiTestMonitors || [])
    dv.transform({
      type: 'fold',
      fields: ['features', 'scenarios', 'steps'],
      // 展开字段集
      key: 'successRate',
      // key字段
      value: 'successRateValue' // value字段
    })
    data.uiTestMonitors = dv
    this.dealCpuData(data)
  }
  /**
   *  @desc 处理cpuMemoryAnalysis仪表盘数据
   *  @param data 仪表盘数据
   */
  dealCpuData = (data) => {
    let cData = []
    data.cpuMemoryAnalysis.map(item => {
      for (let i in item) {
        if (i.indexOf('cpuAverage') !== -1) {
          item.cpu = '平均CPU'
          item.cpuValue = parseFloat(item[i])
          item.text = item[i]
        }
        if (i.indexOf('cpuMax') !== -1) {
          item.cpu = '最高CPU'
          item.cpuValue = parseFloat(item[i])
          item.text = item[i]
        }
        if (i.indexOf('memoryAverage') !== -1) {
          item.memory = '平均内存'
          item.memoryValue = parseFloat(item[i])
          item.text = item[i]
        }
        if (i.indexOf('memoryMax') !== -1) {
          item.memory = '最高内存'
          item.memoryValue = parseFloat(item[i])
          item.text = item[i]
        }
        cData.push(JSON.parse(JSON.stringify(item)))
      }
      return item
    })
    data.cpuMemoryAnalysis = cData
    this.dealFluencyData(data)
  }
  /**
   *  @desc 处理cpuMemoryAnalysis仪表盘数据
   *  @param data 仪表盘数据
   */
  dealFluencyData = (data) => {
    let cData = []
    data.fluentColdStartTimeAnalysis.map(item => {
      for (let i in item) {
        if (i.indexOf('smAverage') !== -1) {
          item.sm = '平均FPS'
          item.smValue = parseFloat(item[i])
        }
        if (i.indexOf('smMin') !== -1) {
          item.sm = '最低FPS'
          item.smValue = parseFloat(item[i])
        }
        if (i.indexOf('coldStartTime') !== -1) {
          item.coldStartTime1 = '冷启动时间'
          item.coldStartTimeValue = parseFloat(item[i])
        }
        cData.push(JSON.parse(JSON.stringify(item)))
      }
      return item
    })
    data.fluentColdStartTimeAnalysis = cData
    this.setState({ monitorData: data })
  }

  /**
   * @desc 页面跳转
   * @param url 页面路径
   * @param type 包类型
   */
  openUrl = (url, type) => {
    if (!url) {
      type ? message.info('暂无加固包可下载') : message.info('暂无原包可下载')
      return
    }
    let host = window.location.host
    window.open(`http://${host}/download/downloadApk?filePath=${url}`)
  }

  /**
   * @desc 滑动选值器数据改变事件
   * @param value 数据
   */
  sliderValueChange = (value) => {
    this.setState({ sliderValue: value })
  }

  /**
   * @desc 筛选时间change事件
   * @param dates 数据
   * @param dateStrings
   */
  changeDate = (dates, dateStrings) => {
    this.setState({ selectedStartTime: dates[0], selectedEndTime: dates[1] })
  }

  /**
   * @desc 自定义时间change事件
   * @param e 是否选择
   */
  onDateTypeChange = (e) => {
    console.log(e)
    this.setState({ isCheckCustomDate: e })
  }
  /**
   * @desc 时间筛选按钮确定事件
   */
  confirmDate = () => {
    const { marks, isCheckCustomDate, sliderValue, selectedStartTime, selectedEndTime } = this.state
    let sliderBtnName = '', startTime = '', endTime = ''
    if (!isCheckCustomDate) {
      sliderBtnName = '最近' + marks[sliderValue]
      switch (sliderValue) {
        case 0:
          startTime = moment().subtract(6, 'days')
          endTime = moment()
          break
        case 1:
          startTime = moment().subtract(13, 'days')
          endTime = moment()
          break
        case 2:
          startTime = moment().subtract(20, 'days')
          endTime = moment()
          break
        case 3:
          startTime = moment().subtract(1, 'month')
          endTime = moment()
          break
        case 4:
          startTime = moment().subtract(2, 'month')
          endTime = moment()
          break
        case 5:
          startTime = moment().subtract(3, 'month')
          endTime = moment()
          break
        default:
          startTime = moment().subtract(13, 'days')
          endTime = moment()
          break
      }
      this.setState({ startTime, endTime }, () => this.getBasicInfor())
    } else {
      sliderBtnName = selectedStartTime.format('YYYY-MM-DD') + '~' + selectedEndTime.format('YYYY-MM-DD')
      this.setState({
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        sliderValue: 1
      }, () => this.getBasicInfor())
    }
    this.setState({ popoverVisable: false, sliderBtnName })
  }

  render () {
    const { currentTaskId, taskList, basicInformation, monitorData, sliderValue, popoverVisable, sliderBtnName, isCheckCustomDate, selectedStartTime, selectedEndTime, marks } = this.state
    const popoverContent = <div style={{ width: 400, padding: 16 }}>
      {!isCheckCustomDate &&
      <Slider marks={marks} onChange={this.sliderValueChange} value={sliderValue} min={0} max={5}
              tipFormatter={val => marks[val]}/>
      }
      <Checkbox onChange={(e) => {this.onDateTypeChange(e.target.checked)}}
                style={{ margin: '24px 0' }}>自定义时间</Checkbox>
      {
        isCheckCustomDate &&
        <RangePicker
          format="YYYY/MM/DD"
          value={[selectedStartTime, selectedEndTime]}
          onChange={(dates, dateStrings) => {this.changeDate(dates, dateStrings)}}
        />
      }
      <div className="popover-btn-group">
        <Button onClick={(e) => {this.setState({ popoverVisable: false })}}>取消</Button>
        <Button type="primary" onClick={() => {this.confirmDate()}}>确定</Button>
      </div>
    </div>
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>仪表盘</BreadcrumbItem>
        </Breadcrumb>
        {currentTaskId &&
        <div>
          <div className="select-container">
            <Select defaultValue={currentTaskId} onChange={e => {this.onPipeLineChange(e)}}
                    style={{ minWidth: 294, float: 'left' }}>
              {taskList.map((item, index) => <Option value={item.taskID} key={index}>{item.taskName}</Option>)}
            </Select>
            <Popover placement="bottom"
                     content={popoverContent}
                     trigger="click"
                     visible={popoverVisable}
                     onVisibleChange={visable => {this.setState({ popoverVisable: visable })}}>
              <Button style={{ float: 'left', marginLeft: 24 }} icon="clock-circle">{sliderBtnName}<Icon type="down"
                                                                                                         style={{
                                                                                                           fontSize: 13,
                                                                                                           color: '#ccc',
                                                                                                           paddingLeft: 8
                                                                                                         }}/></Button>
            </Popover>
            <Button type="primary" onClick={(e) => {this.openUrl(basicInformation.sourceAppPath, 0)}}>原包下载</Button>
            {
              basicInformation.reinforceAppPath &&
              <Button onClick={(e) => {this.openUrl(basicInformation.reinforceAppPath, 1)}}>加固包下载</Button>
            }
          </div>
          <div className="basic-info-container">
            {
              !basicInformation.fileType &&
              <p>暂无基本数据</p>
            }
            {basicInformation.fileType === 1 &&
            <Row>
              <Col span={8}>
                <p><span className="item-name">Identifier:</span>{basicInformation.packageName}</p>
              </Col>
              <Col span={8}>
                <p><span className="item-name">APP Name:</span>{basicInformation.displayName}</p>
              </Col>
              <Col span={8}>
                <p><span className="item-name">VersionCode:</span>{basicInformation.versionCode}</p>
              </Col>
              <Col span={8}>
                <p><span className="item-name">APP Version:</span>{basicInformation.versionName}</p>
              </Col>
              <Col span={8}>
                <p><span className="item-name">AppFileSize:</span>{basicInformation.appFileSize}</p>
              </Col>
              <Col span={8}>
                <p><span className="item-name">Min SDK:</span>{basicInformation.minSdk}</p>
              </Col>
              <Col span={8}>
                <p><span className="item-name">Target SDK:</span>{basicInformation.targetSdk}</p>
              </Col>
            </Row>
            }
            {
              basicInformation.fileType === 2 &&
              <Row>
                <Col span={8}>
                  <p><span className="item-name">Identifier:</span>{basicInformation.packageName}</p>
                </Col>
                <Col span={8}>
                  <p><span className="item-name">APP Name:</span>{basicInformation.displayName}</p>
                </Col>
                <Col span={8}>
                  <p><span className="item-name">Version:</span>{basicInformation.versionCode}</p>
                </Col>
                <Col span={8}>
                  <p><span className="item-name">APP Version:</span>{basicInformation.versionName}</p>
                </Col>
                <Col span={8}>
                  <p><span className="item-name">AppFileSize:</span>{basicInformation.appFileSize}</p>
                </Col>
              </Row>
            }
          </div>
          <div className="report-data">
            <Row type="flex" justify="space-between">
              <Col span={4}>
                <p className="data_title">代码总行数</p>
                <p className="data_num_black">{basicInformation.codeTotalRow || '-'}</p>
              </Col>
              <Col span={4}>
                <p className="data_title">测试数</p>
                <p className="data_num_black">{basicInformation.testQuantity || '-'}</p>
              </Col>
              <Col span={4}>
                <p className="data_title">Bugs</p>
                <p className="data_num_red">{basicInformation.bugQuantity || '-'}</p>
              </Col>
              <Col span={4}>
                <p className="data_title">漏洞</p>
                <p className="data_num_red">{basicInformation.vulnerabilities || '-'}</p>
              </Col>
              <Col span={4}>
                <p className="data_title">坏味道</p>
                <p className="data_num_red">{basicInformation.codeSmells || '-'}</p>
              </Col>
            </Row>
          </div>
          <div className="content-container">
            {
              monitorData.pipelines && monitorData.pipelines.length > 0 &&
              <Card title="流水线监控分析">
                {/*<PipelineChart pipeLineData={monitorData.pipelines}></PipelineChart>*/}
                <PipelineChart1 id={'kaka'} name={'kaka'} pipeLineData={monitorData.pipelines}></PipelineChart1>
              </Card>
            }
            {
              monitorData.unitTestMonitors && monitorData.unitTestMonitors.length > 0 &&
              <Card title="单元测试监控分析" style={{ marginTop: 30 }}>
                <UnitTestChart unitData={monitorData.unitTestMonitors}></UnitTestChart>
              </Card>
            }
            {
              monitorData.uiTestMonitors && monitorData.uiTestMonitors.rows.length > 0 &&
              <Card title="UI测试监控分析" style={{ marginTop: 30 }}>
                <UiTestChart uiData={monitorData.uiTestMonitors}></UiTestChart>
              </Card>
            }
            {
              ((monitorData.cpuMemoryAnalysis && monitorData.cpuMemoryAnalysis.length > 0) ||
                (monitorData.fluentColdStartTimeAnalysis && monitorData.fluentColdStartTimeAnalysis.length > 0) ||
                (monitorData.packageBodyMonitors && monitorData.packageBodyMonitors.length > 0)) &&
              <Card title="深度性能分析" style={{ marginTop: 30 }}>
                {
                  monitorData.cpuMemoryAnalysis.length > 0 &&
                  <Card type="inner" title="CPU&内存分析">
                    <CpuChart cpuData={monitorData.cpuMemoryAnalysis}></CpuChart>
                  </Card>
                }
                {
                  monitorData.fluentColdStartTimeAnalysis.length > 0 &&
                  <Card type="inner" title="流畅度&冷启动时间分析" style={{ marginTop: 18 }}>
                    <FluencyChart fluencyData={monitorData.fluentColdStartTimeAnalysis}></FluencyChart>
                  </Card>
                }
                {
                  monitorData.packageBodyMonitors.length > 0 &&
                  <Card type="inner" title="包体监控分析" style={{ marginTop: 18 }}>
                    <PackageChart packageData={monitorData.packageBodyMonitors}></PackageChart>
                  </Card>
                }
              </Card>
            }
          </div>
        </div>
        }

      </div>
    )
  }
}

function mapStateToProps (state) {
  const { project } = state
  if (project.projectId) {
    return {
      projectId: project.projectId
    }
  }

  return {
    permissionList: null,
    projectId: null,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setProjectId: bindActionCreators(setProjectId, dispatch),
  }
}

// const DashboardForm = Form.create()(Dashboard);
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
// export default connect(state => {
//   return {
//     // projectId: state.projectId
//   }
// }, { setProjectId })(Dashboard)
