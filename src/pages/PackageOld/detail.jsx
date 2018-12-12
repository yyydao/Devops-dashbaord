import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'

import {
    Breadcrumb,
    Button,
    Skeleton,
    Modal,
    message,
    Row,
    Col,
    Input,
    Form,
    Card,
} from 'antd'

const BreadcrumbItem = Breadcrumb.Item
const {TextArea} = Input
const {Meta} = Card
const FormItem = Form.Item

const QRCode = require('qrcode.react')

class packageDetail extends Component {
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
            skeletonloading:true,

            timer: null,

            version: '',
            taskMaster: '',
            codeBranch: '',
            fileName: '',
            fileSize: '',
            buildTime: '',
            submitDetails: '',
            submitContent: '',
            rebuildContent: '',
            imageUrl: '',
            openTesting: '',
            performanceProjectId: '',
            performanceProjectStatus: '',
            downloadPath: '',
            status: null,
            envName: '',
            taskId: '',
            envId: '',
            appUrl: '',
            apkBuildId: '',

            passwdBuild: 0,
            formDataUser: '',
            formDataPassword: ''
        }
    }

    getDetail = () => {
        clearTimeout(this.state.timer)

        reqGet('/package/detail', {
            buildId: this.props.match.params.buildId
        }).then((res) => {
            if (res.code === 0) {
                const {
                    version,
                    taskMaster,
                    codeBranch,
                    fileName,
                    fileSize,
                    buildTime,
                    submitDetails,
                    submitContent,
                    rebuildContent,
                    imageUrl,
                    openTesting,
                    performanceProjectId,
                    downloadPath,
                    status,
                    envName,
                    taskId,
                    envId,

                } = res.data

                this.setState({
                    version,
                    taskMaster,
                    codeBranch,
                    fileName,
                    fileSize,
                    buildTime,
                    submitDetails,
                    submitContent,
                    rebuildContent,
                    imageUrl,
                    openTesting,
                    performanceProjectId,
                    downloadPath,
                    status,
                    envName,
                    taskId,
                    envId,
                })
                if (res.data.apkBuildId) {
                    this.setState({apkBuildId: res.data.apkBuildId})
                }
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
                skeletonloading:false,
            })
        })
    }
    rebuild = () => {
        reqGet('/package/failure/recommit', {
            taskId: this.state.taskId
        }).then((res) => {
            Modal.info({
                title: '提示',
                content: (
                    <p>{res.code === 0 ? '已成功发起构建' : res.msg}</p>
                ),
                onOk () {
                }
            })
        })
    }
    //版本回归
    versionRegress = () => {
        const {envId, taskMaster, codeBranch, submitContent, submitDetails, regressDesc, formDataUser, formDataPassword} = this.state
        if (!this.state.regressDesc) {
            message.error('请输入回归内容')
            return
        }
        reqPost('/package/regression', {
            projectId: this.props.projectId,
            envId: envId,
            developer: taskMaster,
            branchName: codeBranch,
            content: submitContent,
            details: submitDetails,
            noticeEmails: '',
            regression: regressDesc,
            userName: formDataUser,
            password: formDataPassword
        }).then((res) => {
            if (res.code === 0) {
                message.success(res.msg)
            } else {
                message.error(res.msg)
            }
        })
        this.setState({
            regressModalVisible: false
        })
    }

    //显示回归的窗口
    showRegressModal = () => {
        this.setState({
            regressModalVisible: true
        })
    }

    //隐藏回归的窗口
    hideRegressModal = () => {
        this.setState({
            regressModalVisible: false,
            addConfirmLoading: false
        })
    }

    componentWillMount () {
        const oldProjectId = window.localStorage.getItem('oldProjectId')

        window.localStorage.setItem('oldProjectId', this.props.projectId)

        if (oldProjectId !== null && oldProjectId !== this.props.projectId) {
            this.props.history.push('/package')
        }
        let passwdBuild = 0
        if (this.props.location.state) {
            passwdBuild = this.props.location.state.passwdBuild
        }
        console.log(this.props)
        if (this.props.match.params.buildId) {
            this.getDetail()

            let breadcrumbPath = []
            try {
                let dataBreadcrumb = window.localStorage.getItem('detailBreadcrumbPath')
                if (dataBreadcrumb) {
                    breadcrumbPath = JSON.parse(dataBreadcrumb)
                }
            } catch (err) {
                console.log(err)
                breadcrumbPath = [{
                    path: '/package',
                    name: '安装包'
                }]
            }

            this.setState({
                breadcrumbPath,
                appUrl: `${window.location.origin}/package/download?buildId=${this.props.match.params.buildId}&token=${this.props.token ? this.props.token : ''}`,
                passwdBuild: passwdBuild
            })
        }
    }

    componentWillUnmount () {
        clearTimeout(this.state.timer)
    }

    render () {
        const {
            regressModalVisible, addConfirmLoading, breadcrumbPath,
            status, apkBuildId, fileName, version, fileSize, buildTime, taskMaster, codeBranch, submitDetails,
            submitContent, rebuildContent, appUrl, openTesting,
            formDataUser, regressDesc, formDataPassword, passwdBuild
        } = this.state

        let regressButton
        let rebuildButton
        let downloadButton
        let actionArray = []
        let cardTitle =<span color='#1890ff'>正在构建...</span>;

        if (status === 0) {
            cardTitle= fileName
            downloadButton =
                <Button ghost type="primary" icon="download"><a href={appUrl} target="_blank">下载</a></Button>
            actionArray.push(downloadButton)
        }

        if (openTesting) {
            regressButton = <Button ghost type="primary" icon="sync" onClick={this.showRegressModal}>版本回归</Button>
            actionArray.push(regressButton)
        }

        if (status === 1 || status === 2) {
            cardTitle= <span color='#f5222d'>failure</span>;
            rebuildButton = <Button ghost type="primary" icon="redo" onClick={this.rebuild}>重新提交</Button>
            actionArray.push(rebuildButton)
        }



        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        }

        return (
            <div className="pkgdetail">
                <Modal title="版本回归"
                       visible={regressModalVisible}
                       onOk={this.versionRegress}
                       confirmLoading={addConfirmLoading}
                       onCancel={this.hideRegressModal}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="提测人"
                        >
                            <p className="pForList">{taskMaster}</p>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="开发分支"
                        >
                            <p className="pForList">{codeBranch}</p>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="提测概要"
                        >
                            <p className="pForList">{submitContent}</p>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="提测详情"
                        >
                            <p className="pForList">{submitDetails}</p>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="回归内容"
                        >
              <TextArea rows={4} placeholder="回归内容（多行）" value={regressDesc} onChange={(e) => {
                  this.setState({regressDesc: e.target.value})
              }}/>
                        </FormItem>
                        {
                            passwdBuild === 1 &&
                            <div>
                                <FormItem
                                    {...formItemLayout}
                                    label="构建账号"
                                >
                                    <Input placeholder="构建账号" value={formDataUser} onChange={(e) => {
                                        this.setState({formDataUser: e.target.value})
                                    }}/>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="构建账号"
                                >
                                    <Input placeholder="构建账号" value={formDataPassword} onChange={(e) => {
                                        this.setState({formDataPassword: e.target.value})
                                    }}/>
                                </FormItem>
                            </div>
                        }
                    </Form>
                </Modal>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    {
                        breadcrumbPath.map((item, index) => {
                            return <BreadcrumbItem key={index}><Link to={item.path}>{item.name}</Link></BreadcrumbItem>
                        })
                    }
                    <BreadcrumbItem>安装包详情</BreadcrumbItem>
                </Breadcrumb>

                {
                    <Skeleton loading={this.state.skeletonloading}>

                    <Card
                        style={{width: 560}}
                        // cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                        actions={actionArray}
                    >
                        <Meta
                            // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={cardTitle}
                            description={
                                <div>
                                    <Row>
                                        <Col span={12}>
                                            <Row>
                                                { status === 0 &&
                                                <Col>版本：{version}</Col>}
                                                {status === 0 && this.state.apkBuildId && this.state.apkBuildId.length > 0 &&
                                                <Col>Code:{apkBuildId}</Col>}
                                                { status === 0 &&<Col>大小：{fileSize}</Col> }
                                                <Col>时间：{buildTime}</Col>
                                            </Row>
                                        </Col>
                                        <Col span={12}>
                                            { status === 0 &&
                                                <QRCode value={appUrl} size={170}/>
                                            }
                                        </Col>

                                    </Row>
                                    <Row>
                                        <p>提测人：{taskMaster}</p>
                                        <p>提测分支：{codeBranch}</p>
                                        <p>提测详情：{submitDetails}</p>
                                        <p>提测概要：</p>
                                        <p className="pkgdetail-info-desc">{submitContent}</p>
                                        {
                                            rebuildContent &&
                                            <div>
                                                <p>回归内容：</p>
                                                <p className="pkgdetail-info-desc">{rebuildContent}</p>
                                            </div>
                                        }

                                    </Row>
                                </div>
                            }
                        />
                    </Card>
                    </Skeleton>
                }

                {/*<dl className="pkgdetail-info">*/}
                {/*<dt>{envName}</dt>*/}
                {/*{*/}
                {/*status === 0 &&*/}
                {/*<dd>*/}
                {/*<div className="pkgdetail-info-1">*/}
                {/*<p>{fileName}</p>*/}
                {/*<Button type="primary"><a href={appUrl} target="_blank">下载</a></Button>*/}
                {/*{regressButton}*/}
                {/*</div>*/}
                {/*<div className="pkgdetail-info-2">*/}
                {/*<p>*/}
                {/*<span>版本：{version}</span>*/}
                {/*<span>大小：{fileSize}</span>*/}
                {/*<span>{buildTime}</span>*/}
                {/*</p>*/}
                {/*<QRCode value={appUrl} size={170}/>*/}
                {/*</div>*/}
                {/*</dd>*/}
                {/*}*/}
                {/*<dd>*/}
                {/*<p>提测人：{taskMaster}</p>*/}
                {/*<p>提测分支：{codeBranch}</p>*/}
                {/*<p>提测详情：{submitDetails}</p>*/}
                {/*<p>提测概要：</p>*/}
                {/*<p className="pkgdetail-info-desc">{submitContent}</p>*/}
                {/*{*/}
                {/*rebuildContent &&*/}
                {/*<div>*/}
                {/*<p>回归内容：</p>*/}
                {/*<p className="pkgdetail-info-desc">{rebuildContent}</p>*/}
                {/*</div>*/}
                {/*}*/}
                {/*</dd>*/}
                {/*{*/}
                {/*(status === 1 || status === 2) &&*/}
                {/*<dd>*/}
                {/*<Button type="primary" onClick={this.rebuild}>重新提交</Button>*/}
                {/*</dd>*/}
                {/*}*/}
                {/*</dl>*/}


            </div>
        )
    }
}

packageDetail = connect((state) => {
    return {
        token: state.token,
        projectId: state.projectId
    }
})(packageDetail)

export default packageDetail
