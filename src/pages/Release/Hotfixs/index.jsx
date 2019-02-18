import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {reqPost, reqGet} from '@/api/api'
import {
  Breadcrumb,
  Card,
  Button,
  Icon
} from 'antd'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;

class Hotfixs extends Component {
  constructor() {
    super();
    this.state = {
      androidData: {},//分发数
    }
  }

  componentWillMount() {
  }

  render() {
    const {androidData} = this.state
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>热修复</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <Card
            title="当前热修复配置"
            extra={
              <div>
                <Button
                  type="primary"
                  style={{marginRight: 8}}
                  onClick={() => {
                  }}>
                  <Icon type="upload"/>上传补丁
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                  }}>
                  <Icon type="plus"/>新增补丁配置
                </Button>
              </div>
            }>
            <p>
              <span style={{paddingRight: 8, marginBottom: 0}}>实际分发数/预计分发数：(昨天)</span>
              {androidData.beforeActualQuantity || '--'}/{androidData.beforeExpectQuantitty || '--'}
            </p>
            <p>
              <span style={{paddingRight: 8, marginBottom: 0}}>实际分发数/预计分发数：(今天)</span>
              {androidData.actualQuantity || '--'}/{androidData.expectQuantitty || '--'}
            </p>
          </Card>
        </div>
      </div>
    )
  }
}

export default connect(state => {
  return {
    projectId: state.project.projectId
  }
}, {})(Hotfixs);
