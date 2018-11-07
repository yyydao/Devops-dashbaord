import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Row, Col, message, Tabs, Form} from 'antd';

import { reqPost } from '@/api/api';
import './index.scss';

const BreadcrumbItem = Breadcrumb.Item;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class ConfigManager extends Component{
    constructor(){
        super();
        this.state = {
            configList: []
        }
    }

    componentWillMount(){
        this.getConfigList();
    }

    getConfigList(){
        reqPost('/config/list').then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({ configList: res.data });
            }else{
                message.error(res.msg);
            }
        })
    }

    render(){
        const { configList } = this.state;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 14 },
          };
        return(
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>配置管理</BreadcrumbItem>
                </Breadcrumb>
              <Tabs type="card">
                <TabPane tab="测试环境" key="1">
                  <Row gutter={16}>
                    <Col className="gutter-row" span={2}>
                      <div className="gutter-box">提测配置</div>
                    </Col>
                    <Col className="gutter-row" span={16}>
                      <div className="gutter-box">col-6</div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={2}>
                      <div className="gutter-box">性能测试配置</div>
                    </Col>
                    <Col className="gutter-row" span={16}>
                      <div className="gutter-box">col-6</div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col className="gutter-row" span={2}>
                      <div className="gutter-box">场景管理</div>
                    </Col>
                    <Col className="gutter-row" span={16}>
                      <div className="gutter-box">col-6</div>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="灰度环境" key="2">Content of Tab Pane 2</TabPane>
                <TabPane tab="正式环境" key="3">Content of Tab Pane 3</TabPane>
              </Tabs>
            </div>
        )
    }
}

export default ConfigManager;