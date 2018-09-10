import React, {Component} from 'react'
import {Row, Col, Input, Divider, Button, message} from 'antd';
import {packageDetail, packageDownload} from '@/api/package/package'
import {testScreenList} from '@/api/performance/screen'
import {submitStatus, taskSubmit} from '@/api/performance/task'
import AddTest from './AddTest'
import './index.scss'
import qs from 'qs'

const {TextArea} = Input;

class SuccessDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buildId: '',
      detailData: {}, // 当前的详细信息
      platformName: '', // 平台名 上个路由带过来的 从url的query获取
      envName: '',  // 环境名 上个路由带过来的 从url的query获取
      addTestShow: false, // 新增性能测试modal显示
      testStatus: 1,    // 提测状态
      statusMap: {  // 关联性能测试的状态
        0: '性能测试报告',
        1: '性能测试',
        2: '性能测试中',
        3: '重新构建',
        4: '重新构建'
      },
      reportUrl: '',  // 报告地址
      screenList: [],     // 场景列表
    }
  }

  async componentWillMount() {
    let parsed = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
    let buildId = parsed.buildId;
    if (buildId) {
      let response = await packageDetail({buildId});
      if (parseInt(response.data.code,10) === 0) {
        this.setState({
          detailData: response.data.data,
          platformName: parsed.platformName,
          envName: parsed.envName,
          buildId
        })
        this.getSubmitStatus(buildId);
      }
    }
  }

  // 获取提测状态
  async getSubmitStatus(id) {
    let response = await submitStatus({submitBuildId: id});
    if (parseInt(response.data.code,10) === 0) {
      let data = response.data.data;
      // status === null 代表未构建 需要获取场景列表 这里把status重置为1的原因是 状态码为1是未构建 但是后来改为null也认为是未构建 所有这里把status重置
      if (data.status === null) {
        this.getScreen(this.state.detailData && this.state.detailData.performanceProjectId)
        this.setState({
          testStatus: 1
        })
      } else {
        this.setState({
          testStatus: data.status,
          reportUrl: data.reportUrl
        })
      }
    }
  }

  // 点击性能测试按钮 根据不同status触发不同事件
  handleTestClick() {
    let {testStatus} = this.state;
    if(testStatus === 0){
      this.openReport();
    }else if(testStatus === 1 || testStatus === 3 || testStatus === 4){
      this.getScreen(this.state.detailData.performanceProjectId);
      this.setState({addTestShow: true});
    }
  }

   // 获取场景列表
  async getScreen(projectId) {
    let response = await testScreenList({projectId});
    if (parseInt(response.data.code,10) === 0) {
      this.setState({
        screenList: response.data.data
      })
    }
  }

   // 下载
  download(id) {
    packageDownload(id);
  }

   // 打开性能测试报告页
  openReport() {
    let {reportUrl} = this.state;
    if (reportUrl) {
      window.open(reportUrl);
    }
  }

// 开启性能测试
  async startTest(testScene) {
    let {buildId, detailData} = this.state;
    let response = await
      taskSubmit({
        testScene: testScene.join(','),
        submitPlatformId: buildId,
        type: 3,
        appAddr: detailData.performanceAppUrl,
        projectId: detailData.performanceProjectId
      });
    if (parseInt(response.data.code,10) === 0) {
      this.setState({
        addTestVisible: false
      })
      // 修改状态为性能测试中
      this.setState({
        testStatus: 2,
        addTestShow: false
      })
      message.success('构建成功')
    }
  }

  render() {
    let {detailData, platformName, envName, testStatus} = this.state;
    return (
      <div className="success-detail-container">
        <Divider orientation="left" className="title">{platformName}-{envName}</Divider>
        <div className="detail-info-container">
          <Row>
            <Col span={4} style={{marginLeft: 40}}>
              <span>{detailData.fileName}</span>
            </Col>
            <Col span={10} offset={9} style={{paddingLeft: 40}}>
              <span style={{marginRight: 10}}>版本：{detailData.version}</span>
              <span style={{marginRight: 10}}>大小：{detailData.fileSize}</span>
              <span> {detailData.buildTime}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8} style={{marginTop: 40, marginLeft: 40}}>
              <Button type="primary"
                      style={{width: 100, height: 40}}
                      onClick={this.download.bind(this, detailData.buildId)}>
                下载
              </Button>
              {
                (detailData.performanceProjectId === 0 || detailData.performanceProjectId === null) ? <Button type="primary"
                        style={{width: 120, height: 40, marginLeft: 10}} disabled>性能测试</Button> : <Button type="primary" style={{width: 120, height: 40, marginLeft: 10}} onClick={this.handleTestClick.bind(this)}>{this.state.statusMap[testStatus] || ''}</Button>
              }
            </Col>
            <Col offset={14}>
              <img width={256} height={256} src={detailData.imageUrl} alt="" />
            </Col>
          </Row>

          <ul className="info-container" style={{listStyle: 'none'}}>
            <li>提测人：{detailData.taskMaster}</li>
            <li>提测分支：{detailData.codeBranch}</li>
            <li>
              提测详情：<a href={detailData.submitDetails}>{detailData.submitDetails}</a>
            </li>
            <li>
              <h4>提测概要</h4>
              <TextArea autosize={{minRows: 4, maxRows: 10}} value={detailData.submitContent} style={{width: '95%'}}
                        disabled/>
            </li>
            {
              detailData.rebuildContent ?
                <li>
                  <h4>回归内容</h4>
                  <TextArea autosize={{minRows: 4, maxRows: 10}} value={detailData.rebuildContent}
                            style={{width: '95%'}} disabled/>
                </li> : ''
            }
          </ul>
        </div>
        <AddTest
          screenList={this.state.screenList}
          handleCancel={() => {
            this.setState({addTestShow: false})
          }}
          startTest={(testScene) => {
            this.startTest(testScene)
          }}
          show={this.state.addTestShow}
        />
      </div>
    )
  }
}

export default SuccessDetail;