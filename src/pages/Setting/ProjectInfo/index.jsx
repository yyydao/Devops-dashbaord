import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Form, Input, Button, message, Modal } from 'antd'
import { reqPost, checkPermission } from '@/api/api'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item
const FormItem = Form.Item
const confirm = Modal.confirm
const TextArea = Input.TextArea

class ProjectInfo extends Component {
  constructor () {
    super()
    this.state = {
      projectId: null,
      hasSubmitBtn: false,
      hasDeleteBtn: false,
      creator: '',
      createTime: '',
      platform: '',
      projectCode:''
    }
  }

  componentWillMount () {
    this.getProjectInfo()
    this.getPermission()
  }

  async getPermission () {
    const hasSubmitBtn = await checkPermission('/project/details/update')
    const hasDeleteBtn = await checkPermission('/project/deleteProject')
    this.setState({
      hasSubmitBtn,
      hasDeleteBtn
    })
  }

  getProjectInfo () {
    const { projectId } = this.props
    const platformType = ['Android', 'iOS', '后端平台']
    reqPost('/project/projectInfo', { projectId: projectId }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.props.form.setFieldsValue({
          name: res.data.name,
          description: res.data.description,
          gitUrl: res.data.gitUrl,
          jenkinsAddr: res.data.jenkinsAddr
        })
        this.setState({
          projectId: res.data.id,
          creator: res.data.creator,
          createTime: res.data.createTime,
          platform: platformType[res.data.platform - 1],
          projectCode:res.data.projectCode
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let { form } = this.props,
      { projectId } = this.state
    reqPost('project/details/update', {
      id: projectId,
      name: form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      gitUrl: form.getFieldValue('gitUrl'),
      jenkinsAddr: form.getFieldValue('jenkinsAddr')
    }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        message.success('更新成功')
        this.getProjectInfo()
      } else {
        message.error(res.msg)
      }
    })
  }

  handleDelete = (e) => {
    let { projectId } = this.state

    confirm({
      title: '删除提示',
      content: '该配置中可能存在重要数据，是否继续删除？（请谨慎操作！）',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        reqPost('/project/deleteProject', { projectId: projectId }).then(res => {
          if (parseInt(res.code, 0) === 0) {
            message.success('删除成功！')
            this.props.history.push('/home')
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { creator, createTime, platform, projectCode } = this.state

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
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>项目信息</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <div style={{ backgroundColor: '#fff', padding: 40 }} className="formlist">
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...fromItemLayout} label="项目名称">
                {
                  getFieldDecorator('name')(
                    <Input/>
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="项目描述">
                {
                  getFieldDecorator('description')(
                    <TextArea/>
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Gitlab地址">
                {
                  getFieldDecorator('gitUrl')(
                    <Input/>
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Jenkins地址" style={{ marginBottom: 10 }}>
                {
                  getFieldDecorator('jenkinsAddr')(
                    <Input/>
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="项目平台" style={{ marginBottom: 0 }}>
                <span>{platform}</span>
              </FormItem>
              <FormItem {...fromItemLayout} label="创建人" style={{ marginBottom: 0 }}>
                <span>{creator}</span>
              </FormItem>
              <FormItem {...fromItemLayout} label="创建时间" style={{ marginBottom: 0 }}>
                <span>{createTime}</span>
              </FormItem>
              <FormItem {...fromItemLayout} label="项目编码" style={{ marginBottom: 0 }}>
                <p>{projectCode}</p>
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                {this.state.hasSubmitBtn && <Button type="primary" htmlType="submit">更新</Button>}
                {this.state.hasDeleteBtn &&
                <Button style={{ marginLeft: 20 }} onClick={this.handleDelete}>删除项目</Button>}
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const ProjectInfoForm = Form.create()(ProjectInfo)
export default connect(state => {
  return {
    projectId: state.project.projectId
  }
}, {})(ProjectInfoForm)
