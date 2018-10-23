import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {reqPost, reqGet} from '@/api/api';
import './list.scss';

import {
    Breadcrumb,
    Button,
    Spin,
    Modal,
    Select,
    TimePicker,
    Checkbox,
    message
} from 'antd';

const Option = Select.Option;
const BreadcrumbItem = Breadcrumb.Item;
const CheckboxGroup = Checkbox.Group;

const QRCode = require('qrcode.react');

class packageDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addVisible: false,
            addConfirmLoading: false,
            branchList: [],
            sceneList: [],
            sceneIndeterminate: false,
            sceneCheckAll: false,
            breadcrumbPath: [],
            formDataBranch: null,
            formDataScene: [],
            formDataTime: '',
            loading: true,

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

            appUrl: ''
        }
    }

    getDetail = () => {
        clearTimeout(this.state.timer);

        reqGet('/package/detail', {
            buildId: this.props.match.params.buildId
        }).then((res) => {
            if (res.code == 0) {
                const {version, taskMaster, codeBranch, fileName, fileSize, buildTime, submitDetails, submitContent, rebuildContent, imageUrl, openTesting, performanceProjectId, performanceProjectStatus, downloadPath, status, envName, taskId} = res.data;

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
                    performanceProjectStatus,
                    downloadPath,
                    status,
                    envName,
                    taskId,
                    timer: (performanceProjectStatus === 1 || performanceProjectStatus === 2) ? setTimeout(this.getDetail, 10e3) : null
                })
            } else {
                Modal.info({
                    title: '提示',
                    content: (
                        <p>{res.msg}</p>
                    ),
                    onOk() {
                    }
                });
            }
        }).finally(() => {
            this.setState({
                loading: false
            })
        })
    }

    runTest = () => {
        reqGet('/package/performance', {
            buildId: this.props.match.params.buildId
        }).then((res) => {
            if (res.code == 0) {
                this.getDetail()
            }
        })
    }

    rebuild = () => {
        reqGet('/package/failure/recommit', {
            taskId: this.state.taskId
        }).then((res) => {
            Modal.info({
                title: '提示',
                content: (
                    <p>{res.code == 0 ? '已成功发起构建' : res.msg}</p>
                ),
                onOk() {
                }
            });
        })
    }

    //新建构建任务
    addItem = () => {
        const {typeValue, formDataBranch, formDataScene, formDataTime} = this.state;

        if (formDataScene.length < 1) {
            message.error('请选择“执行场景”');
            return;
        }
        this.setState({
            addConfirmLoading: true
        });

        reqGet('/package/performance', {
            buildId: this.props.match.params.buildId,
            sceneId: formDataScene.join(','),
        }).then((res) => {
            if (res.code == 0) {
                this.hideModal();
                this.getDetail();
            }
        })

    }

    //显示新建窗口
    showModal = () => {
        this.getSceneList();
        this.setState({
            addVisible: true
        });
    }


    //隐藏新建窗口
    hideModal = () => {
        this.setState({
            addVisible: false,
            addConfirmLoading: false,
            sceneIndeterminate: false,
            sceneCheckAll: false,
            formDataBranch: null,
            formDataScene: [],
            formDataTime: ''
        });
    }

    //获取场景列表
    getSceneList = () => {
        reqGet('/testScene/list/' + this.props.projectId).then(res => {
            if (res.code == 0) {
                this.setState({
                    sceneList: res.data.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    })
                });
            }
        })
    }

    //全选场景
    checkAllScene = (e) => {
        this.setState({
            formDataScene: e.target.checked ? this.state.sceneList.map(item => {
                return item.value
            }) : [],
            sceneIndeterminate: false,
            sceneCheckAll: e.target.checked
        });
    }

    //修改选中场景
    changeScene = (formDataScene) => {
        this.setState({
            formDataScene,
            sceneIndeterminate: !!formDataScene.length && (formDataScene.length < this.state.sceneList.length),
            sceneCheckAll: formDataScene.length === this.state.sceneList.length
        });
    }

    componentWillMount() {
        const oldProjectId = window.localStorage.getItem('oldProjectId');

        window.localStorage.setItem('oldProjectId', this.props.projectId);

        if (oldProjectId !== null && oldProjectId !== this.props.projectId) {
            this.props.history.push('/package');
        }

        if (this.props.match.params.buildId) {
            this.getDetail();

            let breadcrumbPath = [];
            try {
                let dataBreadcrumb = window.localStorage.getItem('detailBreadcrumbPath');
                if (dataBreadcrumb) {
                    breadcrumbPath = JSON.parse(dataBreadcrumb);
                }
            } catch (err) {
                console.log(err)
                breadcrumbPath = [{
                    path: '/package',
                    name: '安装包'
                }];
            }

            this.setState({
                breadcrumbPath,
                appUrl: `${window.location.origin}/package/download?buildId=${this.props.match.params.buildId}&token=${this.props.token ? this.props.token : ''}`
            })
        }
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);
    }

    render() {
        const {
            addVisible, addConfirmLoading, branchList, breadcrumbPath, formDataBranch,
            sceneIndeterminate, sceneCheckAll, sceneList, formDataScene,
            status, envName, fileName, version, fileSize, buildTime, imageUrl, taskMaster, codeBranch, submitDetails,
            submitContent, rebuildContent, loading, appUrl, openTesting, performanceProjectId, performanceProjectStatus
        } = this.state;

        let performanceButton;

        if (openTesting) {
            switch (true) {
                case performanceProjectStatus === 1:
                    performanceButton = <Button type="primary" disabled>等待构建中</Button>;
                    break;

                case performanceProjectStatus === 2:
                    performanceButton = <Button type="primary" disabled>性能测试中</Button>;
                    break;

                case performanceProjectStatus === 0:
                    performanceButton = <Button type="primary"><a
                        href={`/performance/report/${performanceProjectId}?token=${this.props.token ? this.props.token : ''}`}
                        target="_blank">性能报告</a></Button>;
                    break;

                default:
                    performanceButton = <Button type="primary" onClick={this.showModal}>性能测试</Button>;
            }
        }


        return (
            <div className="pkgdetail">
                <Modal title="新增提测性能测试"
                       visible={addVisible}
                       onOk={this.addItem}
                       confirmLoading={addConfirmLoading}
                       onCancel={this.hideModal}
                       maskClosable={false}
                       destroyOnClose={true}
                >

                    <div className="performance-modal-item">
                        <label className="performance-modal-item-label">执行场景：</label>
                        <div className="performance-modal-item-content performance-modal-checkbox-group">
                            <Checkbox
                                indeterminate={sceneIndeterminate}
                                onChange={this.checkAllScene}
                                checked={sceneCheckAll}
                            >
                                全部
                            </Checkbox>
                            <CheckboxGroup options={sceneList} value={formDataScene} onChange={this.changeScene}/>
                        </div>
                    </div>
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
                    loading ? (
                        <Spin/>
                    ) : (
                        <dl className="pkgdetail-info">
                            <dt>{envName}</dt>
                            {
                                status === 0 &&
                                <dd>
                                    <div className="pkgdetail-info-1">
                                        <p>{fileName}</p>
                                        <Button type="primary"><a href={appUrl} target="_blank">下载</a></Button>
                                        {performanceButton}
                                    </div>
                                    <div className="pkgdetail-info-2">
                                        <p>
                                            <span>版本：{version}</span>
                                            <span>大小：{fileSize}</span>
                                            <span>{buildTime}</span>
                                        </p>
                                        <QRCode value={appUrl} size={170}/>
                                    </div>
                                </dd>
                            }
                            <dd>
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
                            </dd>
                            {
                                (status === 1 || status === 2) &&
                                <dd>
                                    <Button type="primary" onClick={this.rebuild}>重新提交</Button>
                                </dd>
                            }
                        </dl>
                    )
                }


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

export default packageDetail;