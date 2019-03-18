import React, { Component } from 'react'
import { connect } from 'react-redux'
import './index.scss'

import {
  Breadcrumb, Card, Col, Row,
} from 'antd'
import { Link } from 'react-router-dom'

const BreadcrumbItem = Breadcrumb.Item

class PerformanceIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      projectId: props.projectId,
    }
  }

  render () {
    return (
      <div className="performance">

        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>性能测试管理</BreadcrumbItem>
        </Breadcrumb>
        <main className='performance-index-main'>
        <Row gutter={24} type='flex'>
          <Col>
            <Link to={'/performanceConfig/branch'}>
              <Card  style={{ width: 364 }}
                title={<span><img className={'title-icon'} src={require('@/assets/img/test_icon.png')} alt=""/>分支测试</span>} bordered={false}>
                所有远程分支，任你选择，随时检测选定分支性能数据</Card>
            </Link>

          </Col>
          {/*@todo:下个版本再开放*/}
          {/*<Col>*/}
            {/*<Link to={'/performanceConfig/timer'}>*/}
              {/*<Card   style={{ width: 364 }}*/}
                {/*title={<span><img className={'title-icon'} src={require('@/assets/img/time_test_icon.png')} alt=""/>定时测试</span>} bordered={false}>*/}
                {/*定时自动执行配置任务，一次配置，循环使用，简单、及时的搜集分支性能数据</Card>*/}
            {/*</Link>*/}
          {/*</Col>*/}
        </Row>
        </main>
      </div>
    )
  }
}

PerformanceIndex = connect((state) => {
  return {
    projectId: state.project.projectId,
    testBuildType: state.project.testBuildType
  }
})(PerformanceIndex)

export default PerformanceIndex
