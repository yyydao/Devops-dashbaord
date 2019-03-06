import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import { reqGet } from '@/api/api'
import './list.scss';

import {
  Button,
  Skeleton,
  Modal,
  Icon,
  Row,
  Col,
  Popover,
} from 'antd'

const QRCode = require('qrcode.react')


class pipelinePackageDetail extends Component {
    constructor (props) {
        super(props)

        this.state = {
            recordNo: props.recordNo,
            taskID: props.taskID,
            buildId: props.buildId,
            fileType: props.fileType,

            addVisible: false,
            regressModalVisible: false,
            addConfirmLoading: false,
            branchList: [],
            sceneList: [],
            sceneIndeterminate: false,
            sceneCheckAll: false,
            breadcrumbPath: [],
            formDataBranch: null,
            formDataScene: [],
            formDataTime: '',
            formDataReDesc: '',
            regressDesc: '',
            loading: true,
            skeletonLoading: true,

            performanceProjectId: '',
            performanceProjectStatus: '',
            buildor: '',
            branchName: '',
            buildTime: '',
            packageList: []
        }
    }

    propTypes: {
        buildId: PropTypes.string.isRequired,
        recordNo:PropTypes.string.isRequired,
        taskID:PropTypes.string.isRequired,
        fileType:PropTypes.string.isRequired,
    }

    /**
     * 展示二维码
     * @param item 流水线包列表项目元信息
     */
    showQR = (item) => {
        console.log(item)
        const appUrl = item.filePath
        Modal.info({
            iconType: 'download',
            title: '扫码下载',
            content:
                <div>
                    <Row type="flex" align='middle' justify='center'>

                    </Row>
                    <Row type="flex" align='middle' justify='center' style={{'paddingTop':'16px'}}>
                        <Button><a href={appUrl} target="_blank">点击下载</a></Button>
                    </Row>

                </div>,
            onCancel () {},
        })
    }

    jumpToPipelineDetail = () => {
        const inheritFromParent={
            taskID: this.state.taskID,
            recordNo: this.state.recordNo,
            fileType:this.state.fileType,
            buildId:this.state.buildId
        }
        this.props.history.replace({
            pathname: `/pipeline/detail/${inheritFromParent.taskID}`,
            search: `?buildNumber=${inheritFromParent.buildId}&curRecordNo=${inheritFromParent.recordNo}&platform=${inheritFromParent.fileType}`,
            state:{
                taskStatus:2
            }
        })
    }

    getDetail = () => {

        // this.setState({skeletonLoading: false})
        reqGet('/pipeline/package/taskpackagedetail', {
            taskID: this.state.taskID,
            recordNo: this.state.recordNo,
        }).then((res) => {
            if (res.code === 0) {
                const {
                    buildor,
                    branchName,
                    buildTime,
                    buildType,
                } = res.record

                const packageList = res.data

                this.setState({
                    buildor,
                    branchName,
                    buildTime,
                    packageList,
                    buildType,
                })
            } else {
                Modal.info({
                    title: '提示',
                    content: (
                        <p>{res.msg}</p>
                    ),
                    onOk () {
                    }
                })
            }
        }).finally(() => {
            this.setState({
                loading: false,
                skeletonLoading: false,
            })
        })
    }
    componentWillReceiveProps (nextProps) {
        this.setState({
            recordNo: nextProps.recordNo,
            taskID: nextProps.taskID,
            buildId: nextProps.buildId,
            fileType: nextProps.fileType,
        }, () => this.getDetail())

    }


    componentWillMount () {
        // const oldProjectId = window.localStorage.getItem('oldProjectId')

        // window.localStorage.setItem('oldProjectId', this.props.projectId)
        //
        // if (oldProjectId !== null && oldProjectId !== this.props.projectId) {
        //     this.props.history.push('/package')
        // }
        this.getDetail()

            // this.setState({
            //     breadcrumbPath,
            //     appUrl: `${window.location.origin}/package/download?buildId=${this.props.match.params.buildId}&token=${this.props.token ? this.props.token : ''}`,
            //     passwdBuild: passwdBuild
            // })
    }

    render () {
        const {
            regressModalVisible,
            addConfirmLoading,
            buildor,
            buildType,
            branchName,
            buildTime,
            packageList,
            recordNo,
            taskID
        } = this.state

        let actionArray = []

        const packageType = {
            1: `源包`,
            2: `加固包`,
            3: `补丁包`
        }
        const enumBuildType = {
            1: `手动`,
            2: `git push`
        }

        return (
            <div className="pipeline-package-detail">
                <Modal title="版本回归"
                       visible={regressModalVisible}
                       confirmLoading={addConfirmLoading}
                       onCancel={this.hideRegressModal}
                       maskClosable={false}
                       destroyOnClose={true}
                >

                </Modal>

                <Skeleton loading={this.state.skeletonLoading}>
                  <div className='detail-card'>

                    <div className="detail-meta">
                      <div className="detail-meta-content">

                        <div className="detail-info detail-main">
                          {packageList && packageList.map((item, index) => {
                            return <Row type="flex" justify="space-between" align="middle" key={index} className='detail-row'>
                              <Col span={18}>
                                <Row>
                                  <Col><h3>{packageType[item.packageType]}</h3></Col>
                                  <Col>大小：{item.appFileSize}</Col>
                                </Row>
                              </Col>
                              < Col span={6} className="align-right">
                                <Popover style={{width:'198px'}} placement="bottomRight" trigger="click" content={<QRCode value={item.ipaPath} />}>
                                  <Icon style={{'cursor':'pointer',fontSize:24,verticalAlign:"middle"}} type='qrcode'/>
                                </Popover>

                                <Button type='primary' size="small" style={{marginLeft:'18px',verticalAlign:"middle"}}><a href={item.filePath} target="_blank">下载</a></Button>
                              </Col>
                            </Row>
                          })}
                          <Row type="flex" justify="space-between" align="bottom" className='detail-row build-info'>
                            <Col  span={20}>
                              <p>触发人：{buildor}</p>
                              <p>触发类型：{enumBuildType[buildType]}</p>
                              <p>构建分支：{branchName}</p>
                              <p>时间：{buildTime}</p>
                            </Col>
                            <Col  span={4} className="align-right">
                              <Button
                                style={{marginBottom:'12px'}}
                                onClick={() => this.jumpToPipelineDetail(taskID, recordNo)}>查看报告</Button>
                            </Col>
                          </Row>
                        </div>

                      </div>
                      <div className="detail-action">{actionArray}</div>
                    </div>
                  </div>
                </Skeleton>

            </div>
        )
    }
}

pipelinePackageDetail = connect((state) => {
    return {
        token: state.auth.token,
      projectId: state.project.projectId
    }
})(pipelinePackageDetail)

export default withRouter(pipelinePackageDetail)
