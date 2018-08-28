import React, {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {Layout, Menu, Icon, Tag} from 'antd';

import Index from '../Index'
import Package from '../Package'
import Detail from '../Detail'
import PackageIndex from '../PackageIndex'
import PerformanceIndex from '../PerformanceIndex'
import PackageConfig from '../PackageConfig'
import PerformanceTest from '../PerformanceTest'
import PerformanceConfig from '../PerformanceConfig'
import Setting from '../Setting'

import "./index.scss"
import screenfull from 'screenfull'

const {Header, Content, Sider} = Layout;

class TDLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabColor: ["#2db7f5", "#87d068", "#108ee9", "#13c2c2"],
      path: [
        {
          key: "home",
          name: "主页"
        },
        {
          key: 'package',
          name: '包管理'
        },
        {
          key: 'performance',
          name: '性能测试'
        },
        {
          key: 'setting',
          name: '设置'
        }
      ]
    }
  }

  // 全屏
  screenFull() {
    if (screenfull.enabled) {
      screenfull.request();
    }
  }

  // 菜单选择
  menuSelect(item) {
    this.props.history.push(item.key);
  }

  // tab点击
  tabClick(index) {
    let {path} = this.state;
    this.props.history.push(path[index].key);
  }


  render() {
    let {tabColor} = this.state;
    let {path} = this.state;
    return (
      <Layout style={{minHeight: '100vh'}}>
        <Header>
          <div className="header-container">
            <div style={{display: 'inline-block'}}>
              <img src={require("../../assets/favicon.ico")} alt="" width={40} height={40}/>
              <span
                style={{color: '#fff', fontSize: '20px', verticalAlign: 'middle', marginLeft: '20px'}}>DevOps平台</span>
            </div>
            <Icon type="arrows-alt" className="full-screen" onClick={this.screenFull.bind(this)}/>
          </div>
        </Header>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              theme="dark"
              selectedKeys={this.state.selectedKeys}
              onSelect={this.menuSelect.bind(this)}
              style={{height: '100%', borderRight: 0}}
            >
              <Menu.Item key="/index">
                <Icon type="home"/>
                <span>主页</span>
              </Menu.Item>
              <Menu.Item key="/package">
                <Icon type="folder-open"/>
                <span>包管理</span>
              </Menu.Item>
              <Menu.Item key="/performance">
                <Icon type="compass"/>
                <span>性能测试</span>
              </Menu.Item>
              <Menu.Item key="/Setting">
                <Icon type="setting"/>
                <span>设置</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{padding: '0 24px 24px'}}>
            {
              <div style={{margin: '10px 0 10px 0'}}>
                {
                  path.map((item, index) => (
                    <Tag
                      key={index}
                      color={tabColor[index]}
                      onClick={this.tabClick.bind(this, index)}
                    >{item.name}
                    </Tag>
                  ))
                }
              </div>
            }
            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
              {/*路由配置*/}
              <Switch>
                <Route path='/home' component={Index}/>
                <Route path='/package' component={PackageIndex}/>
                <Route path='/performance' component={PerformanceIndex}/>
                <Route path='/packageConfig' component={PackageConfig}/>
                <Route path='/packageManager' component={Package}/>
                <Route path='/detail' component={Detail}/>
                <Route path='/performanceTest' component={PerformanceTest}/>
                <Route path='/setting' component={Setting}/>
                <Route path='/performanceConfig' component={PerformanceConfig}/>
                <Redirect to="home"/>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default TDLayout