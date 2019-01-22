import React, { Component } from 'react'
import { connect } from 'react-redux'
import Route from './router'
// import { setProjectId, setUserInfo,setLoginInfo } from '@/store/action'
// import { setProjectId } from '@/store/actions/project'
// import { setUserInfo } from '@/store/actions/login'

class App extends Component {
  componentWillMount () {
    // let projectId = localStorage.getItem('projectId')
    // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // this.props.setProjectId(projectId)
    // this.props.setUserInfo(userInfo)
  }
  render () {
    return (
      <Route/>
    )
  }
}
//
// export default connect(state => {
//   return {}
// }, { setProjectId, setUserInfo,setLoginInfo })(App)//
// export default connect(state => {
//   return {}
// }, { setProjectId, setUserInfo })(App)

export default App
