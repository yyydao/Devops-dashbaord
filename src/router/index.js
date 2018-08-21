import React, {Component} from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import Layout from '../container/Layout'

export default class RouteConfig extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route
            path="/"
            component={Layout}
          />
        </Switch>
      </HashRouter>
    )
  }
}