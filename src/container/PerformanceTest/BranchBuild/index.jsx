import React, {Component} from 'react';
import {Button, Collapse, Modal} from 'antd';
import PackgeItem from '@/components/PackageItem'
import "./index.scss"


const Panel = Collapse.Panel;

class BranchBuild extends Component {
  loadMoreBuild() {

  }


  taskCancel() {
  }

  seeDetail() {
  }

  packageDownload() {
  }

  report(url) {
    window.open(url)
  }

  download(url) {
    window.open(url)
  }

  showLog(reason){
    Modal.info({
      title: '失败信息提示',
      content: reason
    })
  }

  render() {
    let {successList, unfinishList, failureList, loadMore, hasMoreSuccess, hasMoreFailure, hasMoreUnfinish} = this.props;
    return (
      <div id="branch-build">
        {/*正在构建*/}
        <div className="package-building">
          <section className="package-container">
            <Collapse defaultActiveKey={['1']}>
              <Panel header="正在构建" key={1}>
                {
                  unfinishList.map((item, index) => (
                      <div className="package-item-container" key={index}>
                        <PackgeItem item={item} type="等待构建"/>
                        <div className="btn-package-container">
                          <Button style={{width: 88}} type="primary" onClick={
                            () => {
                              this.props.taskCancel(item.buildId,index)
                            }}>取消
                          </Button>
                        </div>
                      </div>
                    )
                  )
                }
              </Panel>
            </Collapse>
            <span className="load-more-build"
                  onClick={hasMoreUnfinish ? () => {
                    loadMore('unfinish')
                  } : void(0)}>{hasMoreUnfinish ? '加载更多' : '没有更多'}</span>
          </section>
          {/*构建成功列表*/}
          <section className="package-container">
            <Collapse defaultActiveKey={['1']}>
              <Panel header="构建成功" key={1}>
                {
                  successList.map((item, index) => (
                      <div className="package-item-container" key={index}>
                        <PackgeItem item={item} type="构建成功"/>
                        <div className="btn-package-container">
                          {
                            item.apkDownloadUrl ? <Button type="primary" style={{marginRight: '10px'}} onClick={this.download.bind(this, item.apkDownloadUrl)}>app下载</Button> : <Button style={{marginRight: '10px'}}>apk下载</Button>
                          }
                          {
                            item.reportUrl
                              ? <Button type="primary" onClick={this.report.bind(this, item.reportUrl)}>性能报告</Button>
                              : <Button disabled>性能报告</Button>
                          }

                        </div>
                      </div>
                    )
                  )
                }
              </Panel>
            </Collapse>
            <span className="load-more-build"
                  onClick={hasMoreSuccess
                    ? () => {
                      loadMore('success')
                    }
                    : void(0)}>{hasMoreSuccess ? '加载更多' : '没有更多'}</span>
          </section>

          <section className="package-container">
            <Collapse defaultActiveKey={['1']}>
              <Panel header="构建失败" key={1}>
                {
                  failureList.map((item, index) => (
                      <div className="package-item-container" key={index}>
                        <PackgeItem item={item} type="构建失败"/>
                        <div className="btn-package-container">
                          {
                            item.apkDownloadUrl ? <Button type="primary" style={{marginRight: '10px'}} onClick={this.download.bind(this, item.apkDownloadUrl)}>app下载</Button> : <Button type="primary" style={{marginRight: '10px'}} disabled>apk下载</Button>
                          }
                          <Button type="primary" style={{width: 88}} onClick={this.showLog.bind(this, item.failureReason)}>日志</Button>
                        </div>
                      </div>
                    )
                  )
                }
              </Panel>
            </Collapse>
            <span className="load-more-build"
                  onClick={hasMoreFailure ? () => {
                    loadMore('failure')
                  } : void(0)}>{hasMoreFailure ? '加载更多' : '没有更多'}</span>
          </section>
        </div>
      </div>
    )
  }
}

export default BranchBuild;