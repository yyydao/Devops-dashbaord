import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, message } from 'antd'
import { bindActionCreators } from 'redux'
import { login, forceLogout } from '@/store/actions/auth'
import { withRouter } from 'react-router-dom'
import './index.scss'

const FormItem = Form.Item

const propTypes = {
  user: PropTypes.object,
  loggingIn: PropTypes.bool,
  loginErrors: PropTypes.string
}

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      disabled: false
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    let data = this.props.form.getFieldsValue()
    this.setState({
      disabled: true,
      loading: true
    })
    this.props.login(data.username, data.password).then((response) => {
      let res = response.value

      this.setState({
        loading: false,
        disabled: false,
      })
      if (res.code !== 0) {
        message.error(res.msg)
      } else if (res.code === 0) {
        message.success('Welcome ' + res.nickName, 2)
        let oldUrl = window.localStorage.getItem('oldUrl')

        if (oldUrl) {
          window.localStorage.removeItem('oldUrl')
          if (!oldUrl.match('login')) {
            window.location.href = oldUrl
          } else {
            this.props.history.replace('/')
          }
        } else {
          this.props.history.replace('/')
        }
      }
    }).catch(err => {
      this.setState({
        loading: false,
        disabled: false,
      })
      console.log(err)
      message.error(err.msg)
    })
  }

  componentWillMount () {
    this.props.forceLogout()
  }

  render () {
    const { disabled, loading } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <div className="layouts-user-layout">
        <div className="layouts-user-layout-content">
          <div className="login-wrapper">
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
                <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                  <FormItem>
                    {getFieldDecorator('username', {
                      rules: [{ required: true, message: '请输入' }]
                    })(
                      <Input prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>}
                             placeholder="工号"/>
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入' }]
                    })(
                      <Input prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }}></Icon>} type="password"
                             placeholder="密码"/>
                    )}
                  </FormItem>
                  <FormItem>

                    {/*<a className="login-form-forgot" href="#/forgetpassword">忘记密码</a>*/}
                    <Button disabled={disabled} loading={loading} type="primary" htmlType="submit"
                            className="login-form-button">
                      登录
                    </Button>
                    <a className="login-form-toRegister" href="#/register">注册账户</a>
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
    forceLogout: bindActionCreators(forceLogout, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
