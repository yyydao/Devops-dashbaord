import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.scss';
import { reqGet, reqPost } from '@/api/api';

import { Breadcrumb, Icon, Button, Radio, Collapse, Modal, Select, Checkbox, message, TimePicker, Pagination, Popconfirm } from 'antd';
import PanelContent from './panelContent';
const BreadcrumbItem = Breadcrumb.Item;
const Panel = Collapse.Panel;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;


class Performance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addVisible: false,
            addConfirmLoading: false,
            branchList: [],
            sceneList: [],
            sceneIndeterminate: false,
            sceneCheckAll: false,
            formDataBranch: null,
            formDataScene: [],
            formDataTime: '',

            taskListVisible: false,
            taskListTotalCount: 1,
            taskListPage: 1,
            taskList: [],


            typeValue: 1,
            typeList: [
                {
                    name: '分支测试',
                    value: 1
                },
                {
                    name: '定时测试',
                    value: 2
                },
                {
                    name: '提测包测试',
                    value: 3
                }
            ],

            timer: null,
            timerStart: null,
            buildingOldSize: 0,
            buildingList: {
                title: '正在构建',
                url: '/task/building/list',
                loading: false,
                page: 1,
                list: []
            },

            successList: {
                title: '构建成功',
                url: '/task/success/list',
                loading: false,
                page: 1,
                list: []
            },

            failureList: {
                title: '构建失败',
                url: '/task/failure/list',
                loading: false,
                page: 1,
                list: []
            }
        }
    }

    //新建构建任务
    addItem = () => {
        const { typeValue, formDataBranch, formDataScene, formDataTime } = this.state;

        if (!formDataBranch) {
            message.error('请选择“开发分支”');
            return;
        } else if (formDataScene.length < 1) {
            message.error('请选择“执行场景”');
            return;
        }else if (this.state.typeValue === 2 && !formDataTime) {
            message.error('请选择“定时时间”');
            return;
        }

        this.setState({
            addConfirmLoading: true
        });

        reqPost('/task/addSubmit', {
            projectId: Number(this.props.projectId),
            buildType: typeValue,
            branchName: formDataBranch,
            sceneId: formDataScene.join(','),
            fixTime: formDataTime
        }).then(res => {
            this.hideModal();

            if (res.code == 0) {
                this.getList('buildingList');    
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

    //显示新建窗口
    showModal = () => {
        this.getBranchList();
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

    //获取分支列表
    getBranchList = (value='') => {
        reqPost('/branch/selectBranch', {
            projectId: this.props.projectId,
            branchName: value,
            pageSize: 100,
            pageNum: 1,
            type: 2,
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

    //显示定时任务列表
    showTaskList = () => {
        this.setState({
            taskListVisible: true
        });

        this.getTimerList()
    }

    //隐藏定时任务列表
    hideTaskList = (res) => {
        this.setState({
            taskListVisible: false
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

    //修改选中场景
    changeScene = (formDataScene) => {
        this.setState({
            formDataScene,
            sceneIndeterminate: !!formDataScene.length && (formDataScene.length < this.state.sceneList.length),
            sceneCheckAll: formDataScene.length === this.state.sceneList.length
        });
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

    //修改新建定时时间
    changeTime = (moment) => {
        this.setState({
            formDataTime: moment.format('HH:mm:ss')
        });
    }

    //获取定时任务列表
    getTimerList = (page) => {
        console.log(page)
        reqPost('/task/timer/list', {
            projectId: Number(this.props.projectId),
            pageNum: page === undefined ? this.state.taskListPage: page,
            pageSize: 10
        }).then(res => {
            if (res.code == 0) {
                this.setState({
                    taskList: res.data,
                    taskListTotalCount: res.total,
                });
            }
        })
    }

    //删除定时任务列表项
    deleteTask = (taskId) => {
        reqPost('/task/timer/delete', {
            taskId,
            projectId: this.props.projectId
        }).then(res => {
            if (res.code == 0) {
                this.getTimerList()
            }
        })
    }

    //修改类型
    changeType = (e) => {
        clearTimeout(this.state.timer);

        this.setState({
            typeValue: e.target.value,
            buildingList: {
                ...this.state.buildingList,
                list: []
            },
            successList: {
                ...this.state.successList,
                list: []
            },
            failureList: {
                ...this.state.failureList,
                list: []
            },
            timer: null
        }, () => {
            this.getList('buildingList');
            this.getList('successList');
            this.getList('failureList');
        });
    }


    //获取主列表数据
    getList = (type, loadMore=0) => {
        if (this.state[type].loading) {
            return;
        }

        if (this.state.timer) {
            clearTimeout(this.state.timer);
            this.setState({
                timer: null
            });
        }
        
        const tabType = this.state.typeValue;
        const newState = {};
        newState[type] = {
            ...this.state[type],
            loading: true
        };
        this.setState(newState);

        reqPost(this.state[type].url, {
            projectId: Number(this.props.projectId),
            type: this.state.typeValue,
            page: loadMore === 0 ? 1 : this.state[type].page + 1,
            count: 3
        }).then(res => {
            if (res.code === 0) {
                const newState = {},
                      dataSize = res.data.length,
                      nextPage = dataSize > 0 ? this.state[type].page + 1 : this.state[type].page;

                newState[type] = {
                    ...this.state[type],
                    list: loadMore === 0 ? res.data : this.state[type].list.concat(res.data),
                    page: loadMore === 0 ? 1 : nextPage
                }

                if (type === 'buildingList') {
                    if (this.state.buildingOldSize !== dataSize) {
                        newState.buildingOldSize = dataSize;

                        if (this.state.buildingOldSize > dataSize) {
                            this.getList('successList');
                            this.getList('failureList');
                        }
                    }

                    if (dataSize > 0 && tabType === this.state.typeValue && new Date().getTime() - this.state.timerStart < 3600000) {
                        newState.timer = setTimeout(this.getList.bind(this, 'buildingList'), 10e3);
                    }
                }

                this.setState(newState);
            }
        }).finally(() => {
            const newState = {};
            newState[type] = {
                ...this.state[type],
                loading: false
            };
            this.setState(newState);
        })
    }

    //取消正在构建任务
    cancelTask = (buildId) => {
        reqPost('/task/cancel', {
            buildId: buildId,
            type: this.state.typeValue
        }).then(res => {
            if (res.code == 0) {
                this.getList('buildingList');
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

    //转到包详情页
    toDetail = (buildId) => {
        reqPost('/task/getBuildId', {
            buildId
        }).then((res) => {
            if (res.code == 0) {
                this.props.history.push(`/package/detail/${res.data.id}`);
            }
        })
    }

    componentWillMount() {
        window.localStorage.setItem('detailBreadcrumbPath', JSON.stringify([{
            path: '/performanceConfig',
            name: '性能测试管理'
        }]));
    }

    componentDidMount() {
        this.getList('successList');
        this.getList('failureList');
        this.getList('buildingList');

        this.setState({
            timerStart: new Date().getTime()
        })
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);
    }

    render() {
        const { addVisible, addConfirmLoading, branchList, typeValue, sceneIndeterminate, sceneCheckAll, sceneList, formDataScene, taskListVisible, taskList, taskListTotalCount, typeList, buildingList, successList, failureList, formDataBranch } = this.state;

        return (
            <div className="performance">
                <Modal title="新增提测性能测试"
                    visible={addVisible}
                    onOk={this.addItem}
                    confirmLoading={addConfirmLoading}
                    onCancel={this.hideModal}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <div className="performance-modal-item">
                        <label className="performance-modal-item-label">开发分支：</label>
                        <div className="performance-modal-item-content">
                                <Select placeholder="开发分支"
                                        onChange={this.changeBranch}
                                        style={{ width: 300 }}
                                        showSearch
                                        value={formDataBranch}
                                        onSearch={this.getBranchList}
                                        onChange={this.changeBranch}>
                                    {
                                        branchList.map((item) => {
                                            return <Option value={item.name} key={item.id} title={item.name}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                        </div>
                    </div>

                    {
                        typeValue === 2 && <div className="performance-modal-item">
                                                <label className="performance-modal-item-label">定时时间：</label>
                                                <div className="performance-modal-item-content">
                                                    {
                                                        addVisible && <TimePicker onChange={this.changeTime}/>
                                                    }
                                                </div>
                                            </div>
                    }

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
                            <CheckboxGroup options={sceneList} value={formDataScene} onChange={this.changeScene} />
                        </div>
                    </div>
                </Modal>


                <Modal
                    title="定时任务列表"
                    visible={taskListVisible}
                    onCancel={this.hideTaskList}
                    wrapClassName="performance-task-list"
                    width={740}
                >
                    <div className="performance-task-list-container">
                        {
                            taskList.map((item, index) => {
                                return <div className="performance-task-list-item" key={item.id}>
                                    <img src={require('@/assets/favicon.ico')} />
                                    <p className="performance-task-list-item-content">
                                        <span>分支:{item.branchName}</span>
                                        <span>场景:{item.scene}</span>
                                        <span>定时时间:{item.fixTime}</span>
                                    </p>
                                    <Popconfirm placement="top" title="确定删除该项吗？" onConfirm={() => {
                                        this.deleteTask(item.id)
                                    }} okText="Yes" cancelText="No">
                                        <Button type="danger">删除</Button>
                                    </Popconfirm>
                                </div>
                            })
                        }
                    </div>
                    <div className="performance-task-list-pagination">
                        <Pagination pageSize={10} defaultCurrent={1} total={taskListTotalCount} onChange={this.getTimerList}  />
                    </div>
                </Modal>


                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>性能测试管理</BreadcrumbItem>
                </Breadcrumb>


                <div className="performance-menu">
                    { typeValue < 3 && <Button type="primary" onClick={this.showModal}>新增测试</Button> }
                    { typeValue === 2 && <Button type="primary" onClick={this.showTaskList}>定时任务列表</Button> }

                    <Radio.Group value={typeValue} onChange={this.changeType} className="fr">
                        {
                            typeList.map((item, index) => {
                                return <Radio.Button value={item.value} key={index}>{item.name}</Radio.Button>
                            })
                        }
                    </Radio.Group>
                </div>


                <div className="performance-main">
                    <Collapse defaultActiveKey={['0', '1', '2']}>
                        
                        {/*正在构建*/}
                        <Panel header={buildingList.title} key="0" className="performance-container">
                            <div className={`performance-container-load ${buildingList.loading ? 'act' : ''}`} onClick={
                                () => {
                                    this.getList('buildingList', 1)
                                }
                            }>{buildingList.loading && <Icon type="loading" theme="outlined" />} 加载更多</div>
                            <PanelContent list={buildingList.list} handlerTaskCancel={this.cancelTask} handlerToDetail={this.toDetail} showDetail={typeValue === 3}/>
                        </Panel>

                        {/*构建成功*/}
                        <Panel header={successList.title} key="1" className="performance-container">
                            <div className={`performance-container-load ${successList.loading ? 'act' : ''}`} onClick={
                                () => {
                                    this.getList('successList', 1)
                                }
                            }>{successList.loading && <Icon type="loading" theme="outlined" />} 加载更多</div>
                            <PanelContent list={successList.list} handlerToDetail={this.toDetail} showDetail={typeValue === 3}/>
                        </Panel>

                        {/*构建失败*/}
                        <Panel header={failureList.title} key="2" className="performance-container">
                            <div className={`performance-container-load ${failureList.loading ? 'act' : ''}`} onClick={
                                () => {
                                    this.getList('failureList', 1)
                                }
                            }>{failureList.loading && <Icon type="loading" theme="outlined" />} 加载更多</div>
                            <PanelContent list={failureList.list} handlerToDetail={this.toDetail} showDetail={typeValue === 3}/>
                        </Panel>

                    </Collapse>
                </div>
            </div>
        )
    }
}


Performance = connect((state) => {
    return {
        projectId: state.projectId
    }
})(Performance);

export default Performance;