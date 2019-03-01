import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, message, Row, Col, Radio } from 'antd'
import { bindActionCreators } from 'redux'
import { login, setUserInfo, forceLogout } from '@/store/actions/auth'
import { withRouter } from 'react-router-dom'
import './index.scss'

import { reqGet, reqPost } from '@/api/api'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const propTypes = {
  user: PropTypes.object,
  loggingIn: PropTypes.bool,
  loginErrors: PropTypes.string
}

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newUser: {},
      loading: false,
      rolelist: []
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    let data = this.props.form.getFieldsValue()
    data.roleIdList = [data.roleIdList]
    reqPost('/sys/user/register', data).then((res) => {
      if (res.code === 0) {
        message.success('注册成功').then(() => {
          this.props.history.replace('/login')
        })

      } else {
        message.error(res.msg)
      }
    }).catch(err => {
      console.log(err)
      message.error(err.msg)
    })
  }

  componentWillMount () {
    // this.props.forceLogout()
    reqGet('/sys/role/selectnoadmin').then(res => {
      console.log(res)
      if (res.code === 0) {
        this.setState({ rolelist: res.list })
      }

    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { rolelist, newUser } = this.state
    return (
      <div className="layouts-user-layout">
        <div className="layouts-user-layout-content">
        <div className="register-wrapper">
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

            <div className="register-form-card">
              <h3>
                注册
              </h3>
              <Form onSubmit={this.handleSubmit.bind(this)} className="register-form">
                <FormItem
                  label={'姓名'}>
                  {getFieldDecorator('nickName', {
                    rules: [{ required: true, message: '请输入' }]
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>}
                           placeholder="姓名"/>
                  )}
                </FormItem>
                <FormItem
                  label={'工号'}>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入' }]
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>}
                           placeholder="工号"/>
                  )}
                </FormItem>
                <FormItem
                  label={'密码'}>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入' }]
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="password"
                           placeholder="密码"/>
                  )}
                </FormItem>
                <FormItem
                  label={'确认密码'}>
                  {getFieldDecorator('confirmpassword', {
                    rules: [{ required: true, message: '请输入' }]
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="password"
                           placeholder="password"/>
                  )}
                </FormItem>
                <FormItem
                  label={'手机号'}>
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '请输入' }]
                  })(
                    <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="text"
                           placeholder="手机号"/>
                  )}
                </FormItem>
                <FormItem
                  label={'邮箱'}>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: '请输入' }]
                  })(
                    <Input prefix={<Icon type="mail" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="text"
                           placeholder="邮箱"/>
                  )}
                </FormItem>
                <FormItem
                  label={'项目识别码'}>
                  {getFieldDecorator('projectCode', {
                    // rules: [{ required: true, message: '请输入' }]
                  })(
                    <Input prefix={<Icon type="project" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="text"
                           placeholder="项目识别码"/>
                  )}
                </FormItem>
                <FormItem
                  label={'用户类型'}>
                  {
                    getFieldDecorator('roleIdList', { initialValue: newUser.roleIdList })(
                      <RadioGroup>
                        <Row type='flex' align='space-around' justify='middle' className='task-item-row'>
                          {rolelist.map((item, index) => <Col style={{ marginTop: 8 }} key={index}><Radio
                            value={item.roleId}>{item.roleName}</Radio></Col>)}
                        </Row>
                      </RadioGroup>
                    )
                  }
                </FormItem>
                <FormItem>
                  <Button size="large" type="primary" htmlType="submit" className="register-form-button">注册</Button>
                  <a className="register-form-toLogin" href="#/login">使用已有账户登录</a>
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

Login.propTypes = propTypes
Login = Form.create()(Login)

function mapStateToProps (state) {
  const { auth } = state
  if (auth.user) {
    return {
      user: auth.user,
      loggingIn: auth.loggingIn,
      authErrors: '',
      userInfo: auth.userInfo
    }
  }

  return {
    user: null,
    loggingIn: auth.loggingIn,
    loginErrors: auth.loginErrors
  }
}

function mapDispatchToProps (dispatch) {
  return {
    login: bindActionCreators(login, dispatch),
    setUserInfo: bindActionCreators(setUserInfo, dispatch),
    forceLogout: bindActionCreators(forceLogout, dispatch)
  }
}

// export default withRouter(connect(state => {
//   return {
//     loginInfo: state.loginInfo
//   }
// }, { setToken, setLoginInfo })(Login))

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
