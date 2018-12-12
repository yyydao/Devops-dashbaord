import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Icon, Row, Col,Avatar } from 'antd'
import './index.scss'

const MenuItem = Menu.Item

class Header extends Component {

  render () {
    let { userInfo,showSideBar } = this.props
    console.log(this.props)
    const menu = <Menu>
      <MenuItem key="account"><Link to="/personal"><Icon type="user" style={{
        minWidth: 12,
        marginRight: 8
      }}/>账户信息</Link></MenuItem>
      <MenuItem key="logot"><a href="/devops/loginOut"><Icon type="logout" style={{ minWidth: 12, marginRight: 8 }}/>退出</a></MenuItem>
    </Menu>

    return (
      <div className={showSideBar? "devops-header showSideBar":  "devops-header hideSideBar"}>
        <Row>
          <Col span={12}>
            <div className="platform-name">
              <Link to="/home">
                <img src={require('@/assets/favicon.ico')} width={40} height={40} alt="DevOps平台"/>
                <span>DevOps平台</span>
              </Link>
            </div>
          </Col>
          <Col span={12} type="flex" justify="end"  align="middle">
            <div className="userinfo">
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
