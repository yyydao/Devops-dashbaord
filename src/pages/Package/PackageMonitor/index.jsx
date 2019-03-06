import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {reqPost, reqGet} from '@/api/api'
import {
  Breadcrumb
} from 'antd'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;

class PackageMonitor extends Component {
  constructor() {
    super();
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>安装包</BreadcrumbItem>
          <BreadcrumbItem>包体监测</BreadcrumbItem>
        </Breadcrumb>
      </div>
    )
  }
}

PackageMonitor = connect((state) => {
  return {
    projectId: state.project.projectId
  }
})(PackageMonitor)

export default PackageMonitor

