import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import BuildTestPackage from './BuildTestPackage'
import PipelinePackage from './PipelinePackage'

import { Breadcrumb, Tabs } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;
const TabPane = Tabs.TabPane;


class Package extends Component {
  componentWillMount() {
    console.log(this.props.projectId)
    window.localStorage.setItem('oldProjectId', this.props.projectId);
  }

  render() {
    return (
        <div>
          <Breadcrumb className="devops-breadcrumb">
            <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
            <BreadcrumbItem>安装包</BreadcrumbItem>
          </Breadcrumb>

          <Tabs type="card">
            <TabPane tab=" 提测包 " key="1">
              <BuildTestPackage projectId={this.props.projectId}></BuildTestPackage>
            </TabPane>
            <TabPane tab="流水线包" key="2">
              <PipelinePackage projectId={this.props.projectId}></PipelinePackage>
            </TabPane>
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
