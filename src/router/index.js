import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Layout from '../pages/Layout';

export default class RouteConfig extends Component{

	render(){
		return(
			<Router>
				<Switch>
					<Route path="/" component={Layout}></Route>
				</Switch>
			</Router>
		)
	}
}