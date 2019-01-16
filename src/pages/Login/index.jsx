import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reqPost } from '@/api/api'
import { Form, Icon, Input, Button, Card, message } from 'antd'
import { setLoginInfo, setToken } from '@/store/action.js'
import './index.scss'

const FormItem = Form.Item

class LoginForm extends Component {
  constructor () {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    let data = this.props.form.getFieldsValue()
    let { setToken } = this.props
    reqPost('/sys/login', {
      username: data.username,
      password: data.password,
    }).then(res => {
      if (res.code === 0) {
        setToken(res.token)
        this.props.history.push('/home')
      } else {
        message.error(res.msg)
      }
    })

  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-wrapper">
        <Card title="DevOps平台" className="login-form-card">
          <Form onSubmit={(e) => this.handleSubmit(e)} className="login-form">
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入' }]
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>}
                       placeholder="username"/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入' }]
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="password"
                       placeholder="password"/>
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

const WrappedLoginForm = Form.create()(LoginForm)
export default connect(state => {
  return {
    loginInfo: state.loginInfo
  }
}, { setToken, setLoginInfo })(WrappedLoginForm)
