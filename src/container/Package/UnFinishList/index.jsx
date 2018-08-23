import React, {Component} from 'react'
import {Button, Collapse} from 'antd';
import {connect} from 'react-redux'
import {setUnFinishList} from '@/store/system/action'
import {packageDetail} from '@/api/package/package';
import {unFinishList as reqUnFinishList} from '@/api/package/package';
import {fromJS} from 'immutable'

import './index.scss'

const Panel = Collapse.Panel;

class UnFinishList extends Component {

  constructor() {
    super();
    this.state = {
      loadMorePackageText: '加载更多',
      packageCount: 10,         // 加载更多包数量
      packagePage: 1,          // 加载更多包页数
    }
  }

  componentWillMount() {
    let {envId} = this.props;
    if (envId) {
      this.initPackage(envId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.envId !== nextProps.envId) {
      if (nextProps.envId) {
        this.initPackage(nextProps.envId);
      }
    }
  }

  // 初次拉取包详情
  async initPackage(envId) {
    let {packagePage, packageCount} = this.state;
    let {setUnFinishList} = this.props;
    let response = await reqUnFinishList({
      envId,
      page: packagePage,
      count: packageCount
    });
    let data = response.data;
    if (data.code === 0 || data.code === '0') {
      if (data.data.length) {
        setUnFinishList(fromJS(data.data));
        this.setState({
          packagePage: ++data.data.length
        })
      } else {
        setUnFinishList(fromJS([]));
        this.setState({
          loadMorePackageText: '没有更多'
        })
      }
    }
  }

  // 查看详情
  async seeDetail(id) {
    this.setState({
      detailVisible: true
    })
    let response = await packageDetail({buildId: id});
    let data = response.data;
    if (data.code === 0 || data.code === '0') {
      this.setState({
        packageDetail: data.data
      })
    }
  }

  // 加载更多
  async loadMorePackage() {
    let {packagePage, packageCount, loadMorePackageText} = this.state;
    if (loadMorePackageText === '没有更多') {
      return;
    }
    let {unFinishList, setUnFinishList, envId} = this.props;
    let response = await reqUnFinishList({
      envId,
      page: packagePage,
      count: packageCount
    });
    let data = response.data;
    if (data.code === '0 ' || data.code === 0) {
      if (data.data.length) {
        unFinishList = [...unFinishList, ...data.data]
        setUnFinishList(fromJS(unFinishList));
        this.setState({
          packagePage: ++packagePage
        })
      } else {
        this.setState({
          loadMorePackageText: '没有更多'
        })
      }
    }
  }

  // 详情
  seeDetail(buildId) {
    let {platformName, envName} = this.props;
    window.open(`#/detail/unFinishDetail?buildId=${buildId}&platformName=${platformName}&envName=${envName}`);
  }

  render() {
    let {loadMorePackageText} = this.state;
    let {unFinishList} = this.props;
    return (
      <article id="unFinishList">
        <section className="package-container">
          <Collapse defaultActiveKey={['0']}>
            <Panel header="构建队列">
              {
                unFinishList.map((recordItem, recordIndex) => (
                  <div className="package-item-container" key={recordIndex}>
                    <div className="item-left-part">
                      <img className="item-img"
                           src={recordItem.iconUrl ? recordItem.iconUrl : require("../../../assets/favicon.ico")}
                           onClick={this.seeDetail.bind(this, recordItem.buildId)}
                           style={{cursor: 'pointer'}}
                      />
                      <div className="package-detail" style={{cursor: 'pointer'}}
                           onClick={this.seeDetail.bind(this, recordItem.buildId)}>
                        <span style={{color: '#01aaed'}}>{parseInt(recordItem.buildStatus) === 1 ? "未构建" : "正在构建"}</span>
                        <div className="package-info">
                          <span className="margin10">buildId：{recordItem.buildId}</span>
                          <span className="margin10">时间：{recordItem.timeStamp}</span>
                          <span className="margin10 package-desc">描述：{recordItem.description}</span>
                          <span className="margin10 test-summary">提测概要：{recordItem.content}</span>
                        </div>
                      </div>
                    </div>

                    <div className="btn-package-container">
                      <Button type="primary" onClick={this.seeDetail.bind(this, recordItem.buildId)}>查看</Button>
                    </div>
                  </div>
                ))
              }
            </Panel>
          </Collapse>
          {<span className="loadMorePackage"
                 onClick={this.loadMorePackage.bind(this)}>{loadMorePackageText}</span>}
        </section>
      </article>
    )
  }
}

export default connect(state => {
  return ({
    unFinishList: state.get('system').get('unFinishList').toJS()
  })
}, {setUnFinishList})(UnFinishList);
