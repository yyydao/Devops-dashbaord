
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Card } from 'antd';
import { setLoginInfo } from '@/store/action.js';
import './index.scss';

const FormItem = Form.Item;

class LoginForm extends Component{
    constructor(){
        super();
        this.state = {
            username: '',
            password: ''
        }
    }

    handleSubmit(e){
        e.preventDefault();
        let data = this.props.form.getFieldsValue();
        let { setLoginInfo } = this.props;
        if(data.username === 'admin' && data.password === 'admin'){
            setLoginInfo({
                token: '123',
                userInfo: data.username
            });
            // this.props.history.push('/home');
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="login-wrapper">
                <Card title="DevOps平台" className="login-form-card">
                    <Form onSubmit={(e) => this.handleSubmit(e)} className="login-form">
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入' }]
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0, 0, 0, .25)'}}></Icon>} placeholder="username" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入' }]
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0, 0, 0, .25)'}}></Icon>} type="password" placeholder="password" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        )
    }
}

const WrappedLoginForm = Form.create()(LoginForm);
export default connect(state => {
    return {
        loginInfo: state.loginInfo
    }
}, { setLoginInfo })(WrappedLoginForm);