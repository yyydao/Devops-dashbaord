import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Icon, Select, message, } from 'antd'

import { reqPost } from '@/api/api'
import { setPermissionList, setProjectId } from '@/store/action'

//SVG ICON
import DashboardSvg from '@/assets/svg/nav_icon_dashboard_default.svg'
import PipelineSvg from '@/assets/svg/nav_icon_pipeline_default.svg'
import TestSvg from '@/assets/svg/nav_icon_test_default.svg'
import PackagekSvg from '@/assets/svg/nav_icon_package_default.svg'
import SettingSvg from '@/assets/svg/nav_icon_set_default.svg'
import iOSSvg from '@/assets/svg/nav_icon_ios.svg'
import AndroidSvg from '@/assets/svg/nav_icon_android.svg'

import './index.scss'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item
const Option = Select.Option

const MenuIcon = {
  '仪表盘': () => <DashboardSvg/>,
  '流水线': () => <PipelineSvg/>,
  '测试': () => <TestSvg/>,
  '安装包': () => <PackagekSvg/>,
  '项目设置': () => <SettingSvg/>
}

const ProjectTypeIcon = {
  'iOS': () => <iOSSvg/>,
  'android': () => <AndroidSvg/>
}

class SideBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      menuList: [],
      projectList: [],
      currentMenu: '',
      defaultCurrentMenu: [],
      menuOpenKeys: []
    }
  }

  componentWillMount () {
    this.getPermissionList()
    this.getProjectList()

    const currentMenu = sessionStorage.getItem('currentMenu')
    const defaultCurrentMenu = sessionStorage.getItem('defaultCurrentMenu')
    const menuOpenKeys = JSON.parse(sessionStorage.getItem('menuOpenKeys'))
    const { pathName } = this.props
    if (currentMenu && pathName.indexOf('welcome') === -1) {
      // this.setState({ currentMenu });
    }
    if (menuOpenKeys && pathName.indexOf('welcome') === -1) {
      // this.setState({ menuOpenKeys });
    }
    if (defaultCurrentMenu && pathName.indexOf('welcome') === -1) {
      // this.setState({ defaultCurrentMenu });
    }
  }

  componentWillUnmount () {
    this.props.setProjectId(null)
    this.setState({
      defaultCurrentMenu: [],
      currentMenu: '',
      menuOpenKeys: []
    })
  }

  selectChange = (value) => {
    console.log('change select type')
    sessionStorage.clear()
    this.props.setProjectId(value)
    this.props.projectIdChange(value)
    const currentMenu = sessionStorage.getItem('currentMenu')
    const menuOpenKeys = JSON.parse(sessionStorage.getItem('menuOpenKeys'))
    this.setState({ currentMenu })
    this.setState({ menuOpenKeys })
    this.getPermissionList()
  }

  menuClick = (e) => {
    sessionStorage.setItem('currentMenu', e.key)
    this.setState({ currentMenu: e.key })
  }

  menuOpenChange = (openKeys) => {
    sessionStorage.setItem('menuOpenKeys', JSON.stringify(openKeys))
  }

  getPermissionList () {
    let { setPermissionList } = this.props

    reqPost('/permission/list').then(res => {
      if (parseInt(res.code, 0) === 0) {

        setPermissionList(res.data.permissionList)
        const menuList = this.getMenuList(res.data.menuList)
        this.setState({ menuList })
        if (menuList && menuList.length > 0) {
          this.setState({ defaultCurrentMenu: [menuList[0].key] })
        }
        if (this.props.pathName.indexOf('dashboard') > -1) {
          this.setState({ currentMenu: menuList[0].key })
        }
      } else {
        message.error(res.msg)
      }
    })
  }

  getMenuList (menuObj) {
    let menuList = []
    for (let item of menuObj) {
      let list = []
      if (item.children) {
        list.push(this.getMenuList(item.children))
        menuList.push(
          <SubMenu key={`sub${item.id}`}
                   title={<span><Icon style={{fontSize: '16px'}} component={MenuIcon[item.name]}/><span>{item.name}</span></span>}>
            {list}
          </SubMenu>
        )
      } else {
        menuList.push(
          <MenuItem key={item.id}>
            <Link to={item.urls}><Icon style={{fontSize: '16px'}}  component={MenuIcon[item.name]}/>{item.name}</Link>
          </MenuItem>
        )
      }
    }

    return menuList
  }

  getProjectList () {
    reqPost('/project/listProjectByUser', {
      pageSize: 1024,
      pageNum: 1,
      projectName: ''
    }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        let list = []
        for (let item of res.data) {
          let icon = ''
          if (item.id === 62) {icon = <Icon style={{paddingRight: '10px'}} component={iOSSvg}/> }
          if (item.id === 63) {icon = <Icon style={{paddingRight: '10px',fontSize:'18px'}} component={AndroidSvg}/> }
          list.push({
            icon: icon,
            id: item.id,
            name: item.name
          })
        }
        this.setState({ projectList: list })
      }
    })
  }

  render () {
    const { menuList, projectList, currentMenu, menuOpenKeys, defaultCurrentMenu } = this.state
    const { projectId } = this.props

    return (
      <div className="menu-side-bar">
        <div className="dropdown-link">
          {
            projectId && <div className="dropdown-select-wrapper">
            <Select defaultValue={projectId} className="dropdown-select" onChange={this.selectChange}>
              {
                projectList.map((item) => {
                  return <Option key={item.id}><span className="icon">{item.icon}</span><span className="project">{item.name}</span></Option>
                })
              }
            </Select>
            </div>
          }
        </div>
        <Menu mode="inline" selectedKeys={[currentMenu]} theme="dark" onClick={this.menuClick}
              onOpenChange={this.menuOpenChange}
              defaultSelectedKeys={defaultCurrentMenu} defaultOpenKeys={menuOpenKeys}>
          {menuList}
        </Menu>
        <div style={{
          color: 'rgba(255,255,255,0.65)',
          textAlign: 'left',
          position: 'absolute',
          width: '100%',
          left: '24px',
          bottom: '16px'
        }}>
          版本：V{process.env.VERSION}
        </div>
      </div>
    )
  }
}

export default connect(state => {
  return {
    projectId: state.projectId
  }
}, { setPermissionList, setProjectId })(SideBar)
