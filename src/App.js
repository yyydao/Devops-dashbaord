import React, { Component } from 'react'
import { connect } from 'react-redux'
import Route from './router'

import { setProjectId, setUserInfo } from '@/store/action'

class App extends Component {
  componentWillMount () {
    const projectId = localStorage.getItem('projectId')
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
