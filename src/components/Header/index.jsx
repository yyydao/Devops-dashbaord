import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Icon, Row, Col, Avatar, Popover, Divider,message } from 'antd'
import './index.scss'

import {reqGet} from '@/api/api'

const MenuItem = Menu.Item

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userInfo:{}
    }
  }
  propTypes: {
    userInfo: PropTypes.object.isRequired,
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.userInfo!== undefined){
      this.setState({userInfo:nextProps.userInfo})
    }
  }
  logout = () => {
    reqGet('/sys/loginout').then(res => {
      if(parseInt(res.code, 0) === 0){
        localStorage.removeItem('token')
        localStorage.removeItem('projectId')
        window.location.href = '#/login'
      }else{
        message.error(res.msg);
      }
    })
  }

  render () {
    let { showSideBar } = this.props
    let { userInfo } = this.state
    let host = window.location.origin.indexOf('localhost') > -1 ? 'http://10.100.14.54:8090/' : window.location.origin
    let appQRcode = <div>
      <Row type="flex" style={{ width: '268px' }} align='middle' justify='center'>
        <Col span={12} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
          <img src={`${host}/version/getQRCode?platform=2`}
               style={{ width: 110, height: 110, display: 'inline-box' }} alt=""/>
          <p style={{ textAlign: 'center', marginTop: 8, color: '#000' }}>iOS下载</p>
        </Col>
        <Col span={12} style={{ verticalAlign: 'middle', textAlign: 'center' }}>
          <img src={`${host}/version/getQRCode?platform=1`}
               style={{ width: 110, height: 110, display: 'inline-box' }} alt=""/>

          <p style={{ textAlign: 'center', marginTop: 8, color: '#000' }}>Android下载</p>

        </Col>
      </Row>

    </div>
    const menu = <Menu>
      <MenuItem key="account"><Link to="/personal"><Icon type="user" style={{
        minWidth: 12,
        marginRight: 8
      }}/>账户信息</Link></MenuItem>
      <MenuItem key="logot"><a onClick={()=>
        this.logout()}><Icon type="logout" style={{ minWidth: 12, marginRight: 8 }}/>退出</a></MenuItem>
    </Menu>

    return (
      <div className={showSideBar ? 'devops-header showSideBar' : 'devops-header hideSideBar'}>
        <Row>
          <Col span={12}>
            <div className="platform-name">
              <Link to="/home">
                <img src={require('@/assets/favicon.ico')} width={32} height={32} alt="DevOps平台"/>
                <span>DevOps平台</span>
              </Link>
            </div>
          </Col>
          <Col span={12} type="flex" justify="end" align="middle">

            <div className="userinfo">
              {showSideBar === false &&
              <Popover placement="bottom" trigger="hover" content={appQRcode}>
                <Icon type="mobile"/> <span className='userName'>手机APP</span>
              </Popover>

              }
              {showSideBar === false &&
              <Divider style={{ margin: '0 24px' }} type="vertical"/>
              }

              <Avatar size={24} icon="user" className='headerAvatar'/>
              {
                userInfo && <Dropdown overlay={menu}>
                  {/*<Icon type="bars" style={{fontSize: 18}} />*/}
                  <span className='userName'>{userInfo.nickName}</span>
                </Dropdown>
              }

            </div>
          </Col>
        </Row>


      </div>
    )
  }
}

export default Header
