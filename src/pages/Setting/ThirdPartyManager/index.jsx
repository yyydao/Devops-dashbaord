
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Card, Form, Input, Button, message } from 'antd';

import { reqPost, reqGet} from '@/api/api';

const BreadcrumbItem = Breadcrumb.Item;
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class ThirdPartyManager extends Component{
  constructor(){
    super();
    this.state = {
      tp_data:{},
      jenkins:{},
      gitlab:{},
      sonarQube:{},
      mobSF:{},
      tapd:{},
      stf:{}
    }
  }

  componentWillMount(){
    this.getThirdPartyConfig()
  }

  /**
   * 获取第三方配置
   */
  getThirdPartyConfig = () =>{
    console.log(this.props.projectId)
    reqGet('thirdPartyConfig/listConfig', {
      projectId: this.props.projectId
    }).then(res => {
      if(res.code === 0){
        this.setState({
          tp_data:res.data,
          jenkins:res.data.jenkinsConfig,
          gitlab:res.data.gitlabConfig,
          sonarQube:res.data.sonarqubeConfig,
          mobSF:res.data.mobSFConfig,
          tapd:res.data.tapdConfig,
          stf:res.data.stfConfig
        })
      }else{
        message.error(res.msg);
      }
    })
  }

  /**
   * jenkins配置保存
   * @param e 回调参数
   */
  jenkinsSubmit = (e)=>{
    const {jenkins} =this.state
    e.preventDefault();
    this.props.form.validateFields(['jk_accessUrl','jk_userName','jk_userPwd','jk_token'],(err, values) => {
      if (!err) {
        jenkins.accessUrl=values.jk_accessUrl
        jenkins.userName=values.jk_userName
        jenkins.userPwd=values.jk_userPwd
        jenkins.token=values.jk_token
        this.setState({jenkins})
        this.saveConfig(jenkins)
      }
    });
  }
  /**
   * jenkins配置重置
   */
  jenkinsReset = () => {
    const {jenkins} =this.state
    this.props.form.setFieldsValue({
      jk_accessUrl:jenkins.accessUrl,
      jk_userName:jenkins.userName,
      jk_userPwd:jenkins.userPwd,
      jk_token:jenkins.token
    })
  }

  /**
   * gitlab配置保存
   * @param e 回调参数
   */
  gitlabSubmit = (e)=>{
    const {gitlab} =this.state
    e.preventDefault();
    this.props.form.validateFields(['gl_accessUrl','gl_userName','gl_userPwd'],(err, values) => {
      if (!err) {
        gitlab.accessUrl=values.gl_accessUrl
        gitlab.userName=values.gl_userName
        gitlab.userPwd=values.gl_userPwd
        this.setState({gitlab})
        this.saveConfig(gitlab)
      }
    });
  }
  /**
   * gitlab配置重置
   */
  gitlabReset = () => {
    const {gitlab} =this.state
    this.props.form.setFieldsValue({
      gl_accessUrl:gitlab.accessUrl,
      gl_userName:gitlab.userName,
      gl_userPwd:gitlab.userPwd
    })
  }

  /**
   * sonarQube配置保存
   * @param e 回调参数
   */
  sonarQubeSubmit = (e)=>{
    const {sonarQube} = this.state
    e.preventDefault();
    this.props.form.validateFields(['sq_accessUrl','sq_token'],(err, values) => {
      if (!err) {
        sonarQube.accessUrl=values.sq_accessUrl
        sonarQube.token=values.sq_token
        this.setState({sonarQube})
        this.saveConfig(sonarQube)
      }
    });
  }
  /**
   * sonarQube配置重置
   */
  sonarQubeReset = () => {
    const {sonarQube} =this.state
    this.props.form.setFieldsValue({
      sq_accessUrl:sonarQube.accessUrl,
      sq_token:sonarQube.token
    })
  }

  /**
   * mobSF配置保存
   * @param e 回调参数
   */
  mobSFSubmit = (e)=>{
    const {mobSF} = this.state
    e.preventDefault();
    this.props.form.validateFields(['mo_accessUrl','mo_token','regularExpression','sensitiveWord'],(err, values) => {
      if (!err) {
        mobSF.accessUrl=values.mo_accessUrl
        mobSF.token=values.mo_token
        mobSF.regularExpression=values.regularExpression
        mobSF.sensitiveWord=values.sensitiveWord
        this.setState({mobSF})
        this.saveConfig(mobSF)
      }
    });
  }
  /**
   * mobSF配置重置
   */
  mobSFReset = () => {
    const {mobSF} =this.state
    this.props.form.setFieldsValue({
      mo_accessUrl: mobSF.accessUrl,
      mo_token: mobSF.token,
      regularExpression: mobSF.regularExpression,
      sensitiveWord: mobSF.sensitiveWord
    })
  }

  /**
   * tapd配置保存
   * @param e 回调参数
   */
  tapdSubmit = (e)=>{
    const {tapd} = this.state
    e.preventDefault();
    this.props.form.validateFields(['tapd_accessUrl','tapd_token','tapd_userName','tapd_userPwd'],(err, values) => {
      if (!err) {
        tapd.accessUrl=values.tapd_accessUrl
        tapd.token=values.tapd_token
        tapd.userName=values.tapd_userName
        tapd.userPwd=values.tapd_userPwd
        this.setState({tapd})
        this.saveConfig(tapd)
      }
    });
  }
  /**
   * tapd配置重置
   */
  tapdReset = () => {
    const {tapd} =this.state
    this.props.form.setFieldsValue({
      tapd_accessUrl: tapd.accessUrl,
      tapd_token: tapd.token,
      tapd_userName:tapd.userName,
      tapd_userPwd:tapd.userPwd
    })
  }

  /**
   * tapd配置保存
   * @param e 回调参数
   */
  stfSubmit = (e)=>{
    const {stf} = this.state
    e.preventDefault();
    this.props.form.validateFields(['stf_accessUrl','stf_token'],(err, values) => {
      if (!err) {
        stf.accessUrl=values.stf_accessUrl
        stf.token=values.stf_token
        this.setState({stf})
        this.saveConfig(stf)
      }
    });
  }
  /**
   * tapd配置重置
   */
  stfReset = () => {
    const {stf} =this.state
    this.props.form.setFieldsValue({
      stf_accessUrl: stf.accessUrl,
      stf_token: stf.token,
    })
  }

  /**
   * @desc 保存配置
   * @param data 配置内容
   */
  saveConfig = (data) =>{
    reqPost('thirdPartyConfig/saveConfig',data).then(res => {
      if(res.code === 0){
        message.success('保存成功')
      }else{
        message.error(res.msg);
      }
    })
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const {jenkins, gitlab, sonarQube, mobSF, tapd, stf} = this.state

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
            <BreadcrumbItem>第三方配置</BreadcrumbItem>
          </Breadcrumb>
          <div className="content-container">
          <Card  title="Jenkins配置">
            <Form style={{width: 500}} onSubmit={this.jenkinsSubmit}>
              <FormItem {...fromItemLayout} label="服务地址">
                {
                  getFieldDecorator('jk_accessUrl',{
                    rules: [{
                      required: true, message: '请填写服务地址'
                    }],
                    initialValue:jenkins.accessUrl
                  })(
                      <Input />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Token">
                {
                  getFieldDecorator('jk_token',{
                    rules: [{
                      required: true, message: '请填写Token'
                    }],
                    initialValue:jenkins.token
                  })(
                      <Input type="password"/>
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Username">
                {
                  getFieldDecorator('jk_userName',{
                    rules: [{
                      required: true, message: '请填写Username'
                    }],
                  initialValue:jenkins.userName
                })(
                      <Input />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Password">
                {
                  getFieldDecorator('jk_userPwd',{
                    rules: [{
                      required: true, message: '请填写Password'
                    }],
                    initialValue:jenkins.userPwd
                  })(
                      <Input type="password"/>
                  )
                }
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button onClick={this.jenkinsReset}>重置</Button>
                <Button type="primary" htmlType="submit" style={{marginLeft: 20}}>保存</Button>
              </FormItem>
            </Form>
          </Card>
          <Card  title="Gitlab配置" style={{marginTop: 30}}>
            <Form style={{width: 500}} onSubmit={this.gitlabSubmit}>
              <FormItem {...fromItemLayout} label="服务地址">
                {
                  getFieldDecorator('gl_accessUrl',{
                  rules: [{
                  required: true, message: '请填写服务地址'
                }],
                  initialValue:gitlab.accessUrl
                })(
                      <Input />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Username">
                {
                  getFieldDecorator('gl_userName',{
                    rules: [{
                      required: true, message: '请填写Username'
                    }],
                    initialValue:gitlab.userName
                  })(
                      <Input />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Password">
                {
                  getFieldDecorator('gl_userPwd',{
                    rules: [{
                      required: true, message: '请填写Password'
                    }],
                    initialValue:gitlab.userPwd
                  })(
                      <Input type="password"/>
                  )
                }
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button onClick={this.gitlabReset}>重置</Button>
                <Button type="primary" htmlType="submit" style={{marginLeft: 20}}>保存</Button>
              </FormItem>
            </Form>
          </Card>
          <Card  title="SonarQube配置" style={{marginTop: 30}}>
            <Form style={{width: 500}} onSubmit={this.sonarQubeSubmit}>
              <FormItem {...fromItemLayout} label="服务地址">
                {
                  getFieldDecorator('sq_accessUrl',{
                    rules: [{
                      required: true, message: '请填写服务地址'
                    }],
                    initialValue:sonarQube.accessUrl
                  })(
                      <Input />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="token">
                {
                  getFieldDecorator('sq_token',{
                    rules: [{
                      required: true, message: '请填写token'
                    }],
                    initialValue:sonarQube.token
                  })(
                      <Input type="password" />
                  )
                }
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button onClick={this.sonarQubeReset}>重置</Button>
                <Button type="primary" htmlType="submit" style={{marginLeft: 20}}>保存</Button>
              </FormItem>
            </Form>
          </Card>
          <Card  title="MobSF配置" style={{marginTop: 30}}>
            <Form style={{width: 500}} onSubmit={this.mobSFSubmit}>
              <FormItem {...fromItemLayout} label="服务地址">
                {
                  getFieldDecorator('mo_accessUrl',{
                    rules: [{
                      required: true, message: '请填写服务地址'
                    }],
                    initialValue:mobSF.accessUrl
                  })(
                      <Input />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="token">
                {
                  getFieldDecorator('mo_token',{
                    rules: [{
                      required: true, message: '请填写token'
                    }],
                    initialValue:mobSF.token
                  })(
                      <Input type="password" />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="匹配前缀">
                {
                  getFieldDecorator('regularExpression',{
                  initialValue:mobSF.regularExpression
                })(
                      <Input placeholder="正则表达式"/>
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="敏感字符">
                {
                  getFieldDecorator('sensitiveWord',{
                    initialValue:mobSF.sensitiveWord
                  })(
                      <TextArea placeholder="用','英文逗号分隔" />
                  )
                }
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button onClick={this.mobSFReset}>重置</Button>
                <Button type="primary" htmlType="submit" style={{marginLeft: 20}}>保存</Button>
              </FormItem>
            </Form>
          </Card>
          <Card  title="TAPD 配置" style={{marginTop: 30}}>
            <Form style={{width: 500}} onSubmit={this.tapdSubmit}>
              <FormItem {...fromItemLayout} label="服务地址">
                {
                  getFieldDecorator('tapd_accessUrl',{
                    rules: [{
                      required: true, message: '请填写服务地址'
                    }],
                    initialValue:tapd.accessUrl
                  })(
                    <Input />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="token">
                {
                  getFieldDecorator('tapd_token',{
                    rules: [{
                      required: true, message: '请填写token'
                    }],
                    initialValue:tapd.token
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Username">
                {
                  getFieldDecorator('tapd_userName',{
                    rules: [{
                      required: true, message: '请填写Username'
                    }],
                    initialValue:tapd.userName
                  })(
                    <Input/>
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="Password">
                {
                  getFieldDecorator('tapd_userPwd',{
                    rules: [{
                      required: true, message: '请填写Password'
                    }],
                    initialValue:tapd.userPwd
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button onClick={this.tapdReset}>重置</Button>
                <Button type="primary" htmlType="submit" style={{marginLeft: 20}}>保存</Button>
              </FormItem>
            </Form>
          </Card>
          <Card  title="STF配置" style={{marginTop: 30}}>
            <Form style={{width: 500}} onSubmit={this.stfSubmit}>
              <FormItem {...fromItemLayout} label="服务地址">
                {
                  getFieldDecorator('stf_accessUrl',{
                    rules: [{
                      required: true, message: '请填写服务地址'
                    }],
                    initialValue:stf.accessUrl
                  })(
                    <Input />
                  )
                }
              </FormItem>
              <FormItem {...fromItemLayout} label="token">
                {
                  getFieldDecorator('stf_token',{
                    rules: [{
                      required: true, message: '请填写token'
                    }],
                    initialValue:stf.token
                  })(
                    <Input type="password"/>
                  )
                }
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button onClick={this.stfReset}>重置</Button>
                <Button type="primary" htmlType="submit" style={{marginLeft: 20}}>保存</Button>
              </FormItem>
            </Form>
          </Card>
        </div>
      </div>
    )
  }
}

const ThirdPartyManagerForm = Form.create()(ThirdPartyManager);
export default connect(state => {
  return{
    projectId: state.project.projectId
  }
}, {})(ThirdPartyManagerForm);
