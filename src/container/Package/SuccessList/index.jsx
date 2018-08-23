import React, {Component} from 'react'
import UnFinishList from '../UnFinishList'
import {setSuccessList} from '@/store/system/action'
import {packageList} from '@/api/package/package'
import {Button, Collapse} from 'antd';
import './index.scss'
import {packageDownload, moreVersion, moreBuild,} from '@/api/package/package'

import {fromJS} from 'immutable'
import {connect} from 'react-redux'

const Panel = Collapse.Panel;

class SuccessList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadMoreVersionText: '点击加载更多成功版本',
      detailBuildId: '',        // 查看详情的buildId
      detailVisible: false,       // 详情显示
      buildCount: 1,         // 加载更多build数量
      versionCount: 1,      // 加载更多版本数量
      versionPage: 1,      // 加载更多版本页面
      packageDetail: {}      // 包详情
    }
  }

  componentWillMount() {
    // 获取成功包列表
    let {envId} = this.props;
    if (envId) {
      this.initPackage(envId);
    }
  }

  // 环境改变 重新获取包列表
  componentWillReceiveProps(nextProps) {
    if (nextProps.envId !== this.props.envId) {
      if (nextProps.envId) {
        this.initPackage(nextProps.envId);
      }
    }
  }

  async initPackage(envId) {
    let {setSuccessList} = this.props;
    let response = await packageList({envId});
    let data = response.data;
    if (data.code === '0' || data.code === 0) {
      if (data.data.length) {
        let packageList = data.data;
        packageList = packageList.map(item => {
          let obj = {
            hasMore: true,
            page: item.record.length + 1
          }
          return {...item, ...obj};
        })
        setSuccessList(fromJS(packageList));
        this.setState({
          versionPage: ++data.data.length
        })
      } else {
        setSuccessList(fromJS([]));
        this.setState({
          loadMoreVersionText: '没有更多成功版本'
        })
      }
    }
  }


// 加载更多version
  async loadMoreVersion() {
    let {versionPage, versionCount, loadMoreVersionText} = this.state;
    let {envId, packageList, setSuccessList} = this.props;
    if (loadMoreVersionText === '没有更多成功版本') {
      return;
    }
    let response = await
      moreVersion({
        envId: envId,
        page: versionPage,
        count: versionCount
      });
    let data = response.data;
    if (data.code === '0 ' || data.code === 0) {
      let newPackageList = data.data;
      if (newPackageList.length) {
        let obj = {
          hasMore: true,
          page: 1
        }
        newPackageList = newPackageList.map(item => {
          return {...item, ...obj};
        })
        packageList = [...packageList, ...newPackageList]
        setSuccessList(fromJS(packageList));
        this.setState({
          versionPage: ++versionPage
        })
      } else {
        this.setState({
          loadMoreVersionText: '没有更多成功版本'
        })
      }
    }
  }

// 包下载
  async packageDownload(id) {
    packageDownload(id);
  }

// 加载更多build
  async loadMoreBuild(version, index,) {
    let {buildCount} = this.state;
    let {packageList, setSuccessList, envId} = this.props;
    let page = packageList[index].page;
    let response = await
      moreBuild({
        version,
        envId,
        page,
        count: buildCount
      });
    let data = response.data;
    if (parseInt(data.code) === 0) {
      if (data.data.length) {
        packageList[index].record = [...packageList[index].record, ...data.data]
        packageList[index].page++;
      } else {
        packageList[index].hasMore = false;
      }
      setSuccessList(fromJS(packageList));
    }
  }

  // 详情
  seeDetail(buildId) {
    let {platformName, envName} = this.props;
    window.open(`#/detail/successDetail?buildId=${buildId}&platformName=${platformName}&envName=${envName}`);
  }


  handleCancel() {
    this.setState({
      addTestVisible: false,
      detailVisible: false,
      rebuildTestVisible: false,
      failureDetailVisible: false
    })
  }

  render() {
    let {packageList, envId, platformName, envName} = this.props;
    let {loadMoreVersionText} = this.state;
    return (
      <div id="success-list-container">
        <UnFinishList
          envId={envId}
          platformName={platformName}
          envName={envName}
        />
        <article>
          {
            packageList.map((item, index) => (
              <section key={index} className="package-container">
                <Collapse defaultActiveKey={['1']}>
                  <Panel header={'版本号' + item.version} key="1">
                    {
                      item.record.map((recordItem, recordIndex) => {
                        return <div className="package-item-container" key={recordIndex}>
                          <div className="item-left-part">
                            <div onClick={this.seeDetail.bind(this, recordItem.id)}>
                              <img className="item-img"
                                   src={recordItem.iconUrl ? recordItem.iconUrl : require("../../../assets/favicon.ico")}
                                   style={{cursor: 'pointer'}}
                              />
                            </div>
                            <div className="package-detail" style={{cursor: "pointer"}}>
                              <div onClick={this.seeDetail.bind(this, recordItem.id)}>
                                <span style={{color: "#01aaed"}}>{recordItem.fileName}</span>
                              </div>
                              <p className="package-info">
                                {
                                  recordItem.label ? <span className="margin10">label:{recordItem.label}</span> : ""
                                }
                                <span className="margin10">buildId：{recordItem.id}</span>
                                <span className="margin10">状态：构建成功</span>
                                <span className="margin10">时间：{recordItem.buildTime}</span>
                                <span className="margin10 test-summary">提测概要：{recordItem.content}</span>
                              </p>
                            </div>
                          </div>

                          <div className="btn-package-container">
                            <Button type="primary"
                                    style={{marginRight: '10px'}}
                                    onClick={this.packageDownload.bind(this, recordItem.id)}>
                              下载</Button>
                            <Button type="primary" onClick={this.seeDetail.bind(this, recordItem.id)}>查看</Button>
                          </div>
                        </div>
                      })
                    }
                  </Panel>
                </Collapse>
                <span className="loadMoreBuild"
                      onClick={item.hasMore ? this.loadMoreBuild.bind(this, item.version, index) : void(0)}>{item.hasMore ? '加载更多' : '没有更多'}</span>
              </section>
            ))
          }
          <span className="loadMoreVersion" onClick={this.loadMoreVersion.bind(this)}>{loadMoreVersionText}</span>
        </article>
      </div>
    )
  }
}


export default connect(state => {
  return ({
    packageList: state.get('system').get('successPackageList').toJS()
  })
}, {setSuccessList})(SuccessList);

