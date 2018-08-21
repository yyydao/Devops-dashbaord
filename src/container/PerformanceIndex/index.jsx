import React, {Component} from 'react'
import {projectList} from '@/api/performance/project'
import Platform from '@/components/Platform'

class PerformanceIndex extends Component {
  constructor() {
    super();
    this.state = {
      projectList: []
    }
  }

  componentWillMount() {
    // 获取平台列表
    projectList().then(async (response) => {
      if (parseInt(response.data.code) === 0) {
        let data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          data[i].envData = [{id: data[i].id, name: '测试环境'}];
        }
        this.setState({
          projectList: data
        })
      }
    })
  }



  render() {
    let projectList = this.state.projectList;
    return (
      <div id="performance-index">
        <Platform platformList={projectList} type="performanceConfig" history={this.props.history}/>
      </div>
    )
  }
}

export default PerformanceIndex