import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Row, Col, Icon, Popover, Button, message } from 'antd'
import { transSecond } from '@/utils/utils'
import { Link } from 'react-router-dom'
import { reqGet, reqPostURLEncode } from '@/api/api'
import './control.scss'

const BreadcrumbItem = Breadcrumb.Item

class STFControl extends Component {

  constructor (props) {
    super(props)
    this.state = {
      projectId: props.projectId,
      iFrameHeight: '0px',
      url: '',
      popoverContent: '',
      useTimeInSecond: 0,
      model: '',
      deviceInfo: {},
      stfPath: '',
    }
  }

  async endUp () {
    const { projectId, serial } = this.state
    const res = await reqPostURLEncode('/stfDevices/close', { projectId: projectId, serial })
    console.log(res.code)
    if (res.code === 0) {
      this.props.history.replace({
        pathname: `/stfDevices`,
      })
    } else {
      message.error(res.msg)
    }
  }

  tick = () => {
    this.setState({ useTimeInSecond: (this.state.useTimeInSecond + 1) })
  }

  startTimer = () => {
    console.log('rrrrunnnnn~')
    clearInterval(this.timer)
    this.timer = setInterval(this.tick.bind(this), 1000)
  }

  stopTimer = () => {
    clearInterval(this.timer)
  }

  componentWillMount () {
    const serial = this.props.match.params.deviceID
    console.log(serial)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  async componentDidMount (): void {
    const { projectId } = this.state
    const res = await reqGet('/stfDevices/checkUserUseDevice', { projectId: projectId })
    const deviceInfo = await res.data
    if (res.code === 0) {
      this.setState({
        deviceInfo,
        useTimeInSecond: deviceInfo && deviceInfo['useTime'] ? deviceInfo.useTime : 1,
        model: deviceInfo && deviceInfo.model,
        serial: deviceInfo && deviceInfo.serial,
        stfPath: deviceInfo && deviceInfo.stfPath,

      }, () => {
        this.startTimer()
        this.setState({ url: `${this.state.stfPath}#!/control/${this.state.serial}` })
      })
    } else {
      message.error(`${res.msg}`, 2.5)
        .then(()=>message.info(`即将跳转到列表页`),2.5)
        .then(()=>{
          this.props.history.replace({
            pathname: `/stfDevices`,
          })
        })
    }
  }

  render () {
    const { url, useTimeInSecond, model, deviceInfo } = this.state
    const popoverContent = <div className='modal-content-wrap'>
      <p className='popover-control'><span className='popover-control-type'>型号：</span><span
        className='popover-control-span'>{deviceInfo['model']}</span></p>
      <p className='popover-control'><span className='popover-control-type'>版本：</span><span
        className='popover-control-span'>{deviceInfo['version']}</span></p>
      <p className='popover-control'><span className='popover-control-type'>分辨率：</span><span
        className='popover-control-span'>{deviceInfo['width']} * {deviceInfo['height']}</span></p>
      <p className='popover-control'><span className='popover-control-type'>ABI：</span><span
        className='popover-control-span'>{deviceInfo['abi']}</span></p>
      <p className='popover-control'><span className='popover-control-type'>总使用次数：</span><span
        className='popover-control-span'>{deviceInfo['totalUseQuantity']}</span></p>
      <p className='popover-control'><span className='popover-control-type'>总使用时长：</span><span
        className='popover-control-span'>{transSecond(deviceInfo['totalUseTime'])}</span></p>
    </div>
    return (
      <div style={{ height: '100%' }}>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>云真机</BreadcrumbItem>
        </Breadcrumb>
        <div className="control-meta">
          <Row type='flex' align='space-around' justify='middle' className='task-item-row'>
            <Col span={12}>
              <Popover style={{ width: '198px' }}
                       trigger="hover"
                       content={popoverContent}
                       arrowPointAtCenter
                       placement="bottom"
              >
                <Icon style={{ 'cursor': 'pointer', fontSize: 24, verticalAlign: 'middle' }} type='mobile'/>
                <span className='phone-model'>{model}</span>
              </Popover>
            </Col>
            <Col span={12} className='control'>
              <span className='control-time'>已使用：<i>{transSecond(useTimeInSecond)}</i></span>
              <Button type='default'
                      className='control-button'
                      onClick={() => this.endUp()}
              >结束使用</Button>
            </Col>
          </Row>
        </div>
        <iframe
          title={'SFB'}
          ref="iframe"
          src={url}
          width="100%"
          height="100%"
          scrolling="yes"
          frameBorder="0"
        />
      </div>)
  }
}

STFControl = connect((state) => {
  return {
    projectId: state.projectId
  }
})(STFControl)

export default STFControl


