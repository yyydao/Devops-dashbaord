import React, {Component} from 'react'
import {projectList} from '@/api/performance/project'
import Platform from '@/components/Platform'

class PerformanceIndex extends Component {
  constructor() {
    super();
    this.state = {
      projectList: [] // 项目列表
    }
  }

  componentWillMount() {
    // 获取平台列表
    projectList().then(async (response) => {
      if (parseInt(response.data.code, 10) === 0) {
        let data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          /**
           *  name设置为测试环境 是因为性能测试平台现在没有环境这个概念
           *  接口都是直接于平台projectId关联
           *  为了风格与包管理一致 这里用测试环境显示 真实情况并无意义
           */
          data[i].envData = [{id: data[i].id, name: '测试环境'}];
        }
        this.setState({
          projectList: data
        })
      }
    })
  }

  render() {
    let {projectList} = this.state;
    return (
      <div id="performance-index">
        <Platform platformList={projectList} type="performanceConfig" history={this.props.history}/>
      </div>
    )
  }
}

export default PerformanceIndex