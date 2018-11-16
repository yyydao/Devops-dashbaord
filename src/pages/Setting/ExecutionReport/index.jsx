import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Row, Col, Tag, Button, message, Divider, Select, Card, Modal } from 'antd';


import { reqPost, reqGet} from '@/api/api';
import './index.scss';
import LabelItem from './LabelItem';
import ScoreChart from './chart/ScoreChart';
import StaticScanChart from './chart/StaticScanChart';
import SecurityScanChart from './chart/SecurityScanChart'
import IosSecurityScanChart from './chart/IosSecurityScanChart'
import UnitTestChart from './chart/UnitTestChart'
import UITestChart from './chart/UITestChart'
import PerformanceTestChart from './chart/PerformanceTestChart'

import DataSet from "@antv/data-set";

function listItem (){
  return (<p><span className="info-label">Package Name：</span>com.junte</p>)
}


class ExecutionReport extends Component{
  constructor(){
    super();
    this.state = {}
  }

  componentWillMount(){
    window.localStorage.setItem('oldProjectId', this.props.projectId);
  }



  render(){
    const {} = this.state;
    return(
        <div>
          <Card  title="基本信息" style={{marginTop: 30}}>
            <Row>
              <Col span={12}>
                <LabelItem label={"Package Name："}>com.junte</LabelItem>
                <LabelItem label={"Target SDK："}>23</LabelItem>
                <LabelItem label={"Min SDK："}>14</LabelItem>
                <LabelItem label={"Version Code："}>137</LabelItem>
                <LabelItem label={"Version Name："}>5.3.4.1</LabelItem>
                <LabelItem label={"Size："}>27.8MB</LabelItem>
                <LabelItem label={"源包下载："}>http://10.100.11.222:8082/job/TuandaiAS2-develop-v3/112/artifact/integrations/apk/TuandaiAS2-debug.apk</LabelItem>
                <LabelItem label={"加固包下载："}>http://10.100.11.222:8082/job/TuandaiAS2-tinker-v3/46/artifact/integrations/tinkerPatch/normal-release/app-normal-release_signed.apk</LabelItem>
                <LabelItem label={"补丁包下载："}>http://10.100.11.222:8082/job/TuandaiAS2-tinker-v3/44/artifact/integrations/tinkerPatch/normal/release/patch_signed_7zip.apk</LabelItem>
              </Col>
              <Col span={8}>
                <ScoreChart></ScoreChart>
              </Col>
              <Col span={4}>
                <p>综合评分:</p>
                <p style={{fontSize:80,fontWeight:"bold"}}>89</p>
              </Col>
            </Row>
          </Card>
          <StaticScanChart></StaticScanChart>
          <SecurityScanChart></SecurityScanChart>
          <UnitTestChart></UnitTestChart>
          <UITestChart></UITestChart>
          <PerformanceTestChart></PerformanceTestChart>
          <IosSecurityScanChart></IosSecurityScanChart>
        </div>
    )
  }
}

export default connect(state => {
  return{
    projectId: state.projectId
  }
}, {})(ExecutionReport);