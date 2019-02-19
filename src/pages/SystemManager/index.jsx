import React, { Component } from 'react'
import {Menu, message } from 'antd'

import { reqGet } from '@/api/api'
import './index.scss'

import MenuManager from '@/pages/SystemManager/MenuManager'
import RoleManager from '@/pages/SystemManager/RoleManager'
import UserManager from '@/pages/SystemManager/UserManager'
import FilterManager from '@/pages/SystemManager/FilterManager'

const { Item } = Menu

const childrenMap = {
  '/menuManager': <MenuManager></MenuManager>,
  '/roleManager': <RoleManager/>,
  '/userManager': <UserManager/>,
  '/filterManager': <FilterManager/>,
}

class SystemManager extends Component {
  constructor (props) {
    super(props)
    this.state = {
      defaultCurrentMenu: [],
      mode: 'inline',
      menuList: [],
      children: null,
      selectKey:'/userManager'
    }
  }

  componentWillMount () {
    this.getMenu()
  }

  async getMenu () {
    let menuList = []
    const res = await reqGet('/sys/menu/system/menus')
    if (res.code === 0) {
      const list = res.menuList
      for (let item of list) {
        menuList.push(
          <Item key={item.url}>
            {item.name}
          </Item>
        )
      }
      this.setState({ menuList }, () => {
        this.setState({
          children: <UserManager/>
        })
      })
    } else {
      message.error(res.msg)
    }
  }

  getRightTitle = () => {
    const { selectKey, menuList } = this.state
    return menuList[selectKey]
  }

  selectKey = ({ key }) => {
    let childre = null
    this.setState({
      selectKey: key,
    }, () => {
      childre = childrenMap[key]
      this.setState({
        children: childre
      })
    })
  }

  render () {
    const { mode, selectKey, menuList, children} = this.state

    return (
      <div className="system-manager-layout">
        <div
          className="systemManager-main"
          ref={ref => {
            this.main = ref
          }}
        >
          <div className="systemManager-leftMenu">
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              defaultSelectedKeys={['1']}
              onClick={this.selectKey}>
              {menuList}
            </Menu>
          </div>
          <div className="systemManager-right">
            <div className="systemManager-title">{this.getRightTitle()}</div>
            <React.Fragment>
              {children}
            </React.Fragment>
          </div>
        </div>
      </div>
    )
  }
}

export default SystemManager
