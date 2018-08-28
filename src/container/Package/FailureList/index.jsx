import React, {Component} from 'react'
import {Button, Collapse} from 'antd';
import {packageDetail, packageFailure} from '@/api/package/package'
import {connect} from 'react-redux'
import {setFailureList} from '@/store/system/action'
import FailureDetail from '../FailureDetail'
import './index.scss'
import {fromJS} from 'immutable'

const Panel = Collapse.Panel;

class FailureList extends Component {
  constructor() {
    super();
    this.state = {
      detailData: {},
      loadMoreFailureText: '加载更多',
      failureDetailVisible: false,
      failureCount: 1,         // 加载更多失败包数量
      failurePage: 1,          // 加载更多失败包页数
    }
  }

  async componentWillMount() {
    let {envId} = this.props;
    if (envId) {
      this.initPackage(envId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.envId !== this.props.envId) {
      if (nextProps.envId) {
        this.initPackage(nextProps.envId);
      }
    }
  }

  async initPackage(envId) {
    let {failureCount, failurePage} = this.state;
    let {setFailureList} = this.props;
    let response = await packageFailure({envId, page: failurePage, count: failureCount});
    let data = response.data;
    if (data.code === '0' || data.code === 0) {
      let packageList = data.data;
      if (packageList.length) {
        setFailureList(fromJS(packageList));
        this.setState({
          failurePage: ++packageList.length
        })
      } else {
        setFailureList(fromJS([]));
        this.setState({
          loadMoreFailureText: '没有更多'
        })
      }
    }
  }

  // 详情
  seeDetail(buildId, taskId) {
    let {platformName, envName} = this.props;
    window.open(`#/detail/failureDetail?buildId=${buildId}&taskId=${taskId}&platformName=${platformName}&envName=${envName}`);
  }

  // 更多失败包
  async loadMoreFailure(id) {
    let {failurePage, failureCount, loadMoreFailureText} = this.state;
    if (loadMoreFailureText === '没有更多') {
      return;
    }
    let {failurePackageList, setFailureList, envId} = this.props;
    let response = await packageFailure({
      envId,
      page: failurePage,
      count: failureCount
    });
    let data = response.data;
    if (data.code === '0 ' || data.code === 0) {
      if (data.data.length) {
        failurePackageList = [...failurePackageList, ...data.data]
        setFailureList(fromJS(failurePackageList));
        this.setState({
          failurePage: ++failurePage
        })
      } else {
        this.setState({
          loadMoreFailureText: '没有更多'
        })
      }
    }
  }

  // 查看详情
  async seeFailureDetail(id) {
    let response = await packageDetail({buildId: id});
    let data = response.data;
    if (data.code === 0 || data.code === '0') {
      this.setState({
        failureDetailVisible: true,
        detailData: data.data
      })
    }
  }

  render() {
    let {failurePackageList} = this.props;
    let {loadMoreFailureText, failureDetailVisible, detailData} = this.state;
    return (
      <div id="failure-list-container">
        <article>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="失败列表" key="1">
              {
                failurePackageList.map((item, index) => (
                  <div className="package-item-container" key={index}>
                    <div className="item-left-part">
                      <img className="item-img"
                           src={
                             item.iconUrl ? item.iconUrl :
                               require("../../../assets/favicon.ico")}
                           onClick={this.seeDetail.bind(this, item.buildId, item.taskId)}
                           style={{cursor: 'pointer'}}
                           alt=""
                      />
                      <div className="package-detail" style={{cursor: 'pointer'}}
                           onClick={this.seeDetail.bind(this, item.buildId, item.taskId)}>
                        <span style={{color: '#01aaed'}}>失败原因：{item.failedReason}</span>
                        <p className="package-info">
                          <span style={{marginRight: '20px'}}>buildId:{item.buildId}</span>
                          <span className="margin10">{item.buildTime}</span>
                          <span className="margin10">{item.description}</span>
                          <span className="margin10 test-summary">提测概要：{item.content}</span>
                        </p>
                      </div>
                    </div>
                    <div className="btn-package-container">
                      <Button type="primary"
                              onClick={this.seeDetail.bind(this, item.buildId, item.taskId)}>查看</Button>
                    </div>
                  </div>

                ))
              }
            </Panel>
          </Collapse>
          <span className="loadMoreFailure" onClick={this.loadMoreFailure.bind(this)}>{loadMoreFailureText}</span>
        </article>

        {/*失败详情*/}
        {
          failureDetailVisible ?
            <FailureDetail
              handleCancel={() => {
                this.setState({
                  failureDetailVisible: false
                })
              }}
              detailData={detailData}
              failureDetailVisible={failureDetailVisible}
            /> : ''
        }

      </div>
    )
  }
}

export default connect(state => ({failurePackageList: state.get('system').get('failurePackageList').toJS()}), {
  setFailureList
})(FailureList);
