import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reqPost, reqGet } from '@/api/api'
import './list.scss';

import {
    Button,
    Skeleton,
    Modal,
    message,
    Icon,
    Row,
    Col,
    Card,
} from 'antd'

const {Meta} = Card
const info = Modal.confirm

const QRCode = require('qrcode.react')

const fakeData = {
    data: [
        {
            'packageType': 1,
            'fileName': 'app-normal-debug.apk',
            'versionName': 'V5.4.1',
            'appFileSize': '26.84MB',
            'filePath': './package/d53d33cb21e24ce58b1658816491f8852kuV00/Android/code_source/20181124180443/app-normal-debug.apk',
            'updateTime': '2018-11-24 18:04:43.0',

            'fileType': 1,
            'recordNo': '',
            'taskID': ''
        },
        {
            'packageType': 1,
            'fileName': 'app-normal-debug.apk',
            'versionName': 'V5.4.1',
            'appFileSize': '26.84MB',
            'filePath': './package/d53d33cb21e24ce58b1658816491f8852kuV00/Android/code_source/20181124180443/app-normal-debug.apk',

            'fileType': 1,
            'recordNo': '',
            'taskID': ''
        }
    ],
    record: {
        'buildor': '吴俊',
        'branchName': 'origin/develop_td',
        'buildTime': '2018-11-24 18:04:43.0',
        'buildType': 1,
        'recordNo': '',
        'taskID': ''
    }
}

class pipelinePackageDetail extends Component {
    constructor (props) {
        super(props)

        this.state = {
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

    /**
     * 展示二维码
     * @param item 流水线包列表项目元信息
     */
    showQR = (item) => {
        console.log(item)
        const appUrl = `${window.location.origin}${item.filePath}`
        Modal.info({
            iconType: 'download',
            title: '扫码下载',
            content:
                <div>
                    <Row type="flex" align='middle' justify='center'>
                        <QRCode value={appUrl} width={250}/>
                    </Row>
                    <Row type="flex" align='middle' justify='center' style={{'paddingTop':'16px'}}>
                        <Button><a href={appUrl} target="_blank">点击下载</a></Button>
                    </Row>

                </div>,
            onCancel () {},
        })
    }

    jumpToPipelineDetail = (recordNo, taskID) => {
        this.props.location.replace({
            pathname: `/pipeline/`
        })
    }

    getDetail = () => {

        this.setState({skeletonLoading: false})
        reqGet('/pipeline/package/taskpackagedetail', {
            taskID: 'd53d33cb21e24ce58b1658816491f8852kuV00',
            recordNo: '954f602a265048a181e164ce79a8e6f2oW3505'
        }).then((res) => {
            if (res.code == 0) {
                const {
                    buildor,
                    branchName,
                    buildTime,
                    buildType,
                    recordNo,
                    taskID
                } = res.record

                const packageList = res.data

                this.setState({
                    buildor,
                    branchName,
                    buildTime,
                    packageList,
                    buildType,
                    recordNo,
                    taskID
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

    componentWillMount () {
        const oldProjectId = window.localStorage.getItem('oldProjectId')

        window.localStorage.setItem('oldProjectId', this.props.projectId)

        if (oldProjectId !== null && oldProjectId !== this.props.projectId) {
            this.props.history.push('/package')
        }
        this.getDetail()
        if (this.props.match.params.buildId) {

            // this.setState({
            //     breadcrumbPath,
            //     appUrl: `${window.location.origin}/package/download?buildId=${this.props.match.params.buildId}&token=${this.props.token ? this.props.token : ''}`,
            //     passwdBuild: passwdBuild
            // })
        }
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

                    <Card
                        style={{width: 560}}
                        actions={actionArray}
                    >
                        <Meta
                            description={
                                <div class="detail-info">
                                    {packageList && packageList.map((item, index) => {
                                        return <Row type="flex" justify="space-around" align="middle" key={index} className='detail-row'>
                                            <Col span={12}>
                                                <Row>
                                                    <Col>{packageType[item.packageType]}</Col>
                                                    <Col>大小：{item.appFileSize}</Col>
                                                </Row>
                                            </Col>
                                            < Col span={12}>
                                                <Icon style={{'cursor':'pointer'}} type='qrcode'  onClick={() => this.showQR(item)}/>
                                                <a style={{'paddingLeft':'14px'}}  target="_blank" href={`${window.location.origin}${item.filePath}`}>点我下载</a>
                                            </Col>
                                        </Row>
                                    })}
                                    <Row type="flex" justify="space-around" align="middle" className='detail-row build-info'>
                                        <Col  span={12}>
                                            <p>触发人：{buildor}</p>
                                            <p>触发类型：{enumBuildType[buildType]}</p>
                                            <p>构建分支：{branchName}</p>
                                            <p>时间：{buildTime}</p>
                                        </Col>
                                        <Col  span={12}>
                                            <Button
                                                onClick={() => this.jumpToPipelineDetail(taskID, recordNo)}>查看报告</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        />
                    </Card>
                </Skeleton>

            </div>
        )
    }
}

pipelinePackageDetail = connect((state) => {
    return {
        token: state.token,
        projectId: state.projectId
    }
})(pipelinePackageDetail)

export default pipelinePackageDetail
