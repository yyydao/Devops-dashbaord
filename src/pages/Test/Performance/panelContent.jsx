import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Modal, Row, Col, Divider } from 'antd'

class panelContent extends Component {
  // constructor (props) {
  //   super(props)
  // }

  propTypes: {
    list: PropTypes.array.isRequired,
    showDetail: PropTypes.bool,
    handlerTaskCancel: PropTypes.func,
    handlerToDetail: PropTypes.func
  }

  showLog = (status) => {
    Modal.info({
      title: '日志',
      content: (
        <div>
          <p>{status}</p>
        </div>
      ),
      maskClosable: true,
      onOk () {},
    })
  }

  render () {
    const token = this.props.token ? this.props.token : ''

    return (
      <div>
        {
          this.props.list.map((item, index) => {
            let status
            /*eslint-disable default-case*/
            switch (item.status) {
              case 0:
                status = '构建成功'
                break
              case 1:
                status = '等待构建'
                break
              case 2:
                status = '正在构建'
                break
              case 3:
                status = '构建失败'
                break
              case 4:
                status = '取消构建'
                break
            }

            return <Row className="performance-item" key={index} type="flex" justify="space-between" align="middle">
              <Col span={20}>
                <Row type="flex" justify="start" align="middle">
                  <Col>
                    <img src={require('@/assets/favicon.ico')} alt={'icon'}/>
                  </Col>
                  <Col className='performance-item-info'>
                    <h2>{status}</h2>
                    <p>
                      <span title={item.buildId}><i>buildId：</i>{item.buildId}</span>
                      <span title={item.scene}><i>场景：</i>{item.scene}</span>
                      <span title={item.timeStamp}><i>时间：</i>{item.timeStamp}</span>
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                <div className="performance-item-ctrl">
                  {this.props.showDetail && <a onClick={
                    () => {
                      this.props.handlerToDetail && this.props.handlerToDetail(item.buildId)
                    }
                  }>提测详情<Divider type="vertical"/></a>}
                  {(item.status === 1 || item.status === 2) && <a onClick={() => {
                    this.props.handlerTaskCancel && this.props.handlerTaskCancel(item.buildId)
                  }}>取消</a>}
                  {(!this.props.showDetail && item.status === 0) && <a
                    href={`/performance/download/${item.buildId}?token=${token}`}>app下载</a>}
                  {item.status === 0 &&
                  <a href={`/performance/report/${item.buildId}?token=${token}`}
                     target="_blank"><Divider type="vertical"/>性能报告</a>}
                  {(item.status === 3 || item.status === 4) && <a onClick={() => {
                    this.showLog(status)
                  }}>日志</a>}
                </div>
              </Col>
            </Row>

          })
        }
      </div>
    )
  }
}

panelContent = connect((state) => {
  return {
    token: state.token
  }
})(panelContent)

export default panelContent
