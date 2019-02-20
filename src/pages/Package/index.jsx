import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import qs from 'qs'

import BuildTestPackage from './BuildTestPackage'
import PipelinePackage from './PipelinePackage'

import { Breadcrumb, Tabs } from 'antd'

const BreadcrumbItem = Breadcrumb.Item
const TabPane = Tabs.TabPane

class Package extends Component {
  constructor(){
    super();
    this.state ={
      tapdID:'',
      buildId:'',
      version:'',
      envID:''
    }
  }
  componentWillMount () {
    let data = this.props.location.query;
    const parsedHash = qs.parse(this.props.location.search.slice(1))
    if(data){
      let {tapdID} = data;
      this.setState({tapdID})
    }
    if(parsedHash.version){
      this.setState({version:parseInt(parsedHash.version,0)})
    }
    if(parsedHash.buildId){
      this.setState({buildId:parseInt(parsedHash.buildId,0)})
    }
    if(parsedHash.envID){
      this.setState({envID:parseInt(parsedHash.envID,0)})
    }
  }

  render () {
    const {buildId,tapdID,version,envID} =this.state
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>安装包</BreadcrumbItem>
        </Breadcrumb>

        <div className="devops-main-wrapper">
          <Tabs className="package-tab">
            <TabPane tab=" 提测包 " key="1">
              <BuildTestPackage
                projectId={this.props.projectId}
                tapdID={tapdID}
                buildId={buildId}
                version={version}
                envID={envID}
              />
            </TabPane>
            <TabPane tab="流水线包" key="2">
              <PipelinePackage projectId={this.props.projectId}/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

Package = connect((state) => {
  return {
    projectId: state.project.projectId
  }
})(Package)

export default Package
