import React, { Component } from 'react'
import { connect } from 'react-redux'
import Route from './router'
import qs from 'qs'
import getQueryString from './utils'
import { setProjectId, setUserInfo } from '@/store/action'

class App extends Component {
  componentWillMount () {
    let projectId = localStorage.getItem('projectId')
    const parsedHash = qs.parse(window.location.search.slice(1))
    if(parsedHash.project){
      projectId=parsedHash.project
      localStorage.setItem('projectId',projectId)
    }
    console.log(projectId)
    console.log(parsedHash)
    console.log(getQueryString('project'))
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.props.setProjectId(projectId)
    this.props.setUserInfo(userInfo)
  }

  render () {
    return (
      <Route/>
    )
  }
}

export default connect(state => {
  return {}
}, { setProjectId, setUserInfo })(App)
