import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reqPost } from '@/api/api'
import { Form, Icon, Input, Button, Card, message } from 'antd'
// import { setLoginInfo, setToken } from '@/store/action.js'
import { bindActionCreators } from 'redux'
import { login, setUserInfo } from '@/store/actions/auth'
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
      loading: false
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    let data = this.props.form.getFieldsValue()
    // let { setToken } = this.props
    // reqPost('/sys/login', {
    //   username: data.username,
    //   password: data.password,
    // }).then(res => {
    //   if (res.code === 0) {
    //     setToken(res.token)
    //     this.props.history.push('/')
    //   } else {
    //     message.error(res.msg)
    //   }
    // })
    // this.props.login(data.username, data.password).payload.then(res => {
    //   console.log(res)
    //   this.setState({
    //     loading: false
    //   });
    //   if (res.code!==0) {
    //     message.error(res.msg);
    //   }
    //   if (res.code=== 0 )  {
    //     message.success('Welcome ' + res.nickName).then(
    //
    //     );
    //     this.props.history.replace('/');
    //   }
    // }).catch(err => {
    //   this.setState({
    //     loading: false
    //   });
    // })
    this.props.login(data.username, data.password).then((response) => {
      console.log(response)
      let res = response.value
      this.setState({
        loading: false
      })
      if (res.code !== 0) {
        message.error(res.msg)
      }
      if (res.code === 0) {
        message.success('Welcome ' + res.nickName)
          .then(()=>this.props.setUserInfo(res))
          .then(
            this.props.history.replace('/')
          )

      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login-wrapper">
        <Card title="DevOps平台" className="login-form-card">
          <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
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
    setUserInfo:bindActionCreators(setUserInfo, dispatch),
  }
}

// export default withRouter(connect(state => {
//   return {
//     loginInfo: state.loginInfo
//   }
// }, { setToken, setLoginInfo })(Login))

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
