import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Card, Input, Tabs, Button, message, Switch, Form, Modal } from 'antd';

import { reqPost, reqGet, checkPermission } from '@/api/api';
import Edit from '@/pages/Setting/ConfigManager/Edit';
import '../index.scss';

const BreadcrumbItem = Breadcrumb.Item;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class PackageConfigManager extends Component{
    constructor(){
        super();
        this.state = {
            jenkinsAddr: '',
            projectName: '',
            editing: false,
            envList: [],
            envActiveIndex: '0',
            addModalVisible: false,
            jenkinsJobEditArr: [],
            envNameEditArr: [],
            activeEnvItem: '',
            hasAddBtn: false,
            hasDeleteBtn: false,
            oldJenkinsAddr: ''
        };
        this.oldActiveEnvItem = '';
    }

    componentWillMount(){
        this.getProjectInfo();
        this.getEnvList();
    }

    async getPermission(){
        const hasAddBtn = await checkPermission('/env/add');
        const hasDeleteBtn = await checkPermission('/env/delete');
        this.setState({ hasAddBtn, hasDeleteBtn });
    }

    getProjectInfo(){
        const { projectId } = this.props;
        reqPost('/project/projectInfo', { projectId }).then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({
                    projectName: res.data.name,
                    jenkinsAddr: res.data.jenkinsAddr
                })
            }else{
                message.error(res.msg);
            }
        })
    }

    handleChange = (e) => {       
        this.setState({ jenkinsAddr: e.target.value });
    }

    isEditing = () => {
        const { jenkinsAddr } = this.state;
        this.setState({ oldJenkinsAddr: jenkinsAddr, editing: true });
    }

    handleSave = () => {
        const { projectId } = this.props;
        const { jenkinsAddr } = this.state;
        reqPost('/project/updatePackageJenkinsAddress', {
            id: projectId,
            jenkinsAddr, 
        }).then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({ editing: false });
                message.success('jenkins地址修改成功！');
                this.getProjectInfo();
            }else{
                message.error(res.msg);
            }
        })
    }

    handleCancel = () => {
        const { oldJenkinsAddr } = this.state;
        this.setState({
            editing: false,
            jenkinsAddr: oldJenkinsAddr
        });
    }

    envOrJenkinsChange = (e, name) => {
        const { activeEnvItem } = this.state;
        activeEnvItem[name] = e.target.value;
        this.setState({ activeEnvItem });
    }

    envOrJenkinsEdit = (name) => {
        const { envActiveIndex } = this.state;
        const activeEnvItem = { ...this.state.activeEnvItem };
        const newState = this.state;    
        this.oldActiveEnvItem = activeEnvItem;           
        newState[name][envActiveIndex] = true;       
        this.setState(newState);  
    }

    envOrJenkinsCancel = (name, itemName) => {
        const { envActiveIndex } = this.state;
        const newState = this.state;

        newState[name][envActiveIndex] = false;
        newState['activeEnvItem'][itemName] = this.oldActiveEnvItem[itemName];
        this.setState(newState);
    }

    envOrJenkinsUpdate = () => {
        const { activeEnvItem, envActiveIndex } = this.state;
        reqGet('/env/update', {
            envId: activeEnvItem.id,
            envName: activeEnvItem.name,
            jenkinJobName: activeEnvItem.jenckinJob,
            openTesting: activeEnvItem.openTesting,
            passwdBuild: activeEnvItem.passwdBuild
        }).then(res => {
            if(parseInt(res.code, 0) === 0){
                message.success('修改成功！');   
                const envNameEditArr = { ...this.state.envNameEditArr };
                const jenkinsJobEditArr = { ...this.state.jenkinsJobEditArr };
                envNameEditArr[envActiveIndex] = false;
                jenkinsJobEditArr[envActiveIndex] = false;
                this.setState({ envNameEditArr, jenkinsJobEditArr });             
            }else{ 
                message.error(res.msg);
            }
            this.getEnvList();
        })
    }

    getEnvList(){
        const { projectId } = this.props;
        reqGet('/env/list', {
            projectId,
            categoryId: this.props.match.params.id
        }).then(res => {
            if(parseInt(res.code, 0) === 0){
                let envNameEditArr = [],
                    jenkinsJobEditArr = [];
                for(let i = 0; i < res.data.length; i++){
                    envNameEditArr.push(false);
                    jenkinsJobEditArr.push(false);
                }

                this.setState({
                    envList: res.data,
                    envNameEditArr, 
                    jenkinsJobEditArr,
                    activeEnvItem: res.data[0]
                });
            }else{
                message.error(res.msg);
            }
        })
    }

    changeTab = (activeKey) => {
        const envList = { ...this.state.envList };
        const activeEnvItem = envList[activeKey];
        this.setState({
            envActiveIndex: activeKey,
            activeEnvItem 
        });
    }

    showModal = () => {
        this.setState({ addModalVisible: true });
    }

    hideModal = () => {
        this.props.form.resetFields();
        this.setState({ addModalVisible: false });
    }

    addEnv = () => {
        const { projectId, form } = this.props;
        form.validateFields((err, values) => {
            if(!err){
                reqGet('/env/add', { projectId, ...values }).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        this.setState({ addModalVisible: false });
                        message.success('新增环境成功！');
                        this.getEnvList();
                        form.resetFields();
                    }else{
                        message.error(res.msg);
                    }
                })
            }
        })
    }

    openTestingOrPwdBuildChange = (checked, name) => {
        const { envActiveIndex, envList } = this.state;
        const item = envList[envActiveIndex];    
        item[name] = checked ? 1 : 0;
        let text = checked ? '开启' : '关闭';
        let content = name === 'passwdBuild' ? `确认${text}密码吗？` : `确认${text}性能测试吗？`;
        confirm({
            title: '提示',
            content: content,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {               
                reqGet('/env/update', {
                    envId: item.id,
                    envName: item.name,
                    jenkinJobName: item.jenckinJob,
                    openTesting: item.openTesting,
                    passwdBuild: item.passwdBuild
                }).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        message.success('修改成功！');                       
                    }else{
                        message.error(res.msg);
                    }
                    this.getEnvList();
                })
            },
            onCancel: () => {
                this.getEnvList();
            }
        })
    }

    deleteEnv = (envId) => {
        confirm({
            title: '提示',
            content: '该环境可能存在安装包，确认删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                reqGet('/env/delete', { envId }).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        message.success('删除成功！');
                        this.setState({ envActiveIndex: '0' });
                        this.getEnvList();
                    }else{
                        message.error(res.msg);
                    }
                })
            }
        })
    }

    render(){
        const { editing, projectName, jenkinsAddr, envList, envActiveIndex, envNameEditArr, jenkinsJobEditArr, addModalVisible } = this.state;
        const { getFieldDecorator } = this.props.form;

        const fromItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        };

        const operations = <Button icon="plus-circle" onClick={this.showModal}>添加</Button>

        return(
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/configManager">配置管理</Link></BreadcrumbItem>
                    <BreadcrumbItem>包管理配置</BreadcrumbItem>
                </Breadcrumb>
                <Card style={{marginTop: 30}}>
                    <div className="config-project-info">
                        <div className="config-project-item">
                            <span className="name">项目名称：</span>
                            <span>{projectName}</span>
                        </div>
                        <div className="config-project-item">
                            <span className="name">Jenkins地址：</span>
                            <Edit editing={editing} defaultValue={jenkinsAddr} isEditing={this.isEditing} handleChange={this.handleChange} handleConfirm={this.handleSave} handleCancel={this.handleCancel} />
                        </div>
                        <div className="tab-content">
                            <Tabs tabBarExtraContent={operations} activeKey={envActiveIndex} onChange={this.changeTab}>
                                {
                                    envList.map((item, index) => {
                                        return(
                                            <TabPane className="tab-item" key={index} tab={item.name}>
                                                <Button icon="delete" type="danger" title="删除环境" className="button-delete" onClick={() => this.deleteEnv(item.id)}></Button>
                                                <div className="config-project-item">
                                                    <span className="name">环境名称：</span>                                                   
                                                    <Edit editing={envNameEditArr[index]} defaultValue={item.name} isEditing={() => this.envOrJenkinsEdit('envNameEditArr')} handleChange={(e) => this.envOrJenkinsChange(e, 'name')} handleConfirm={this.envOrJenkinsUpdate} handleCancel={() => this.envOrJenkinsCancel('envNameEditArr', 'name')} />
                                                </div>
                                                <div className="config-project-item">
                                                    <span className="name">Task名称：</span>
                                                    <Edit editing={jenkinsJobEditArr[index]} defaultValue={item.jenckinJob} isEditing={() => this.envOrJenkinsEdit('jenkinsJobEditArr')} handleChange={(e) => this.envOrJenkinsChange(e, 'jenckinJob')} handleConfirm={this.envOrJenkinsUpdate} handleCancel={() => this.envOrJenkinsCancel('jenkinsJobEditArr', 'jenckinJob')} />
                                                </div>
                                                <div className="config-project-item">
                                                    <span className="name">性能测试：</span>
                                                    <Switch checked={item.openTesting === 0 ? false : true} onChange={(checked) => this.openTestingOrPwdBuildChange(checked, 'openTesting')} />
                                                </div>
                                                <div className="config-project-item">
                                                    <span className="name">是否需要密码：</span>
                                                    <Switch checked={item.passwdBuild === 0 ? false : true} onChange={(checked) => this.openTestingOrPwdBuildChange(checked, 'passwdBuild')} />
                                                </div>                                                
                                            </TabPane>
                                        )
                                    })
                                }
                            </Tabs>
                        </div>
                    </div> 
                </Card>

                { /* 新增环境弹窗 */ }
                <Modal title="新增环境" visible={addModalVisible} onOk={this.addEnv} onCancel={this.hideModal} okText="确定" cancelText="取消">
                    <Form>
                        <FormItem {...fromItemLayout} label="环境名称">
                            {
                                getFieldDecorator('envName', {
                                    rules: [{ required: true, message: '必填项' }]
                                })(
                                    <Input placeholder="如：测试环境" />
                                )
                            }
                        </FormItem>
                        <FormItem {...fromItemLayout} label="Task名称">
                            {
                                getFieldDecorator('jenkinsJobName', {
                                    rules: [{ required: true, message: '必填项' }]
                                })(
                                    <Input placeholder="如：TuandaiAS2-Test，代表Jenkins中的任务" />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const PackageConfigManagerForm = Form.create()(PackageConfigManager);
export default connect(state => {
    return{
        projectId: state.projectId
    }
}, {})(PackageConfigManagerForm);