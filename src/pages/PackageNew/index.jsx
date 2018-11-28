import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reqPost, reqGet } from '@/api/api' ;

import BuildTestPackage from './BuildTestPackage'
import { Breadcrumb, Card, Tabs } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;
const TabPane = Tabs.TabPane;


class Package extends Component {
  constructor(props) {
    super(props);

    this.state = {
      envList: []
    }
  }

  getEnvList = () => {
    reqGet('/env/list', {
      projectId: this.props.projectId,
      categoryId: 0
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          envList: res.data
        })

        const envList = res.data.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            passwdBuild: item.passwdBuild
          }
        })

        window.localStorage.setItem('envList', JSON.stringify(envList));
      }
    })
  }

  componentWillMount() {
    window.localStorage.setItem('oldProjectId', this.props.projectId);
  }

  componentDidMount() {
    this.getEnvList()
  }

  render() {
    const { envList } = this.state;

    return (
        <div>
          <Breadcrumb className="devops-breadcrumb">
            <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
            <BreadcrumbItem>安装包</BreadcrumbItem>
          </Breadcrumb>

          <Tabs type="card">
            <TabPane tab=" 提测包 " key="1">
              <BuildTestPackage></BuildTestPackage>
            </TabPane>
            <TabPane tab="流水线包" key="2">Content of Tab Pane 2</TabPane>
          </Tabs>
        </div>
    )
  }
}

Package = connect((state) => {
  return {
    projectId: state.projectId
  }
})(Package);

export default Package;
