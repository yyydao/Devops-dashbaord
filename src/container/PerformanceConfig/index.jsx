import React, {Component} from 'react'
import qs from 'qs'
import {Form} from 'antd';

import {connect} from 'react-redux'
import {setPerformanceId} from '@/store/system/action'

import BranchPart from './BranchPart'
import ScreenPart from './ScreenPart'
import PlatformPart from './PlatformPart'

import "./index.scss"

class ConfigManager extends Component {
  constructor() {
    super();
    this.state = {
      platformId: '',          // 平台删除用到的id
    }
  }

  // 获取平台列表
  async componentWillMount() {
    // 获取当前选中平台id
    let parsed = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
    let id = parsed.platformId || '';

    if (id) {
      this.setState({
        platformId: id
      })
      this.props.setPerformanceId(id);
    }
  }


  render() {
    return (
      <div id="performance-config">
        {/*平台部分*/}
        <PlatformPart history={this.props.history}/>
        {/*场景列表部分*/}
        <ScreenPart/>
        {/*底部构建场景和分支部分*/}
        <BranchPart/>
      </div>
    )
  }
}

const WrappedConfigManager = Form.create()(ConfigManager);
export default connect(null, {setPerformanceId})(WrappedConfigManager);

