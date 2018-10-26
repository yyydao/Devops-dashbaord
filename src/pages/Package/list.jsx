import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reqPost, reqGet } from '@/api/api';
import './list.scss';
import VersionPanel from './versionPanel';

import { Breadcrumb, Icon, Button, Radio, Input, Collapse, Modal, Select, Pagination, Popconfirm, message } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;
const Option = Select.Option;


class PackageTest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            envId: null,
            envName: '',
            passwdBuild: 0,
            breadcrumbPath: [],

            modalVisible: false,
            modalConfirmLoading: false,
            modalType: 1,
            branchList: [],
            formDataBranch: null,
            formDataName: '',
            fromDataMail: '',
            formDataDesc: '',
            formDataWiki: '',
            formDataReDesc: '',
            formDataUser: '',
            formDataPassword: '',
            timer: null,
            timerStart: null,

            typeValue: 1,
            typeList: [
                {
                    name: '查看成功列表',
                    value: 1
                },
                {
                    name: '查看失败列表',
                    value: 2
                }
            ],
            
            versionTotal: 0,
            versionPage: 1,
            versionList: [],

            buildingLoading: false,
            buildingTotal: 0,
            buildingPage: 1,
            buildingList: [],

            failureLoading: false,
            failureTotal: 0,
            failurePage: 0,
            failureList: []
        }
    }

    //切换显示提测窗口
    toggleBuildModal = (isShow=true, modalType=1) => {
        const newState = {
            modalVisible: isShow,
            modalType: modalType,
            modalConfirmLoading: false
        };

        if (isShow) {
            this.getBranchList();
        } else {
            newState.formDataName = '';
            newState.fromDataMail = '';
            newState.formDataDesc = '';
            newState.formDataWiki = '';
            newState.formDataReDesc = '';
            newState.formDataUser = '';
            newState.formDataPassword = '';
        }

        this.setState(newState);
    }

    //Input && Textarea 数据绑定
    bindInput = (e, name) => {
        const newState = {};
        newState[name] = e.target.value;
        this.setState(newState)
    }

    //获取分支列表
    getBranchList = (value='') => {
        reqPost('/branch/selectBranch', {
            projectId: this.props.projectId,
            branchName: value,
            pageSize: 100,
            pageNum: 1,
            type: 1,
            search: value ? 1 : ''
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    branchList: res.data
                });
            }
        })
    }

    //修改选中分支
    changeBranch = (formDataBranch) => {
        this.setState({
            formDataBranch
        });
    }

    addBuild = () => {
        const { envId, passwdBuild, formDataName, formDataBranch, fromDataMail, formDataDesc, formDataWiki, formDataReDesc, formDataUser, formDataPassword, modalType } = this.state;
        const url = modalType === 1 ? '/package/addSubmit' : '/package/regression';
        
        if (!formDataName) {
            message.error('请填写“提测人”');
            return;
        } else if (!formDataBranch) {
            message.error('请选择“开发分支”');
            return;
        }

        if (passwdBuild === 1) {
            if (!formDataUser) {
                message.error('请填写“构建账号”');
                return;
            } else if (!formDataPassword) {
                message.error('请选择“构建密码”');
                return;
            }
        }


        this.setState({
            modalConfirmLoading: true
        });

        reqPost(url, {
            projectId: this.props.projectId,
            envId: envId,
            developer: formDataName,
            branchName: formDataBranch,
            content: formDataDesc,
            details: formDataWiki,
            noticeEmails: fromDataMail,
            userName: formDataUser,
            password: formDataPassword,
            regression: formDataReDesc
        }).then((res) => {
            this.toggleBuildModal(false);

            if (res.code == 0) {
                this.getBuildingList();
            } else {
                Modal.info({
                    title: '提示',
                    content: (
                        <p>{res.msg}</p>
                    ),
                    onOk() {}
                });
            }
        })
    }

    cancelTask = (id) => {
        const { envId } = this.state;
        reqPost('/package/cancel', {
            buildId: id,
            type: 0,
            envId: envId
        }).then((res) => {
            if (res.code != 0) {
                Modal.info({
                    title: '提示',
                    content: (
                        <p>{res.msg}</p>
                    ),
                    onOk() {}
                });
            } else {
                this.getBuildingList();
            }
        })
    }

    changeType = (e) => {
        const newValue = e.target.value;
    
        clearTimeout(this.state.timer);

        this.setState({
            typeValue: newValue,
            versionTotal: 0,
            versionPage: 1,
            versionList: [],
            buildingLoading: false,
            buildingTotal: 0,
            buildingPage: 1,
            buildingList: [],
            failureTotal: 0,
            failurePage: 0,
            failureList: [],
            timer: null
        }, () => {
            if (newValue === 1) {
                this.getVersionList();
                this.getBuildingList();
            } else {
                this.getFailureList();
            }
        })
    }

    getFailureList = (loadMore=0) => {
        const { envId, failureTotal, failurePage, failureList } = this.state;

        if (loadMore !== 0 && failurePage > failureTotal) return;

        reqGet('/package/failure/record', {
            envId: envId,
            page: failurePage + 1,
            count: 3
        }).then((res) => {
            if (res.code === 0) {
                this.setState({
                    failureTotal: res.total,
                    failurePage: loadMore === 0 ? 1 : failurePage + 1,
                    failureList: loadMore === 0 ? res.data : failureList.concat(res.data)
                })
            }
        })
    }

    getVersionList = (loadMore=0) => {
        const { envId, versionPage, versionList } = this.state;

        reqGet('/package/version/more', {
            envId: envId,
            page: versionPage
        }).then((res) => {
            if (res.code === 0) {
                const dataVersionList = res.data.map((item, index) => {
                        return item.version
                    });

                this.setState({
                    versionTotal: res.total,
                    versionPage: versionPage + 1,
                    versionList: loadMore === 0 ? dataVersionList : versionList.concat(dataVersionList)
                });
            }
        })
    }

    getBuildingList = (loadMore=0) => {
        console.log(`======= ${loadMore}`)
        const { envId, buildingPage, buildingTotal, buildingList, timer, typeValue } = this.state;

        if (loadMore !== 0 && buildingPage > buildingTotal) return;

        if (timer) {
            clearTimeout(timer);
            this.setState({
                timer: null
            });
        }

        reqGet('/package/unfinish/list', {
            envId: envId,
            page: loadMore === 0 ? buildingPage : buildingPage+1,
            count: 3
        }).then((res) => {
            if (res.code === 0) {
                this.setState({
                    buildingTotal: res.total,
                    buildingPage: loadMore === 0 ? 1 : buildingPage + 1,
                    buildingList: loadMore === 0 ? res.data : this.state.buildingList.concat(res.data),
                    timer: res.data.length && typeValue === 1 && (new Date().getTime() - this.state.timerStart < 3600000) ? setTimeout(this.getBuildingList, 10e3) : null
                });
            }
        })
    }

    componentWillMount() {
        const oldProjectId = window.localStorage.getItem('oldProjectId');

        window.localStorage.setItem('oldProjectId', this.props.projectId);

        if (oldProjectId !== null && oldProjectId !== this.props.projectId) {
            this.props.history.push('/package');
        }

        let envId, envName = '', passwdBuild = null;

        if (this.props.location.state) {
            envId = this.props.location.state.envId;
            envName = this.props.location.state.envName;
            passwdBuild = this.props.location.state.passwdBuild;
        } else if (this.props.match.params.envId) {
            envId = this.props.match.params.envId;

            let envList = window.localStorage.getItem('envList');
            if (envList) {
                try {
                    const target = JSON.parse(envList).filter((item) => {
                        return item.id == envId;
                    })
                    envName = target[0].name;
                    passwdBuild = target[0].passwdBuild;
                } catch (err) {
                    console.log(err);
                }
            }
        }

        if (envId && passwdBuild !== null) {
            this.setState({
                envId,
                envName,
                passwdBuild,
                breadcrumbPath: [
                    {
                        path: '/package',
                        name: '安装包'
                    },
                    {
                        path: '/package/' + envId,
                        name: envName
                    }
                ]
            }, () => {
                this.getVersionList();
                this.getBuildingList();
                window.localStorage.setItem('detailBreadcrumbPath', JSON.stringify(this.state.breadcrumbPath));
            });
        } else {
            this.props.history.push('/package');
        }

        this.setState({
            timerStart: new Date().getTime()
        })
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);

        this.setState = (state,callback)=>{
            return;
        }
    }

    render() {
        const { breadcrumbPath, modalVisible, modalConfirmLoading, modalType, formDataName, formDataBranch, fromDataMail, formDataDesc, formDataWiki, formDataReDesc, formDataUser, formDataPassword, branchList, typeValue, typeList, envId, envName, passwdBuild, versionList, versionPage, versionTotal, buildingLoading, buildingList, failureLoading, failurePage, failureTotal, failureList } = this.state;

        return (
            <div className="package">
                <Modal title="新增提测"
                    visible={modalVisible}
                    onOk={this.addBuild}
                    confirmLoading={modalConfirmLoading}
                    onCancel={() => {
                        this.toggleBuildModal(false)
                    }}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <div className="package-modal-item">
                        <Input placeholder="提测人" style={{ width: 100, marginRight: 20 }} value={formDataName} onChange={(e) => {
                            this.bindInput(e, 'formDataName');
                        }} />
                        <Select placeholder="开发分支"
                                showSearch
                                value={formDataBranch}
                                onSearch={this.getBranchList}
                                onChange={this.changeBranch}
                                style={{ width: 300 }}>
                            {
                                branchList.map((item) => {
                                    return <Option value={item.name} key={item.id} title={item.name}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>

                    <div className="package-modal-item">
                        <TextArea rows={4} placeholder="通知人员（邮箱地址，以','号分隔）" value={fromDataMail} onChange={(e) => {
                            this.bindInput(e, 'fromDataMail');
                        }}/>
                    </div>

                    <div className="package-modal-item">
                        <TextArea rows={6} placeholder="提测概要（多行，请按实际情况填写）" value={formDataDesc} onChange={(e) => {
                            this.bindInput(e, 'formDataDesc');
                        }}/>
                    </div>

                    <div className="package-modal-item">
                        <Input placeholder="提测详情（Wiki文档）" value={formDataWiki} onChange={(e) => {
                            this.bindInput(e, 'formDataWiki');
                        }} />
                    </div>

                    {
                        modalType === 2 && <div className="package-modal-item">
                                                <TextArea rows={4} placeholder="回归内容（多行）" value={formDataReDesc} onChange={(e) => {
                                                    this.bindInput(e, 'formDataReDesc');
                                                }}/>
                                            </div>
                    }

                    {
                        passwdBuild === 1 && 
                        <div>
                            <div className="package-modal-item">
                                <Input placeholder="构建账号" value={formDataUser} onChange={(e) => {
                                    this.bindInput(e, 'formDataUser');
                                }} />
                            </div>

                            <div className="package-modal-item">
                                <Input placeholder="构建密码" value={formDataPassword} onChange={(e) => {
                                    this.bindInput(e, 'formDataPassword');
                                }} />
                            </div>
                        </div>
                    }

                </Modal>


                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    {
                        breadcrumbPath.map((item, index) => {
                            return <BreadcrumbItem key={index}>
                                        {
                                            index === breadcrumbPath.length - 1 ? 
                                            <span>{item.name}</span> : <Link to={item.path}>{item.name}</Link>
                                        }
                                    </BreadcrumbItem>
                        })
                    }
                </Breadcrumb>


                <div className="package-menu">
                    <Button type="primary" onClick={() => {
                        this.toggleBuildModal(true, 1)
                    }}>新增提测</Button>
                    <Button type="primary" onClick={() => {
                        this.toggleBuildModal(true, 2)
                    }}>版本回归</Button>

                    <Radio.Group value={typeValue} onChange={this.changeType} className="fr">
                        {
                            typeList.map((item, index) => {
                                return <Radio.Button value={item.value} key={index}>{item.name}</Radio.Button>
                            })
                        }
                    </Radio.Group>
                </div>
                
                {
                    typeValue === 1 &&  
                    <div className="package-main">
                        <Collapse defaultActiveKey={['0']}>
                            <Panel header="构建队列" key="0" className="package-container">
                                <div className={`package-container-load ${buildingLoading ? 'act' : ''}`} onClick={
                                    () => {
                                        this.getBuildingList(1)
                                    }
                                }>{buildingLoading && <Icon type="loading" theme="outlined" />} 加载更多</div>

                                {
                                    buildingList.map((item, index) => {
                                        return <div className="package-item" key={index}>
                                                    <img src={require('@/assets/favicon.ico')} />
                                                    <h2>正在构建</h2>
                                                    <p>
                                                        <span title={item.buildId}><i>buildId:</i>{item.buildId}</span>
                                                        <span title={item.description}><i>描述:</i>{item.description}</span>
                                                        <span title={item.timeStamp}><i>时间:</i>{item.timeStamp}</span>
                                                        <span title={item.content}><i>提测概要:</i>{item.content}</span>
                                                    </p>
                                                    <div className="package-item-ctrl">
                                                        <Button type="primary" onClick={
                                                            () => {
                                                                this.cancelTask(item.buildId)
                                                            }
                                                        }>取消</Button>
                                                        <Button type="primary"><Link to={`/package/detail/${item.buildId}`}>查看</Link></Button>
                                                    </div>
                                                </div>
                                    })
                                }
                            </Panel>
                        </Collapse>

                        {
                            versionList.map((item, index) => {
                                return <VersionPanel version={item} envId={envId} key={item} />
                            })
                        }

                        {
                            versionPage <= versionTotal && <div style={{'height': 100, 'marginTop': 15, 'textAlign': 'center'}}><Button type="primary" onClick={() => {
                                                                this.getVersionList(1)
                                                            }}>加载更多</Button></div>
                        }
                    </div>
                }

                {
                    typeValue === 2 &&  
                    <div className="package-main">
                        <Collapse defaultActiveKey={['0']}>
                            <Panel header="失败列表" key="0" className="package-container">
                                <div className={`package-container-load ${failureLoading ? 'act' : ''}`} onClick={
                                    () => {
                                        this.getFailureList(1)
                                    }
                                }>{failureLoading && <Icon type="loading" theme="outlined" />} 加载更多</div>

                                {
                                    failureList.map((item, index) => {
                                        return <div className="package-item" key={index}>
                                                    <img src={require('@/assets/favicon.ico')} />
                                                    <h2>失败原因：{item.failedReason}</h2>
                                                    <p>
                                                        <span title={item.buildId}><i>buildId:</i>{item.buildId}</span>
                                                        <span title={item.buildTime}>{item.buildTime}</span>
                                                        <span title={item.description}>{item.content}</span>
                                                        <span title={item.content}><i>提测概要:</i>{item.content}</span>
                                                    </p>
                                                    <div className="package-item-ctrl">
                                                        <Button type="primary"><Link to={`/package/detail/${item.buildId}`}>查看</Link></Button>
                                                    </div>
                                                </div>
                                    })
                                }
                            </Panel>
                        </Collapse>
                    </div>
                }

            </div>
        )
    }
}

PackageTest = connect((state) => {
    return {
        projectId: state.projectId
    }
})(PackageTest)

export default PackageTest;