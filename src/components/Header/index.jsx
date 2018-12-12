import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Icon, Row, Col, Avatar, Popover, Divider } from 'antd'
import './index.scss'

const MenuItem = Menu.Item

class Header extends Component {

  render () {
    let { userInfo, showSideBar } = this.props
    let appQRcode = (type) => {
      return <div style={{ width: 170, margin: '0px 75px', position: 'relative' }}>
        {
          type === 'iOS' && <img src={`${window.location.origin}/version/getQRCode?platform=2`}
                                 style={{ width: 110, height: 110, display: 'inline-box' }} alt=""/>
        }
        {
          type === 'Android' && <img src={`${window.location.origin}/version/getQRCode?platform=1`}
                                     style={{ width: 110, height: 110, display: 'inline-box' }} alt=""/>
        }
        {!type &&
        <div className="qrCode-mask">
          <span>即将开放</span>
        </div>
        }
        <p style={{ textAlign: 'center', marginTop: 8, color: '#000' }}>【DevOps】{type}下载</p>
      </div>
    }
    console.log(this.props)
    const menu = <Menu>
      <MenuItem key="account"><Link to="/personal"><Icon type="user" style={{
        minWidth: 12,
        marginRight: 8
      }}/>账户信息</Link></MenuItem>
      <MenuItem key="logot"><a href="/devops/loginOut"><Icon type="logout" style={{ minWidth: 12, marginRight: 8 }}/>退出</a></MenuItem>
    </Menu>

    return (
      <div className={showSideBar ? 'devops-header showSideBar' : 'devops-header hideSideBar'}>
        <Row>
          <Col span={12}>
            <div className="platform-name">
              <Link to="/home">
                <img src={require('@/assets/favicon.ico')} width={40} height={40} alt="DevOps平台"/>
                <span>DevOps平台</span>
              </Link>
            </div>
          </Col>
          <Col span={12} type="flex" justify="end" align="middle">

            <div className="userinfo">
              {showSideBar === false &&
              <Popover placement="bottom" trigger="hover" content={<div>{appQRcode('iOS')}{appQRcode('Android')}</div>}>
                <Icon type="mobile"/> <span className='userName'>手机APP</span>
              </Popover>

              }
              {showSideBar === false &&
              <Divider style={{margin: '0 24px'}} type="vertical"/>
              }

              <Avatar size={24} icon="user" className='headerAvatar'/>
              {
                userInfo && <Dropdown overlay={menu}>
                  {/*<Icon type="bars" style={{fontSize: 18}} />*/}
                  <span className='userName'>{userInfo.name}</span>
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
