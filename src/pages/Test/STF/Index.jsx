import React, { Component } from 'react'
import { Breadcrumb, Row, Col, Button, Pagination, message, Select } from 'antd'
import { connect } from 'react-redux'
import { reqGet, reqPost } from '@/api/api'
import { Link } from 'react-router-dom'
import './index.scss'
import phoneBrandImage from '@/assets/img/VIVOX9i.png'

const BreadcrumbItem = Breadcrumb.Item

const enumStatusClass = {
  1:'status available',
  2:'status unavailable',
  3:'status unavailable',
  4:'status unavailable'
}

class STFList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      projectId: props.projectId,
      deviceList: []
    }
  }

  getStatus = (status,user,useTime_in_second) =>{
    const enumStatusContet = {
      1:'设备闲置，可申请试用',
      2:`${user}正在使用设备 (${useTime_in_second}_`,
      3:'',
      4:'设备断开连接'
    }

    return enumStatusContet[status]

  }

  /**
   * @desc 获取设备列表
   */
  async getDeviceList (page = 1) {
    const { projectId } = this.state
    const res = await reqGet('/stfDevices/devices', { projectId: projectId, page: page, limit: 6 })

    if (await res.code === 0) {
      res.data.pageData.list = [
        {
          "abi": "arm64-v8a",
          "model": "MIX",
          "serial": "66a91c01",
          "version": "8.0.0",
          "status": 1,
          "height": 2040,
          "width": 1080,
          "manufacturer": "XIAOMI",
          "totalUseQuantity": 0,
          "totalUseTime": 0,
          "userName": "",
          "iconPath": "/images/XIAOMIMIX.png",
          "useTime": 1
        },
        {
          "abi": "arm64-v8a",
          "model": "MIX",
          "serial": "66a91c01",
          "version": "8.0.0",
          "status": 4,
          "height": 2040,
          "width": 1080,
          "manufacturer": "XIAOMI",
          "totalUseQuantity": 0,
          "totalUseTime": 0,
          "userName": "",
          "iconPath": "/images/XIAOMIMIX.png",
          "useTime": 1
        },
        {
          "abi": "arm64-v8a",
          "model": "MIX",
          "serial": "66a91c01",
          "version": "8.0.0",
          "status": 4,
          "height": 2040,
          "width": 1080,
          "manufacturer": "XIAOMI",
          "totalUseQuantity": 0,
          "totalUseTime": 0,
          "userName": "",
          "iconPath": "/images/XIAOMIMIX.png",
          "useTime": 1
        },
        {
          "abi": "arm64-v8a",
          "model": "MIX",
          "serial": "66a91c01",
          "version": "8.0.0",
          "status": 4,
          "height": 2040,
          "width": 1080,
          "manufacturer": "XIAOMI",
          "totalUseQuantity": 0,
          "totalUseTime": 0,
          "userName": "",
          "iconPath": "/images/XIAOMIMIX.png",
          "useTime": 1
        },
        {
          "abi": "arm64-v8a",
          "model": "MIX",
          "serial": "66a91c01",
          "version": "8.0.0",
          "status": 4,
          "height": 2040,
          "width": 1080,
          "manufacturer": "XIAOMI",
          "totalUseQuantity": 0,
          "totalUseTime": 0,
          "userName": "",
          "iconPath": "/images/XIAOMIMIX.png",
          "useTime": 1
        },
        {
          "abi": "arm64-v8a",
          "model": "MIX",
          "serial": "66a91c01",
          "version": "8.0.0",
          "status": 4,
          "height": 2040,
          "width": 1080,
          "manufacturer": "XIAOMI",
          "totalUseQuantity": 0,
          "totalUseTime": 0,
          "userName": "",
          "iconPath": "/images/XIAOMIMIX.png",
          "useTime": 1
        }
      ]
      res.data && res.data.pageData && this.setState({
        deviceList: res.data.pageData.list,
      })
    } else {
      console.log(res)
      message.error(res.msg)
    }
  }

  async componentDidMount (): void {
    const { projectId } = this.state
    const res = await reqGet('/stfDevices/checkUserUseDevice', { projectId: projectId })
    const using = await res.code === 3
    console.log(using)
  }

  componentWillMount (): void {
    this.getDeviceList().then(res => {
      console.log(res)
    })
  }

  render () {
    const { totalCount, curPage, deviceList } = this.state

    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>云真机</BreadcrumbItem>
        </Breadcrumb>
        <div className="device-meta">
          <div className="info">
            <div className="title">设备总数</div>
            <div className="content amount">12</div>
          </div>
          <div className="info has-border">
            <div className="title ">当前可用设备
            </div>
            <div className="content available">3</div>
          </div>
          <div className="info">
            <div className="title">正在使用设备</div>
            <div className="content using">6</div>
          </div>
        </div>
        <div className="device-block">
          <Row gutter={24}>

            {deviceList.map((item, index) => {
              return (
                <Col span={8} key={index}>
                  <div className="device-card">
                    <div className="device-info">
                      <div className="device-brand">
                        <img src={item.iconPath} alt=""/>
                      </div>
                      <div className="device-detail-block">
                        <h4 className="device-name">{item.model}</h4>
                        <p className="device-detail">版本：{item.version}</p>
                        <p className="device-detail">分辨率：{item.width}*{item.height}</p>
                        <p className="device-detail">使用次数：{item.totalUseQuantity}</p>
                        <Button type={item.status === 1 ? 'primary' : 'disable'} disabled={item.status !== 1 } size={'small'}>申请使用</Button>
                      </div>

                    </div>
                    <div className="device-status">
                      <p className='status-line'><span className={enumStatusClass[item.status]}></span>{()=>this.getStatus(item.status,item.userName,item.useTime)}</p>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
          <Pagination size="small" total={50} showSizeChanger showQuickJumper/>
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
