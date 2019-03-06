import React, { Component } from 'react'
import { connect } from 'react-redux'
import './index.scss'

import {
  Breadcrumb,
  Card, Col, Row
} from 'antd'
import { Link } from 'react-router-dom'

const BreadcrumbItem = Breadcrumb.Item

class Performance extends Component {
  constructor (props) {
    super(props)

  }



  render () {

    return (
      <div className="performance">

        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>性能测试管理</BreadcrumbItem>
        </Breadcrumb>
        <Row gutter={16}>
          <Col span={8}>
            <Link to={'/performanceConfig/branch'}>
              <Card title="分支测试" bordered={false}>
                所有远程分支，任你选择，随时检测选定分支性能数据</Card>
            </Link>

          </Col>
          <Col span={8}>
            <Link to={'/performanceConfig/timer'}>
            <Card title="定时测试" bordered={false}>
              定时自动执行配置任务，一次配置，循环使用，简单、及时的搜集分支性能数据</Card>
            </Link>
          </Col>

        </Row>


      </div>
    )
  }
}

Performance = connect((state) => {
  return {
    projectId: state.project.projectId
  }
})(Performance)

export default Performance
