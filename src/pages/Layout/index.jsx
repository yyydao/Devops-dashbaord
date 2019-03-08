import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Switch, Route } from 'react-router-dom'
import { message } from 'antd'
import qs from 'qs'

import Header from '@/components/Header'
import SideBar from '@/components/SideBar'
import Routers from '@/router/routerMap'
import { reqPost } from '@/api/api'
import { fetchProfile, logout, setToken,setUserInfo } from '@/store/actions/auth'
import { setProjectId,setPlatform } from '@/store/actions/project'

class Layout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      projectId: null,
      token: null,
      excludeSideBar: [],
      routeList: null,
      userInfo: null,
      isRender: true
    }
  }

  componentWillMount () {
    const token = window.localStorage.getItem('token')
    const projectId = window.localStorage.getItem('projectId')
    const platformString = window.localStorage.getItem('platform')
    const parsedHash = qs.parse(this.props.location.search.slice(1))
    if(token !== null){
      this.props.setToken(token)
    }else{
      console.log('no token')
    }
    if(projectId !== 'undefined' || projectId !== null){
      this.props.setProjectId(projectId)
    }
    if(platformString !== 'undefined' && platformString !==null){
      this.props.setPlatform(platformString)
    }

    if (parsedHash.project) {
      localStorage.setItem('projectId', parsedHash.project)
      this.props.setProjectId(parsedHash.project)
    }
    this.getRouteList()
    this.getExcludeSideBarPath()
    this.getUserInfo()
  }

  componentWillReceiveProps (nextProps) {
      this.setState({userInfo:nextProps.userInfo})
  }

  /**
   * sidebar改变项目时
   * @param value
   */
  projectIdChange = (value,platformNumber) => {
    this.setState({ isRender: false }, () => {
      this.setState({ isRender: true })
      this.props.history.replace({
        pathname:`/dashboard/${value}`,
        state: { platform: `${platformNumber}`}
      })
    })
  }

  /**
   * sidebar改变项目时并更新平台信息记录
   * @param value
   */
  platFormChange = (value) => {
    this.props.setPlatform(value)
  }

  getExcludeSideBarPath = () => {
    const excludeSideBar = []

    Routers.forEach((item) => {
      if (item.hideSideBar) {
        excludeSideBar.push(item.path)
      }
    })
    //@todo:后台配置
    excludeSideBar.push('/system/systemManager')
    excludeSideBar.push('/system/filterManager')
    excludeSideBar.push('/system/userManager')
    excludeSideBar.push('/system/roleManager')
    excludeSideBar.push('/system/menuManager')
    this.setState({ excludeSideBar })
  }

  getRouteList = () => {
    this.setState({
      routeList: Routers.map((item, index) => {
        return <Route exact key={index} path={item.path} component={item.component}/>
      })
    })
  }

  getUserInfo = () => {
    //
    reqPost('/sys/user/getUserInfo').then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.setState({ userInfo: res.user })
        this.props.setUserInfo(res.user)
      } else {
        message.error(res.msg)
      }
    })
  }

  render () {
    // if (!this.state.token) {
      // window.location.href = '#/login';
    // }

    const sideBarShow = !this.state.excludeSideBar.includes(this.props.location.pathname)

    return (
      <div className="layout">
        <Header userInfo={this.state.userInfo} showSideBar={sideBarShow}/>

        {sideBarShow && <SideBar projectIdChange={this.projectIdChange}
                                 platFormChange={this.platFormChange}
                                 pathName={this.props.location.pathname}/>}

        {
          this.state.isRender && <div className={sideBarShow ? 'main-container' : 'index-container'}>
            <Switch>
              {this.state.routeList}
            </Switch>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { auth,project } = state
  if (auth.token && project.projectId) {
    return {
      userInfo:JSON.parse(JSON.stringify(auth.userInfo)),
      token: auth.token,
      projectId: project.projectId,
      platform:project.platform
    }
  }

  return {
    userInfo:JSON.parse(JSON.stringify(auth.userInfo)),
    auth: null,
    projectId: null,
    platform:null
  }
}

const mapDispatchToProps = (dispatch) =>{
  return {
    fetchProfile: bindActionCreators(fetchProfile, dispatch),
    logout: bindActionCreators(logout, dispatch),
    setToken: bindActionCreators(setToken, dispatch),
    setProjectId: bindActionCreators(setProjectId, dispatch),
    setPlatform: bindActionCreators(setPlatform, dispatch),
    setUserInfo:bindActionCreators(setUserInfo,dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
