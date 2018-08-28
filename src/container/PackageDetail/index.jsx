import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom'
import SuccessDetail from '../Package/SuccessDetail'
import FailureDetail from '../Package/FailureDetail'
import UnFinishDetail from '../Package/UnFinishDetail'
import "./index.scss"

class PackageDetail extends Component {

  render() {
    return (
      <div id="detail">
        <Switch>
          <Route path='/detail/successDetail' component={SuccessDetail}/>
          <Route path='/detail/failureDetail' component={FailureDetail}/>
          <Route path='/detail/unFinishDetail' component={UnFinishDetail}/>
        </Switch>
      </div>
    )
  }
}

export default PackageDetail;