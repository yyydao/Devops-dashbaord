import React, {Component} from 'react'
import {Icon, Button} from 'antd'
import './index.scss'

class Platform extends Component {

  // 进入包列表
  toPackageList(envId, platformName, envName) {
    // 判断是包管理还是性能测试
    if (this.props.type === 'performanceConfig') {
      this.props.history.push(`/performanceTest?projectId=${envId}`);
    } else {
      this.props.history.push(`/packageManager?envId=${envId}&platformName=${platformName}&envName=${envName}`);
    }
  }

  // 进入配置管理列表
  toConfigManager(id) {
    let type = this.props.type;
    this.props.history.push(`/${type}?platformId=${id}`);
  }

  render() {
    let platformList = this.props.platformList;
    return (
      <div id="platform">
        <article>
          {
            platformList.map((item, index) => (
                <section className="platform-container" key={index}>
                  <div className="title">
                    <span className="platform-name">{item.name}</span>
                    <Icon type="setting" className="icon-forward" onClick={this.toConfigManager.bind(this, item.id)}/>
                  </div>
                  <div className="env-list-container">
                    {
                      item.envData && item.envData.map((envItem, envIndex) => (
                        <Button
                          type="primary"
                          size="large"
                          key={envIndex}
                          onClick={this.toPackageList.bind(this, envItem.id, item.name, envItem.name,)}>
                          {envItem.name}
                        </Button>
                      ))
                    }
                  </div>
                </section>
              )
            )
          }
        </article>
      </div>
    )
  }
}

export default Platform;