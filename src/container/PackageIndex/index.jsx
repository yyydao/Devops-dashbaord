import React, {Component} from 'react'
import {platformList} from '@/api/package/platform'
import {envList} from '@/api/package/env'
import Platform from '@/components/Platform'

class PackageConfig extends Component {

  constructor() {
    super()
    this.state = {
      platformList: []  // 平台列表
    }
  }

  componentWillMount() {
    // 获取平台列表
    platformList().then(async (response) => {
      if (parseInt(response.data.code,10) === 0) {
        let data = response.data.data;
        for (let i = 0; i < data.length; i++) {
          let envResponse = await envList({platformId: data[i].id});
          data[i].envData = envResponse.data.data;
        }
        this.setState({
          platformList: data
        })
      }
    })
  }


  render() {
    let {platformList} = this.state;
    return (
      <div id="package-index">
        <Platform
          platformList={platformList}
          type="packageConfig"
          history={this.props.history}
        />
      </div>
    )
  }
}

export default PackageConfig