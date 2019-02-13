import React, { Component } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Layout from '../pages/Layout'
import Login from '../pages/Login'
import ForgetPassword  from '@/pages/ForgetPassword'
import Register from '../pages/Register'

export default class RouteConfig extends Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/ForgetPassword" component={ForgetPassword}/>
          <Route path="/" component={Layout}/>
        </Switch>
      </Router>
    )
  }
}
