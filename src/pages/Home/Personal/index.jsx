import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Breadcrumb, Card, Form, Input, Radio, Button, message } from 'antd'
import { reqPost } from '@/api/api'
import { setUserInfo } from '@/store/actions/auth'
const BreadcrumbItem = Breadcrumb.Item
const FormItem = Form.Item
const RadioGroup = Radio.Group

class Personal extends Component {
  constructor () {
    super()
    this.state = {
      userInfo: null
    }
  }

  componentWillMount () {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.setState({
      userInfo: userInfo
    },()=>{this.getUserInfo()})
  }

  getUserInfo () {
    const { userInfo } = this.state
    this.props.form.setFieldsValue({
      name: userInfo.nickName,
      mobile: userInfo.mobile,
      email: userInfo.email,
      admin: userInfo.admin ? 1 : 0,
      roleName: userInfo.roleName,
      password:''
    })
  }
  saveUserInfo = () => {
    let userInfo = JSON.parse(JSON.stringify(this.state.userInfo))
    this.props.form.validateFields(['name','mobile','email','password'],(err, values) => {
      if (!err) {
        userInfo.nickName=values.name
        userInfo.mobile=values.mobile
        userInfo.email=values.email
        let obj=Object.assign({},userInfo)
        if(values.password){
          userInfo.password=values.password
          obj.password=values.password
        }else{
          delete obj.password
        }
        this.setState({userInfo},()=>{
          reqPost('/sys/user/update',obj).then(res => {
            if(res.code === 0){
              message.success('保存成功')
              this.props.setUserInfo(userInfo)
            }else{
              message.error(res.msg);
            }
          })
        })
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form

    const fromItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }

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
    }

    return (
      <div className="home-card">
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>个人信息</BreadcrumbItem>
        </Breadcrumb>
        <Card title="个人信息" style={{ marginTop: 30 }}>
          <Form style={{ width: 500 }}>
            <FormItem {...fromItemLayout} label="姓名">
              {
                getFieldDecorator('name',{
                  rules: [{
                    required: true, message: '姓名'
                  }]
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="密码">
              {
                getFieldDecorator('password')(
                  <Input type='password'/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="手机号码">
              {
                getFieldDecorator('mobile')(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="邮箱">
              {
                getFieldDecorator('email')(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="超级管理员">
              {
                getFieldDecorator('admin')(
                  <RadioGroup disabled>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="角色">
              {
                getFieldDecorator('roleName')(
                  <Input disabled/>
                )
              }
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={()=>{this.saveUserInfo()}}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const { auth} = state
  if (auth.token) {
    return {
      userInfo:JSON.parse(JSON.stringify(auth.userInfo))
    }
  }

  return {
    auth: null
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setUserInfo:bindActionCreators(setUserInfo,dispatch),
  }
}
const PersonalForm = Form.create()(Personal)
// export default connect(state => {
//   return {
//     userInfo: state.auth.userInfo
//   }
// }, {setUserInfo})(PersonalForm)
export default connect(mapStateToProps, mapDispatchToProps)(PersonalForm)
