import React, { Component } from 'react'
import { Breadcrumb, Row, Col, Button, Pagination, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { reqGet, reqPostURLEncode } from '@/api/api'
import { Link } from 'react-router-dom'
import './index.scss'
import { transSecond } from '@/utils/utils'
import phoneBrandImage from '@/assets/img/VIVOX9i.png'

const BreadcrumbItem = Breadcrumb.Item

const enumStatusClass = {
  1: 'status available',
  2: 'status occupation',
  3: 'status unavailable',
  4: 'status unavailable'
}

const enumBlockStatusClass = {
  1: 'device-status available',
  2: 'device-status occupation',
  3: 'device-status unavailable',
  4: 'device-status unavailable'
}

class STFList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      projectId: props.projectId,
      curPage: 1,
      deviceList: [],
      modalVisible: false,
      modalModel: '',
      modalVersion: '',
      modalWidth: '',
      modalHeight: '',
      modalABI: '',
      modalTotalUseQuantity: '',
      mdoalTotalUseTime: '',
      serial: '',
    }
  }

  showModal = (item) => {
    console.log(item)
    const title = `${item.manufacturer} ${item.model}`
    this.setState({

      modalModel: title,
      modalVersion: item.version,
      modalWidth: item.width,
      modalHeight: item.height,
      modalABI: item.abi,
      modalTotalUseQuantity: item.totalUseQuantity,
      modalTotalUseTime: item.totalUseTime,
      serial: item.serial,
    }, () => {
      this.setState({ modalVisible: true })
    })
  }

  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  getStatus = (status, user, useTime_in_second) => {
    const enumStatusContet = {
      1: '设备闲置，可申请使用',
      2: `${user}正在使用设备 (${transSecond(useTime_in_second)})`,
      3: `${user}正在使用设备 (${transSecond(useTime_in_second)})`,
      4: '设备断开连接'
    }

    return enumStatusContet[status]
  }

  /**
   * @desc 获取设备列表
   */
  async getDeviceList () {
    const { projectId, curPage } = this.state
    const res = await reqGet('/stfDevices/devices', { projectId: projectId, page: curPage, limit: 6 })

    if (await res.code === 0) {
      const deviceList = res.data && res.data.pageData && res.data.pageData.list
      this.setState({
        freeCount: res.data.freeCount,
        totalCount: res.data.totalCount,
        usingCount: res.data.usingCount,
        deviceList: deviceList,
      })
    } else {
      message.error(res.msg)
    }
  }

  /**
   * @desc 分页的改变事件
   * @param page 修改成的页数
   */
  onPaginationChange = (page) => {
    this.setState({ curPage: page }, () => this.getDeviceList())
  }

  applyForDevice = () => {
    console.log(this.state)
    const { projectId, serial } = this.state
    reqPostURLEncode('/stfDevices/apply', { projectId: projectId, serial: serial }).then((res) => {
      if (res.code === 0) {
        console.log(res)
        // this.props.history.push()
        this.props.history.replace({
          pathname: `stfDevices/control/${serial}`,
        })
      } else {
        message.error(res.msg)
        this.getDeviceList()
      }
    })

  }

  async componentDidMount (): void {
    console.log(this.state)
    const { projectId } = this.state
    const res = await reqGet('/stfDevices/checkUserUseDevice', { projectId: projectId })
    const using = await res.code === 0
    if (using) {
      const serial = await res.data.serial
      this.props.history.replace({
        pathname: `stfDevices/control/${serial}`,
      })
    }
  }

  componentWillMount (): void {
    this.getDeviceList()
  }

  render () {
    const {
      curPage, modalVisible, deviceList, usingCount, totalCount, freeCount,
      modalModel, modalVersion, modalWidth, modalHeight, modalABI, modalTotalUseQuantity, modalTotalUseTime
    } = this.state

    return (
      <div>
        <Modal title="申请使用"
               visible={modalVisible}
               onOk={this.applyForDevice}
               onCancel={this.hideModal}
               maskClosable={false}
               destroyOnClose={true}
        >
          <div className='modal-content-wrap'>
            <p className='modal-p'><span className='modal-type'>型号：</span><span
              className='modal-span'>{modalModel}</span></p>
            <p className='modal-p'><span className='modal-type'>版本：</span><span
              className='modal-span'>{modalVersion}</span></p>
            <p className='modal-p'><span className='modal-type'>分辨率：</span><span
              className='modal-span'>{modalWidth} * {modalHeight}</span></p>
            <p className='modal-p'><span className='modal-type'>ABI：</span><span
              className='modal-span'>{modalABI}</span></p>
            <p className='modal-p'><span className='modal-type'>总使用次数：</span><span
              className='modal-span'>{modalTotalUseQuantity}</span></p>
            <p className='modal-p'><span className='modal-type'>总使用时长：</span><span
              className='modal-span'>{transSecond(modalTotalUseTime)}</span></p>
          </div>
        </Modal>

        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>云真机</BreadcrumbItem>
        </Breadcrumb>
        <div className="device-meta">
          <div className="info">
            <div className="title">设备总数</div>
            <div className="content amount">{totalCount}</div>
          </div>
          <div className="info has-border">
            <div className="title ">当前可用设备
            </div>
            <div className="content available">{freeCount}</div>
          </div>
          <div className="info">
            <div className="title">正在使用设备</div>
            <div className="content using">{usingCount}</div>
          </div>
        </div>
        <div className="device-block">
          <Row gutter={24}>

            {deviceList.map((item, index) => {
              const title = `${item.manufacturer} ${item.model}`
              return (
                <Col span={8} key={index}>
                  <div className="device-card">
                    <div className="device-info">
                      <div className="device-brand">
                        <img src={item.iconPath} alt="" onError={(e) => {
                          e.target.onerror = null
                          e.target.src = phoneBrandImage
                        }}/>
                      </div>
                      <div className="device-detail-block">
                        <h4 className="device-name" title={title}>{title}</h4>
                        <p className="device-detail">版本：{item.version}</p>
                        <p className="device-detail">分辨率：{item.width}*{item.height}</p>
                        <p className="device-detail">使用次数：{item.totalUseQuantity}</p>
                        <Button type={item.status === 1 ? 'primary' : 'disable'} disabled={item.status !== 1}
                                size={'small'}
                                onClick={() => this.showModal(item)}
                        >申请使用</Button>
                      </div>

                    </div>
                    <div className={enumBlockStatusClass[item.status]}>
                      <p className='status-line'><span
                        className={enumStatusClass[item.status]}></span>{this.getStatus(item.status, item.userName, item.useTime)}
                      </p>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
          <div className="stf-pager-wrapper">
            <Pagination
              onChange={(e) => {this.onPaginationChange(e)}}
              size="small"
              total={totalCount}
              current={curPage}
              defaultPageSize={6}
              pageSize={6} showQuickJumper/>
          </div>
        </div>
      </div>)
  }
}

STFList = connect((state) => {
  return {
    projectId: state.projectId
  }
})(STFList)

export default STFList
