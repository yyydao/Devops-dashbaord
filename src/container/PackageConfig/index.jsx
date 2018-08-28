// 包管理配置页面
import React, {Component} from 'react'
import qs from 'qs'
import {connect} from 'react-redux'
import {setPackageId} from '@/store/system/action'
import {Form} from 'antd';

import "./index.scss"
import PlatformPart from './PlatformPart'
import EnvPart from './envPart'

class ConfigManager extends Component {
  // 获取平台列表
  async componentWillMount() {
    // 获取当前选中平台id 因为从包管理首页进来该路由 会在query带上platformId
    let parsed = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
    let id = parsed.platformId;

    /*
     * 通过redux保存包管理id  其它相关组件会在平台id修改时调用获取相关接口获取数据
     * */
    if (id) {
      this.props.setPackageId(id);
    }
  }

  render() {
    return (
      <div id="configManager">
        <PlatformPart history={this.props.history}/>
        <EnvPart/>
      </div>
    )
  }
}

const WrappedConfigManager = Form.create()(ConfigManager);
export default connect(null, {setPackageId})(WrappedConfigManager);
