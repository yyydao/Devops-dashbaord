import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Breadcrumb, Card, Form, Input, Radio } from 'antd'

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
    })
  }

  componentDidMount () {
    this.getUserInfo()
  }

  getUserInfo () {
    const { userInfo } = this.state
    console.log(userInfo)
    this.props.form.setFieldsValue({
      name: userInfo.nickName,
      mobilePhone: userInfo.mobilePhone,
      admin: userInfo.admin ? 1 : 0,
      roleName: userInfo.roleName
    })
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

    return (
      <div className="home-card">
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>个人信息</BreadcrumbItem>
        </Breadcrumb>
        <Card title="个人信息" style={{ marginTop: 30 }}>
          <Form style={{ width: 500 }}>
            <FormItem {...fromItemLayout} label="名称">
              {
                getFieldDecorator('name')(
                  <Input disabled/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="手机号码">
              {
                getFieldDecorator('mobilePhone')(
                  <Input disabled/>
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
          </Form>
        </Card>
      </div>
    )
  }
}

const PersonalForm = Form.create()(Personal)
export default connect(state => {
  return {
    userInfo: state.auth.userInfo
  }
}, {})(PersonalForm)
