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


class ExecutionReport extends Component{
  constructor(){
    super();
    this.state = {
      allData:{
        "scoreStandard": {
          "securityScore": 0,
          "compileTimeScore": 0,
          "prismScore": 0,
          "testScore": 0,
          "releaseScore": 0,
          "totalScore": 0,
          "previousTotalScore": "0",
          "previousSecurityScore": 0,
          "previousCompileTimeScore": 0,
          "previousPrismScore": 0,
          "previousTestScore": 0,
          "previousReleaseScore": 0
        },
        "packageList": [
          {
            "packageID": 34,
            "packageName": "com.junte",
            "targetSdk": "26",
            "minSdk": "14",
            "versionCode": "147",
            "versionName": "5.4.0",
            "appFileSize": "25.46MB",
            "filePath": "./package/7fac5ab3ba474657ad8923a803d390080N4D86/Android/code_source/20181108142427/app-normal-debug.apk"
          },
          {
            "packageID": 34,
            "packageName": "com.junte",
            "targetSdk": "26",
            "minSdk": "14",
            "versionCode": "147",
            "versionName": "5.4.0",
            "appFileSize": "25.46MB",
            "filePath": "./package/7fac5ab3ba474657ad8923a803d390080N4D86/Android/code_source/20181108142427/app-normal-debug.apk"
          }
        ],
        "codeList": [
          {
            "sonarID": 407,
            "metric": "vulnerabilities",
            "sqaleValue": "2",
            "updateTime": "2018-11-08 14:18:26.0"
          },
          {
            "sonarID": 407,
            "metric": "vulnerabilities",
            "sqaleValue": "2",
            "updateTime": "2018-11-08 14:18:26.0"
          },
          {
            "sonarID": 407,
            "metric": "vulnerabilities",
            "sqaleValue": "2",
            "updateTime": "2018-11-08 14:18:26.0"
          },
          {
            "sonarID": 407,
            "metric": "vulnerabilities",
            "sqaleValue": "2",
            "updateTime": "2018-11-08 14:18:26.0"
          },
          {
            "sonarID": 407,
            "metric": "vulnerabilities",
            "sqaleValue": "2",
            "updateTime": "2018-11-08 14:18:26.0"
          },
          {
            "sonarID": 407,
            "metric": "vulnerabilities",
            "sqaleValue": "2",
            "updateTime": "2018-11-08 14:18:26.0"
          },
          {
            "sonarID": 407,
            "metric": "vulnerabilities",
            "sqaleValue": "2",
            "updateTime": "2018-11-08 14:18:26.0"
          }
        ],
        "unitList": [
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          },
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          },
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          },
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          },
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          },
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          },
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          },
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          },
          {
            "sonarID": 414,
            "metric": "test_success_density",
            "sqaleValue": "90.8",
            "updateTime": "2018-11-08 14:24:44.0"
          }
        ],
        "cucumber": {
          "cucID": 22,
          "projectID": 0,
          "stepID": "",
          "steps": 27,
          "passedSteps": 27,
          "skippedSteps": 0,
          "pendingSteps": 0,
          "undefinedSteps": 0,
          "scenarios": 2,
          "passedScenarios": 2,
          "failedScenarios": 0,
          "features": 1,
          "passedFeatures": 1,
          "failedFeatures": 0,
          "updateTime": "2018-11-08 14:26:49.0",
          "remark": ""
        },
        "prism": {
          "prismID": 18,
          "projectID": 0,
          "platform": 1,
          "dataJsUrl": "./package/7fac5ab3ba474657ad8923a803d390080N4D86/PrismReport/20181108142650/data/data.js",
          "coldStartTime": "1.321秒",
          "cpuMax": "31.49%",
          "cpuAverage": "19.19%",
          "memoryMax": "250.0MB",
          "memoryAverage": "225.65MB",
          "flowUp": "151KB",
          "flowDown": "959KB",
          "smAverage": "54帧/s",
          "smMin": "5帧/s",
          "updateTime": "2018-11-08 14:26:50.0",
          "remark": ""
        },
        "security": {
          "securityID": 14,
          "projectID": 0,
          "stepID": "",
          "platform": 1,
          "actCount": 213,
          "eAct": 6,
          "servCount": 10,
          "eSer": 1,
          "provCount": 5,
          "eCnt": 1,
          "broCount": 4,
          "eBro": 1,
          "urls": 19,
          "strings": 1,
          "findings": 11,
          "manifest": 7,
          "binaryAnalysis": 1,
          "certz": 8,
          "creator": "",
          "updateTime": "2018-11-08 14:24:42.0",
          "remark": ""
        }
      }
    }
  }

  componentWillMount(){
    this.getExecutionReport()
  }

  /**
   * @desc 获取基本信息
   */
  getExecutionReport = () =>{
    reqGet('pipeline/report/taskreport', {
      taskID : '19222158ce6441899b92c57ca42a92e922T70J',
      buildNum : 11,
      platform :  2
    }).then(res => {
      if (res.code === 0) {
      } else {
        message.error(res.msg);
      }
    })
  }


  render(){
    const {allData} = this.state;
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
          <UITestChart data={allData.cucumber}/>
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
