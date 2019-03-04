import React, { Component } from 'react'
import Route from './router'
// import { connect } from 'react-redux'
// import { setProjectId, setUserInfo,setLoginInfo } from '@/store/action'
// import { setProjectId } from '@/store/actions/project'
// import { setUserInfo } from '@/store/actions/login'

class App extends Component {
  componentWillMount () {
    console.log(`Devops    
Build Version：${process.env.COMMIT_HASH}`)
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
