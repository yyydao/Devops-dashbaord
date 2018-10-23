
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Form, Input, Button, message, Modal } from 'antd';

import { reqPost, checkPermission } from '@/api/api';

const BreadcrumbItem = Breadcrumb.Item;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const TextArea = Input.TextArea;
 
class ProjectInfo extends Component{
    constructor(){
        super();
        this.state = {
            projectId: null,
            hasSubmitBtn: false,
            hasDeleteBtn: false
        }
    }

    componentWillMount(){       
        this.getProjectInfo();
        this.getPermission();        
    }

    async getPermission(){
        const hasSubmitBtn = await checkPermission('/project/details/update');
        const hasDeleteBtn = await checkPermission('/project/deleteProject');
        this.setState({ 
            hasSubmitBtn,
            hasDeleteBtn
        });
    }

    getProjectInfo(){  
        const { projectId } = this.props;      
        reqPost('/project/projectInfo', { projectId: projectId }).then(res => {
            if(parseInt(res.code, 0) === 0){
                this.props.form.setFieldsValue({
                    name: res.data.name,
                    description: res.data.description,
                    gitUrl: res.data.gitUrl,
                    creator: res.data.creator,
                    createTime: res.data.createTime
                });
                this.setState({ projectId: res.data.id });
            }else{
                message.error(res.msg);
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let { form } = this.props,
            { projectId } = this.state;
        reqPost('project/details/update', {
            id: projectId,
            name: form.getFieldValue('name'),
            description: form.getFieldValue('description'),
            gitUrl: form.getFieldValue('gitUrl')
        }).then(res => {
            if(parseInt(res.code, 0) === 0){
                message.success('更新成功');
                this.getProjectInfo();
            }else{
                message.error(res.msg);
            }
        })
    }

    handleDelete = (e) => {
        let { projectId } = this.state;

        confirm({
            title: '删除提示',
            content: '确认删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                reqPost('/project/deleteProject', { projectId: projectId }).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        message.success('删除成功！');
                        this.props.history.push('/home');
                    }else{
                        message.error(res.msg);
                    }
                })
            }
        })
    }

    render(){
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

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 18,
                    offset: 6
                }
            }
        };

        return(
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>项目信息</BreadcrumbItem>
                </Breadcrumb>
                <Card title="项目信息" style={{marginTop: 30}}>
                    <Form style={{width: 500}} onSubmit={this.handleSubmit}>
                        <FormItem {...fromItemLayout} label="项目名称">
                            {
                                getFieldDecorator('name')(
                                    <Input />
                                )
                            }
                        </FormItem>
                        <FormItem {...fromItemLayout} label="项目描述">
                            {
                                getFieldDecorator('description')(
                                    <TextArea />
                                )
                            }
                        </FormItem>
                        <FormItem {...fromItemLayout} label="Gitlab地址">
                            {
                                getFieldDecorator('gitUrl')(
                                    <Input />
                                )
                            }
                        </FormItem>
                        <FormItem {...fromItemLayout} label="创建人">
                            {
                                getFieldDecorator('creator')(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                        <FormItem {...fromItemLayout} label="创建时间">
                            {
                                getFieldDecorator('createTime')(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>                            
                            { this.state.hasSubmitBtn && <Button type="primary" htmlType="submit">更新</Button> }
                            { this.state.hasDeleteBtn && <Button style={{marginLeft: 20}} onClick={this.handleDelete}>删除项目</Button> }
                        </FormItem>
                    </Form>
                </Card>
            </div>
        )
    }
}

const ProjectInfoForm = Form.create()(ProjectInfo);
export default connect(state => {
    return{
        projectId: state.projectId
    }
}, {})(ProjectInfoForm);