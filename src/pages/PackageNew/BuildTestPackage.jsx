import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reqPost, reqGet } from '@/api/api';
import './list.scss';
import VersionPanel from './versionPanel';

import { Breadcrumb, Icon, Button, Input, Collapse, Modal, Select, Pagination, Popconfirm, message } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;
const Option = Select.Option;


class BuildTestPackage extends Component {
  constructor(props) {
    super(props);

    this.state = {

      //控制列表数量以及当前页码
      versionTotal: 100,
      versionPage: 1,

      //列表list
      dataList: [
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        },
        {
          "buildID": 1672,
          "envID": 63,
          "fileName": "TuandaiAS2-debug.apk",
          "buildVersion": 149,
          "appVersion": "5.4.1",
          "jenkinsStatus": 0,
          "status": 0,
          "developer": "叶小川",
          "createTime": "2018-11-24 10:29:41.0",
          "id": 442
        }
      ]
    }
  }
  handleChange = () =>{}
  onPaginationChange = (page) =>{
    this.setState({versionPage:page})
  }
  componentWillMount() {
    const oldProjectId = window.localStorage.getItem('oldProjectId');

    window.localStorage.setItem('oldProjectId', this.props.projectId);
  }

  componentWillUnmount() {
  }

  render() {
    const { versionTotal, versionPage, dataList } = this.state;

    return (
        <div className="package">
          <div className="package-title">
            <Button type="primary" onClick={() => {this.toggleBuildModal(true, 1)}}>新增提测</Button>
            <span style={{paddingRight:8,paddingLeft:24}}>环境</span>
            <Select defaultValue="lucy" style={{ width: 150, marginRight:24 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
            <span style={{paddingRight:8}}>版本</span>
            <Select defaultValue="lucy" style={{ width: 150, marginRight:24 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
            <span style={{paddingRight:8}}>类型</span>
            <Select defaultValue="lucy" style={{ width: 150, marginRight:24 }} onChange={this.handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
            <span style={{color:"#6DD200",paddingRight:8}}>Tips:</span>
            <span>3个任务正在构建...</span>
          </div>
          <div className="package-content">
            <div className="package-list">
              {
                dataList.map(item =>{
                  <div className="package-list-item">
                    <img src={require('@/assets/favicon.ico')} />
                    <p>
                      <span style={{color:"#39A1EE"}}>{item.fileName}</span>
                      <span style={{paddingLeft:8}}>buildId：{item.buildID}</span><br/>
                      <span>时间：{item.createTime}</span><br/>
                      <span>提测人：{item.developer}</span>
                    </p>
                    <Button type="primary" style={{marginRight:"auto"}}>下载</Button>
                    <Icon type="right"/>
                  </div>
                })
              }
              <Pagination onChange={this.onPaginationChange}
                          total={versionTotal}
                          showTotal={total => `共 ${versionTotal} 条`}
                          pageSize={20}
                          current={versionPage}
                          style={{marginTop:16,cssFloat:"right"}}/>
            </div>
          </div>
        </div>

    )
  }
}

BuildTestPackage = connect((state) => {
  console.log(state)
  return {
    projectId: state.projectId
  }
})(BuildTestPackage)

export default BuildTestPackage;
