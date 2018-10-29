import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Row, Col, Tag, Button, message, Divider, Select, Form, Modal } from 'antd';

import PipelineChart from './PipelineChart';
import { reqPost, reqGet} from '@/api/api';
import './index.scss';
const BreadcrumbItem = Breadcrumb.Item;
const Option = Select.Option;


class Dashboard extends Component{
  constructor(){
    super();
    this.state = {
      pipelineType: "1"
    };
  }

  componentWillMount(){
  }

  render(){
    const {pipelineType} = this.state;

    return(
        <div>
          <Breadcrumb className="devops-breadcrumb">
            <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
            <BreadcrumbItem>仪表盘</BreadcrumbItem>
          </Breadcrumb>
          <Select defaultValue="1" onChange={value=>{this.state({pipelineType:value})}}>
              <Option value="1">开发包流水线</Option>
              <Option value="2">正式包流水线</Option>
          </Select>
          <p className="base_info">基本信息</p>
          <Divider className="divider"/>
          <Row>
            <Col span={8} className="info-menu">
              <div><Tag color="#2db7f5">Identifier</Tag> com.tuandai.client</div>
              <div><Tag color="#2db7f5">SDK Name</Tag>iponeos11.3</div>
              <div><Tag color="#2db7f5">Version</Tag>5</div>
              <div><Tag color="#2db7f5">Platform Version</Tag>5.3.4.1</div>
              <div><Tag color="#2db7f5">Min OS Version</Tag>8.0</div>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={8}>
                  <span className="data_title">代码总行数</span>
                  <p className="data_num" style={{color:"#2db7f5"}}>225K</p>
                </Col>
                <Col span={8} offset={1}>
                  <span className="data_title">测试数</span>
                  <p className="data_num" style={{color:"#2db7f5"}}>203</p>
                </Col>
                <Col span={8} >
                  <span className="data_title">Bugs</span>
                  <p className="data_num" style={{color:"#f50"}}>2</p>
                </Col>
                <Col span={8}>
                  <span className="data_title">漏洞</span>
                  <p className="data_num" style={{color:"#f50"}}>8</p>
                </Col>
                <Col span={8}>
                  <span className="data_title">坏味道</span>
                  <p className="data_num" style={{color:"#f50"}}>17</p>
                </Col>
              </Row>
            </Col>
            <Col span={4} className="btn-group">
              <p>
                <Button type="primary">原包下载</Button>
              </p>
              <Button type="primary">加固包下载</Button>
            </Col>
          </Row>
          <p className="base_info">流水线监控分析</p>
          <Divider className="divider"/>
          <PipelineChart></PipelineChart>
        </div>
    )
  }
}

// const DashboardForm = Form.create()(Dashboard);
export default connect(state => {
  return{
    projectId: state.projectId
  }
}, {})(Dashboard);