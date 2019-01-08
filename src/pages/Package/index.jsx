import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import qs from 'qs'
import { setProjectId } from '@/store/action'

import BuildTestPackage from './BuildTestPackage'
import PipelinePackage from './PipelinePackage'

import { Breadcrumb, Tabs } from 'antd'

const BreadcrumbItem = Breadcrumb.Item
const TabPane = Tabs.TabPane

class Package extends Component {
  constructor(){
    super();
    this.state ={
      tapdID:''
    }
  }
  componentWillMount () {
    let data = this.props.location.query;
    const parsedHash = qs.parse(this.props.location.search.slice(1))
    if(parsedHash.project){
      localStorage.setItem("projectId",parsedHash.project)
      this.props.setProjectId(parsedHash.project)
    }
    if(data){
      let {tapdID} = data;
      this.setState({tapdID})
    }
  }

  render () {
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>安装包</BreadcrumbItem>
        </Breadcrumb>

        <div className="devops-main-wrapper">
          <Tabs className="package-tab">
            <TabPane tab=" 提测包 " key="1">
              <BuildTestPackage projectId={this.props.projectId} tapdID={this.state.tapdID}></BuildTestPackage>
            </TabPane>
            <TabPane tab="流水线包" key="2">
              <PipelinePackage projectId={this.props.projectId}></PipelinePackage>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

Package = connect((state) => {
  return {
    projectId: state.projectId
  }
},{setProjectId})(Package)

export default Package
