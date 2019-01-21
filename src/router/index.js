import React, { Component } from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Layout from '../pages/Layout'
import Login from '../pages/Login'
import Register from '../pages/Register'

export default class RouteConfig extends Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
          <Route path="/" component={Layout}/>
        </Switch>
      </Router>
    )
  }
}
