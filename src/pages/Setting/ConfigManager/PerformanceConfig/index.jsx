import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Card, Button, Modal, Tabs, message } from 'antd';

import { reqPost, reqGet,checkPermission } from '@/api/api';
import Edit from '@/pages/Setting/ConfigManager/Edit';
import EditSceneForm from '@/pages/Setting/ConfigManager/EditScene';
// import '../index.scss';

const BreadcrumbItem = Breadcrumb.Item;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

class PerformanceConfigManager extends Component{
    constructor(){
        super();
        this.state = {           
            projectDetail: '',
            sceneList: [],
            editJenkins: false,
            addModalVisible: false,
            editBranchTask: false,
            editTimerTask: false,
            editSubmitTask: false,
            editModalVisible: false,
            editSceneItem: '',
            hasAddBtn: false,
            hasDeleteBtn: false
            // hasEditBtn: false
        };
        this.oldProjectDetail = '';
    }

    componentWillMount(){
        this.getProjectInfo();
        this.getSceneList();
        this.getPermission();
    }

    async getPermission(){
        const hasAddBtn = await checkPermission('/testScene/add');
        const hasDeleteBtn = await checkPermission('/testScene/delete/*');
        // const hasEditBtn = await checkPermission('/testScene/update');
        this.setState({ hasDeleteBtn, hasAddBtn });
    }

    getProjectInfo(){
        const { projectId } = this.props;
        reqGet(`/project/details/${projectId}`).then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({ projectDetail: res.data })
            }else{
                message.error(res.msg);
            }
        })
    }

    jenkinsUpdate = () => {
        const { projectId } = this.props;
        const { projectDetail } = this.state;
        reqPost('project/updateTestJenkinsAddress', {
            id: projectId,
            testJenkinsAddr: projectDetail.testJenkinsAddr
        }).then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({ editJenkins: false });
                message.success('jenkins地址修改成功！');
                this.getProjectInfo();
            }else{
                message.error(res.msg);
            }
        })
    }

    editConfirm = (name) => {
        const newState = this.state;
        this.oldProjectDetail = { ...this.state.projectDetail };
        newState[name] = true;
        this.setState(newState);
    }

    editCancel = (name, itemName) => {
        const newState = this.state;
        newState[name] = false;
        newState['projectDetail'][itemName] = this.oldProjectDetail[itemName];
        this.setState(newState);
    }

    inputChange = (e, name) => {
        const { projectDetail } = this.state;
        projectDetail[name] = e.target.value;
        this.setState({ projectDetail });
    }

    taskUpdate = () => {
        const { projectId } = this.props;
        const { projectDetail } = this.state;
        reqPost('/project/details/update', {
            id: projectId,
            // jenkinsAddr: projectDetail.testJenkinsAddr,
            branchTaskName: projectDetail.branchTaskName,
            timerTaskName: projectDetail.timerTaskName,
            submitTaskName: projectDetail.submitTaskName
        }).then(res => {
            if(parseInt(res.code, 0) === 0){
                message.success('修改成功！');
                this.getProjectInfo();
                this.setState({
                    editSubmitTask: false,
                    editBranchTask: false,
                    editTimerTask: false
                });
            }else{
                message.error(res.msg);
            }
        })
    }

    getSceneList(){
        const { projectId } = this.props;
        reqGet(`/testScene/list/${projectId}`).then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({ sceneList: res.data });
            }else{
                message.error(res.msg);
            }
        })
    }

    editScene = (item) => {
        this.setState({
            editSceneItem: item, 
            editModalVisible: true
        });       
    }

    editSceneConfirm = () => {
        const { editSceneItem } = this.state;
        const formValues = this.editSceneForm.props.form.getFieldsValue();
        reqPost('/testScene/update', {
            id: editSceneItem.id,
            name: formValues.name,
            jenkinsParam: formValues.jenkinsParam
        }).then(res => {
            if(parseInt(res.code, 0) === 0){
                message.success('场景修改成功！');
                this.setState({ editModalVisible: false });
                this.editSceneForm.props.form.resetFields();
            }else{
                message.error(res.msg);
            }
            this.getSceneList();
        })
    }

    editSceneCancel = () => {
        this.setState({
            editSceneItem: '',
            editModalVisible: false
        });
        this.editSceneForm.props.form.resetFields();
    }

    deleteScene = (sceneId) => {
        confirm({
            title: '提示',
            content: '该场景可能存在重要配置，确定删除吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                reqGet(`/testScene/delete/${sceneId}`).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        message.success('删除场景成功！');
                        this.getSceneList();
                    }else{
                        message.error(res.msg);
                    }
                })
            }
        })
    }

    handleAddScene = () => {
        const { projectId } = this.props;
        this.addSceneForm.props.form.validateFields((err, values) => {
            if(!err){
                reqPost('/testScene/add', { projectId, ...values }).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        message.success('场景新增成功！');
                        this.getSceneList();
                        this.setState({ addModalVisible: false });
                        this.addSceneForm.props.form.resetFields();
                    }else{
                        message.error(res.msg);
                    }
                })
            }
        })
    }

    handleCancel = () => {
        this.addSceneForm.props.form.resetFields();
        this.setState({ addModalVisible: false });
    }

    render(){
        const { editJenkins, projectDetail, sceneList, editTimerTask, editSubmitTask, editBranchTask, editModalVisible, editSceneItem, addModalVisible, hasAddBtn, hasDeleteBtn } = this.state;

        return(
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/configManager">配置管理</Link></BreadcrumbItem>
                    <BreadcrumbItem>性能测试配置</BreadcrumbItem>
                </Breadcrumb>
                <Card style={{marginTop: 30}}>
                    <div className="config-project-info">
                        <div className="config-project-item">
                            <span className="name">项目名称：</span>
                            <span>{projectDetail.name}</span>
                        </div>
                        <div className="config-project-item">
                            <span className="name">Jenkins地址：</span>
                            <Edit editing={editJenkins} defaultValue={projectDetail.testJenkinsAddr} isEditing={() => this.editConfirm('editJenkins')} handleChange={(e) => this.inputChange(e, 'testJenkinsAddr')} handleConfirm={this.jenkinsUpdate} handleCancel={() => this.editCancel('editJenkins', 'testJenkinsAddr')} />
                        </div>
                        <div className="scene-container">
                            <p style={{lineHeight: '32px'}}>
                                场景列表：
                                {
                                    hasAddBtn && <Button className="fr" icon="plus-circle" onClick={() => this.editConfirm('addModalVisible')}>添加</Button>
                                }
                            </p>
                            <div className="fixed-height">
                                <ul className="scene-list">
                                    {
                                        sceneList.map((item, index) => {
                                            return(
                                                <li key={index}>
                                                    <span className="name">{item.name}</span>
                                                    <span className="param">{item.jenkinsParam}</span>
                                                    <Button icon="edit" type="primary" title="修改" onClick={() => this.editScene(item)}></Button>
                                                    {
                                                        hasDeleteBtn && <Button icon="delete" type="danger" title="删除" onClick={() => this.deleteScene(item.id)}></Button>
                                                    }
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <Tabs>
                            <TabPane key="0" className="tab-item" tab="分支性能测试">
                                <div className="config-project-item">
                                    <span className="name">环境名称：</span>
                                    <span>分支性能测试</span>
                                </div>
                                <div className="config-project-item">
                                    <span className="name">Task名称：</span>
                                    <Edit editing={editBranchTask} defaultValue={projectDetail.branchTaskName} isEditing={() => this.editConfirm('editBranchTask')} handleChange={(e) => this.inputChange(e, 'branchTaskName')} handleConfirm={this.taskUpdate} handleCancel={() => this.editCancel('editBranchTask', 'branchTaskName')} />
                                </div>
                            </TabPane>
                            <TabPane key="1" className="tab-item" tab="定时性能测试">
                                <div className="config-project-item">
                                    <span className="name">环境名称：</span>
                                    <span>定时性能测试</span>
                                </div>
                                <div className="config-project-item">
                                    <span className="name">Task名称：</span>
                                    <Edit editing={editTimerTask} defaultValue={projectDetail.timerTaskName} isEditing={() => this.editConfirm('editTimerTask')} handleChange={(e) => this.inputChange(e, 'timerTaskName')} handleConfirm={this.taskUpdate} handleCancel={() => this.editCancel('editTimerTask', 'timerTaskName')} />
                                </div>
                            </TabPane>
                            <TabPane key="2" className="tab-item" tab="提测性能测试">
                                <div className="config-project-item">
                                    <span className="name">环境名称：</span>
                                    <span>提测性能测试</span>
                                </div>
                                <div className="config-project-item">
                                    <span className="name">Task名称：</span>
                                    <Edit editing={editSubmitTask} defaultValue={projectDetail.submitTaskName} isEditing={() => this.editConfirm('editSubmitTask')} handleChange={(e) => this.inputChange(e, 'submitTaskName')} handleConfirm={this.taskUpdate} handleCancel={() => this.editCancel('editSubmitTask', 'submitTaskName')} />
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </Card>

                { /* 添加场景弹框 */ }
                <EditSceneForm wrappedComponentRef={(inst) => this.addSceneForm = inst} title="添加场景" visible={addModalVisible} name="" jenkinsParam="" handleCancel={this.handleCancel} handleConfirm={this.handleAddScene} />

                { /* 修改场景弹框 */ }
                <EditSceneForm wrappedComponentRef={(inst) => this.editSceneForm = inst} title="修改场景" visible={editModalVisible} name={editSceneItem.name} jenkinsParam={editSceneItem.jenkinsParam} handleCancel={this.editSceneCancel} handleConfirm={this.editSceneConfirm} />
            </div>
        )
    }
}

export default connect(state => {
    return{
        projectId: state.projectId
    }
}, {})(PerformanceConfigManager);