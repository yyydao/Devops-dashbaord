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
// import { setToken, setUserInfo, setProjectId } from '@/store/action'
import { fetchProfile, logout, getToken } from '@/store/actions/auth'
import { getQueryString } from '@/utils/utils'

class Layout extends Component {
  constructor (props) {
    console.log(props)
    super(props)
    this.state = {
      token: null,
      excludeSideBar: [],
      routeList: null,
      userInfo: null,
      isRender: true
    }
  }

  componentWillMount () {
    // let { setToken } = this.props
    // const token = getQueryString('token')
    // this.setState({ token: token })
    // setToken(token)
    // this.props.getToken().then(res=>console.log(res))
    const parsedHash = qs.parse(this.props.location.search.slice(1))
    console.log(parsedHash)
    //@todo:projectID
    if (parsedHash.project) {
      localStorage.setItem('projectId', parsedHash.project)
      this.props.setProjectId(parsedHash.project)
    }
    this.getRouteList()
    this.getExcludeSideBarPath()
    this.getUserInfo()
  }

  projectIdChange = (value) => {
    this.setState({ isRender: false }, () => {
      this.setState({ isRender: true })
      this.props.history.replace(`/dashboard/${value}`)
    })
  }

  getExcludeSideBarPath = () => {
    const excludeSideBar = []

    Routers.forEach((item) => {
      if (item.hideSideBar) {
        excludeSideBar.push(item.path)
      }
    })

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
    // let { setUserInfo } = this.props
    //
    reqPost('/user/getUserInfo').then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.setState({ userInfo: res.data })
        // setUserInfo(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }

  render () {
    console.log(`Layout/index.jsx render`)
    console.log(this.state)
    if (!this.state.token) {
      // window.location.href = '#/login';
    }

    const sideBarShow = !this.state.excludeSideBar.includes(this.props.location.pathname)

    return (
      <div className="layout">
        <Header userInfo={this.state.userInfo} showSideBar={sideBarShow}/>

        {sideBarShow && <SideBar projectIdChange={this.projectIdChange} pathName={this.props.location.pathname}/>}

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
  const { auth, menu } = state
  return {
    auth: auth ? auth : null,
    navpath: menu.navpath
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fetchProfile: bindActionCreators(fetchProfile, dispatch),
    logout:bindActionCreators(logout, dispatch),
    getToken:bindActionCreators(getToken, dispatch),
  }
}

//
// export default connect(state => {
//   return {
//     projectId: state.projectId
//   }
// }, { setToken, setUserInfo, setProjectId })(Layout)
export default connect(mapStateToProps, mapDispatchToProps)(Layout)
