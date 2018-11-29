import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'

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
    package: [
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
    buildInfo: {
        'buildor': '吴俊',
        'branchName': 'origin/develop_td',
        'updateTime': '2018-11-24 18:04:43.0',
        'buildType': 1,
        'recordNo':'',
        'taskID':''
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
            updateTime: '',
            packageList: []
        }
    }

    showQR = (item)=>{
        console.log(item)
        const appUrl =`${window.location.origin}${item.filePath}`
        Modal.info({
            iconType:'download',
            title:'扫码下载',
            content:
                <div>
                    <Row align='center'>
                        <QRCode value={appUrl} width={250} />
                    </Row>
                    <Row  align='center'>
                        <Button><a href={appUrl} target="_blank">点击下载</a></Button>
                    </Row>

                </div>,
            onCancel() {},
        });
    }

    jumpToPipelineDetail = (recordNo, taskID) =>{
        
    }

    getDetail = () => {
        const {
            buildor,
            branchName,
            updateTime,
            buildType,
            recordNo,
            taskID
        } = fakeData.buildInfo

        const packageList = fakeData.package

        this.setState({
            buildor,
            branchName,
            updateTime,
            packageList,
            buildType,
            recordNo,
            taskID
        })
        this.setState({skeletonLoading: false})
        // reqGet('/package/detail', {
        //     buildId: this.props.match.params.buildId
        // }).then((res) => {
        //     if (res.code == 0) {
        //         const {
        //             version,
        //             taskMaster,
        //             codeBranch,
        //             fileName,
        //             fileSize,
        //             buildTime,
        //             submitDetails,
        //             submitContent,
        //             rebuildContent,
        //             imageUrl,
        //             openTesting,
        //             performanceProjectId,
        //             downloadPath,
        //             status,
        //             envName,
        //             taskId,
        //             envId,
        //
        //         } = res.data
        //
        //         this.setState({
        //             version,
        //             taskMaster,
        //             codeBranch,
        //             fileName,
        //             fileSize,
        //             buildTime,
        //             submitDetails,
        //             submitContent,
        //             rebuildContent,
        //             imageUrl,
        //             openTesting,
        //             performanceProjectId,
        //             downloadPath,
        //             status,
        //             envName,
        //             taskId,
        //             envId,
        //         })
        //         if (res.data.apkBuildId) {
        //             this.setState({apkBuildId: res.data.apkBuildId})
        //         }
        //     } else {
        //         Modal.info({
        //             title: '提示',
        //             content: (
        //                 <p>{res.msg}</p>
        //             ),
        //             onOk () {
        //             }
        //         })
        //     }
        // }).finally(() => {
        //     this.setState({
        //         loading: false,
        //         skeletonLoading: false,
        //     })
        // })
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
            updateTime,
            packageList,
            recordNo,
            taskID
        } = this.state

        let actionArray = []

        const packageType = {
            1:`源码`,
            2:`加固`,
            3:`补丁`
        }
        const enumBuildType = {
            1:`手动`,
            2:`git push`
        }

        return (
            <div className="pkgdetail">
                <Modal title="版本回归"
                       visible={regressModalVisible}
                       confirmLoading={addConfirmLoading}
                       onCancel={this.hideRegressModal}
                       maskClosable={false}
                       destroyOnClose={true}
                >

                </Modal>

                {
                    <Skeleton loading={this.state.skeletonLoading}>

                        <Card
                            style={{width: 560}}
                            actions={actionArray}
                        >
                            <Meta
                                description={
                                    <div>
                                        {packageList && packageList.map((item,index) => {
                                            return <Row key={index}>
                                                <Col span={12}>
                                                    <Row>
                                                        <Col>{packageType[item.packageType]}</Col>
                                                        <Col>大小：{item.appFileSize}</Col>
                                                    </Row>
                                                </Col>
                                                < Col span={12}>
                                                    <Button icon='qrcode' onClick={()=>this.showQR(item)}>点我下载</Button>
                                                </Col>
                                            </Row>
                                        })}
                                        <Row>
                                            <Col>
                                            <p>触发人：{buildor}</p>
                                            <p>触发类型：{enumBuildType[buildType]}</p>
                                            <p>构建分支：{branchName}</p>
                                            <p>时间：{updateTime}</p>
                                            </Col>
                                            <Col>
                                                <Button  onClick={()=>this.jumpToPipelineDetail(taskID,recordNo)}>查看报告</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                            />
                        </Card>
                    </Skeleton>
                }

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
