import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Button, message,Row, Col } from 'antd'
import { withRouter } from 'react-router-dom'

import {reqPost,reqPostURLEncode} from '@/api/api'
import './index.scss'

const FormItem = Form.Item

const propTypes = {
  user: PropTypes.object,
  loggingIn: PropTypes.bool,
  loginErrors: PropTypes.string
}

class ForgetPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    let data = this.props.form.getFieldsValue()
    console.log(data)

    reqPost('/sys/user/forgetpwd',data).then((res) => {
      if(res.code === 0){
        message.success(res.msg).then(() => {
            this.props.history.replace('/login')
          }
        )
      }else{
        message.error(res.msg)
      }
    })

  }

  sendEmail () {
    let data = this.props.form.getFieldValue('email')
    reqPostURLEncode('/sys/user/sendemail',{email:data}).then(res=>{
      if(res.code === 0){
        message.success(res.msg)
      }else{
        message.error(res.msg)
      }
    })
  }

  componentWillMount () {
  }

  render () {

    const { getFieldDecorator } = this.props.form
    return (
      <div className="layouts-user-layout">
        <div className="layouts-user-layout-content">
          <div className="forget-password-wrapper">
            <div className="content">
              <div className="top">
                <div className="header">
                  <a href="/">
                    <img alt="logo"
                         className="logo"
                         src={require('@/assets/favicon.ico')}
                    />

                    <span className="title">DevOps</span>
                  </a>
                </div>
                <div className="desc"></div>
              </div>

              <div className="login-form-card">
                <h3>
                  忘记密码
                </h3>

                <Form onSubmit={this.handleSubmit.bind(this)} className="forget-password-form">
                  <FormItem>
                    <Row gutter={8}>
                      <Col span={12}>
                        {getFieldDecorator('email', {
                          rules: [{message: 'Please input the captcha you got!' }],
                        })(
                          <Input
                            placeholder="注册邮箱地址"
                          />
                        )}
                      </Col>
                      <Col span={12}>
                        <a onClick={this.sendEmail.bind(this)}>获取邮箱验证码</a>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('emailCode', {
                      rules: [{ required: true, message: '请输入' }]
                    })(
                      <Input prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>}
                             placeholder="邮箱验证码"/>
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('newPassword', {
                      rules: [{ required: true, message: '请输入' }]
                    })(
                      <Input prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="password"
                             placeholder="新密码"/>
                    )}
                  </FormItem>
                  <FormItem>

                    <Button type="primary" htmlType="submit" className="forget-password-form-button">
                      修改密码
                    </Button>
                    <a className="forget-password-form-toLogin" href="#/login">登录已有账户</a>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ForgetPassword.propTypes = propTypes
ForgetPassword = Form.create()(ForgetPassword)


export default withRouter(ForgetPassword)
