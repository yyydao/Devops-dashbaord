import React, {Component} from 'react'
import {Row, Col, Input, Divider, Button} from 'antd';
import {packageDetail, packageDownload} from '@/api/package/package'
import {testScreenList} from '@/api/performance/screen'
import AddTest from './AddTest'
import './index.scss'
import qs from 'qs'

const {TextArea} = Input;

class SuccessDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      detailData: {},
      platformName: '',
      envName: '',
      show: false
    }
  }

  async componentWillMount() {
    let parsed = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
    let buildId = parsed.buildId;
    if (buildId) {
      let response = await packageDetail({buildId});
      if (parseInt(response.data.code) === 0) {
        this.setState({
          detailData: response.data.data,
          platformName: parsed.platformName,
          envName: parsed.envName
        })
      }
    }
  }

  // 获取场景列表
  async getScreen() {
    let response = await testScreenList({});
    if (parseInt(response.data.code) === 0) {

    }
  }

  // 下载
  download(id) {
    packageDownload(id);
  }

  render() {
    let {detailData, platformName, envName} = this.state;
    return (
      <div className="success-detail-container">
        <Divider orientation="left" className="title">{platformName}-{envName}</Divider>
        <div className="detail-info-container">
          <Row>
            <Col span={4} style={{marginLeft: 40}}>
              <span>{detailData.fileName}</span>
            </Col>
            <Col span={10} offset={9} style={{paddingLeft: '40px'}}>
              <span style={{marginRight: '10px'}}>版本：{detailData.version}</span>
              <span style={{marginRight: '10px'}}>大小：{detailData.fileSize}</span>
              <span> {detailData.buildTime}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8} style={{marginTop: 40, marginLeft: '40px'}}>
              <Button type="primary"
                      style={{width: '100px', height: '40px'}}
                      onClick={this.download.bind(this, detailData.buildId)}>
                下载
              </Button>
              {/* <Button type="primary"
                      style={{width: '100px', height: '40px', marginLeft: 10}}
                      onClick={() => {
                        this.setState({show: true})
                      }}>
                性能测试
              </Button>*/}
              {/*        <Button type="primary"
                      style={{width: '120px', height: '40px', marginLeft: 10}}
                      onClick={() => {
                        this.setState({show: true})
                      }}>
                性能测试报告
              </Button>*/}
              <Button
                disabled
                style={{background: 'rgb(190, 200, 200)', width: '120px', height: '40px', marginLeft: 10}}
                onClick={() => {
                  this.setState({show: true})
                }}>
                性能测试中
              </Button>
            </Col>
            <Col offset={14}>
              <img width={256} height={256} src={detailData.imageUrl}/>
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
          screenList={[]}
          handleCancel={() => {
            this.setState({show: false})
          }}
          show={this.state.show}
        />
      </div>
    )
  }
}

export default SuccessDetail;