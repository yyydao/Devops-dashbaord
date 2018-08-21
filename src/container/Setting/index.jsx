import React, {Component} from 'react'
import {Card, Col, Row} from 'antd';

class Setting extends Component {

  handleClick(type) {
    if(type === 'package'){
      this.props.history.push('/packageConfig')
    }else{
      this.props.history.push('/performanceConfig')
    }
  }

  render() {
    return (
      <div id="setting">
        <Row gutter={16}>
          <Col span={5}>
            <Card onClick={this.handleClick.bind(this,'package')} type="inner" hoverable style={{width: 300}}>
              <p>包管理配置</p>
            </Card>
          </Col>
          <Col span={5}>
            <Card onClick={this.handleClick.bind(this,'performance')} type="inner" hoverable style={{width: 300}}>
              <p>性能测试配置</p>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Setting