import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'
import { Button, Breadcrumb, Steps, message, Icon, Upload, Form, Input, Select, DatePicker } from 'antd'
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.scss'

moment.locale('zh-cn');

const BreadcrumbItem = Breadcrumb.Item;
const Step = Steps.Step;
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class AddGrayscale extends Component{
  constructor(){
    super();
    this.state = {
      projectId:'',
      steps : ['上传App','确认信息','下载页'],
      current: 0,
      fileList:[],
      packageID:"",
      versionID:"",
      versionInfo:{},
      packageInfo:{}
    }
  }
  componentWillMount(){
    let data = this.props.location.query;
    if(data){
      let {packageID,versionID} = data;
      if(packageID&&versionID){
        this.setState({
          current:1,
          packageID,
          versionID
        },()=>{this.getPackageDetail()})
      }
    }
  }

  /**
   * @desc 下一步操作(保存信息)
   */
  savePackageInfo = () => {
    const {versionInfo} = this.state
    let uploadData={}
    //判断是否填写了安装密码
    if(versionInfo.installType===2){
      if(!versionInfo.installPwd){
        message.error("请填写安装密码")
        return
      }else{
        uploadData.installPwd=versionInfo.installPwd
      }
    }
    //如果不限制安装期限讲时间清除
    if (versionInfo.installExpiry===1){
      uploadData.beginExpiryDate =""
      uploadData.endExpiryDate =""
    }else{
      uploadData.beginExpiryDate=versionInfo.beginExpiryDate
      uploadData.endExpiryDate=versionInfo.endExpiryDate
    }

    uploadData.installExpiry=versionInfo.installExpiry
    uploadData.installType=versionInfo.installType
    uploadData.versionDesc=versionInfo.versionDesc
    uploadData.appContent=versionInfo.appContent
    uploadData.dataID=versionInfo.id
    reqPost('deploy/updateversion', uploadData).then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.getPackageDetail()
        const current = this.state.current + 1;
        this.setState({ current });
      }else{
        message.error(res.msg)
      }
    })

  }

  /**
   * @desc 拖拽文件的改变事件
   */
  onDraggerChange= (info) =>{
    const status = info.file.status;
    let fileList = info.fileList;
    console.log(info)
    if (status === 'done') {
      if(info.file.response.code===0){
        this.setState({
          packageID:info.file.response.package,
          versionID:info.file.response.version,
          current:1
        },()=>{
          this.getPackageDetail()
        })
      }else{
        fileList=[]
        message.error(info.file.response.msg)
      }
    } else if (status === 'error') {
      fileList=[]
      message.error(`${info.file.name}  文件上传失败`)
    }else if (!status){
      fileList=[]
    }
    this.setState({fileList})
  }

  /**
   * @desc ipa上传之前的操作
   */
  beforeUpload = (file, fileList)=>{
    if(fileList.length!==1){
      message.error("只支持上传一个文件")
      return false
    }
  }

  /**
  * @desc 获取包详情
  */
  getPackageDetail = () =>{
    const { packageID, versionID } = this.state
    reqGet('deploy/packagedetail',{
      packageID,versionID
    }).then(res => {
      if(res.code === 0){
        res.version.beginExpiryDate=res.version.beginExpiryDate||moment().format("YYYY-MM-DD HH:mm:ss")
        res.version.endExpiryDate=res.version.endExpiryDate||moment().format("YYYY-MM-DD HH:mm:ss")
        res.version.installType=res.version.installType||1
        res.version.installExpiry=res.version.installExpiry||1
        this.setState({
          packageInfo: res.package,
          versionInfo:res.version
        })
      }else{
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 表单数据改变事件
   */
  onChangeValue = (key,value) =>{
    const newState = this.state.versionInfo;
    newState[key] = value;
    this.setState({versionInfo:newState})
  }

  /**
   * 计算时间差
   */
  gettimeFn =(d) =>{
    // let d=d1||d2
    let dateBegin = new Date(d.replace(/-/g, "/"));
    let dateEnd = new Date();//获取当前时间
    let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    let leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
    let hours=Math.floor(leave1/(3600*1000))//计算出小时数
    //计算相差分钟数
    let leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
    let minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
    let str=""
    str=dayDiff===0?str+'':str+dayDiff+"天 "
    str=hours===0?str+'':str+hours+"小时 "
    str=minutes===0?str+'1分钟前':str+minutes+"分钟前 "
    return str
  }


  render () {
    const {current,steps,fileList,versionInfo,packageInfo} = this.state
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
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/grayscale">灰度发布</Link></BreadcrumbItem>
          <BreadcrumbItem>新发布</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <div className="addgray-container">
            <Steps current={current}>
              {steps.map(item => <Step key={item} title={item} />)}
            </Steps>
            <div className="steps-content">
              {current===0&&
              <Dragger style={{padding:"40px 0px"}}
                       name='file'
                       action='/api/deploy/upload'
                       data={{projectID:this.props.projectId,envID:62,token:this.props.token}}
                       onChange={(info)=>{this.onDraggerChange(info) }}
                       beforeUpload={(file, fileList)=>this.beforeUpload(file, fileList)}
                       accept=".ipa"
                       fileList={fileList}>
                <Button type="primary" size="large"><Icon type="upload" />立即上传</Button>
                <p style={{fontSize:16,color:"#262626",paddingTop:20,marginBottom:4}}>点击按钮选择应用的安装包，或拖拽文件到此区域</p>
                <span style={{color:"#d9d9d9"}}>支持ipa文件</span>
              </Dragger>
              }
              {current===1&&JSON.stringify(packageInfo)!=="{}"&&JSON.stringify(versionInfo)!=="{}"&&
              <div>
                <div style={{textAlign:"center"}}>
                  <img src={versionInfo.iconImage} width={96} height={96} alt="logo"/>
                  <p style={{marginTop:8,fontWeight:"bold"}}>版本：{versionInfo.appVersion}</p>
                </div>
                <Form style={{marginTop:36}}>
                  <FormItem {...fromItemLayout} label="应用名称：">
                  <Input value={packageInfo.appName} disabled/>
                </FormItem>
                  <FormItem {...fromItemLayout} label="应用大小：">
                    <Input value={versionInfo.fileSize} disabled/>
                  </FormItem>
                  <FormItem {...fromItemLayout} label="安装方式：">
                    <Select value={versionInfo.installType} onChange={(e)=>{this.onChangeValue("installType",e)}}>
                      <Option value={1}>公开</Option>
                      <Option value={2}>密码安装</Option>
                    </Select>
                  </FormItem>
                  {
                    versionInfo.installType===2&&
                    <FormItem {...fromItemLayout} label="安装密码：">
                      <Input type="password" value={versionInfo.installPwd} onChange={(e)=>{this.onChangeValue("installPwd",e.target.value)}}/>
                    </FormItem>
                  }
                  <FormItem {...fromItemLayout} label="安装有效期：">
                    <Select value={versionInfo.installExpiry} onChange={(e)=>{this.onChangeValue("installExpiry",e)}}>
                      <Option value={1}>长期有效</Option>
                      <Option value={2}>设置时间</Option>
                    </Select>
                  </FormItem>
                    {
                      versionInfo.installExpiry===2&&
                      <FormItem {...fromItemLayout} label="有效安装开始与结束时间：">
                        <RangePicker
                          showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                          }}
                          value={[moment(versionInfo.beginExpiryDate, "YYYY-MM-DD HH:mm:ss"), moment(versionInfo.endExpiryDate, "YYYY-MM-DD HH:mm:ss")]}
                          format="YYYY-MM-DD HH:mm:ss"
                          onChange={(date, dateString)=>{
                            this.onChangeValue("beginExpiryDate",dateString[0])
                            this.onChangeValue("endExpiryDate",dateString[1])
                          }}
                        />
                      </FormItem>
                    }
                  <FormItem {...fromItemLayout} label="版本更新说明：">
                    <TextArea value={versionInfo.versionDesc} style={{height:100}} onChange={(e)=>{this.onChangeValue("versionDesc",e.target.value)}}/>
                  </FormItem>
                  <FormItem {...fromItemLayout} label="应用介绍：">
                    <TextArea value={versionInfo.appContent} style={{height:100}} onChange={(e)=>{this.onChangeValue("appContent",e.target.value)}}/>
                  </FormItem>
                  <FormItem {...fromItemLayout} label=" ">
                    <Button type="primary" onClick={() => this.savePackageInfo()}>下一步</Button>
                  </FormItem>
                </Form>
              </div>
              }
              {current===2&&
              <div>
                <div style={{textAlign:"center"}}>
                  <img src={versionInfo.iconImage} width={96} height={96} alt="logo"/>
                  <p style={{marginTop:8,fontWeight:"bold",fontSize:18}}>{packageInfo.appName}</p>
                  <p className="version-info">
                    <span style={{paddingRight:24}}>版本：{versionInfo.appVersion}</span>
                    <span style={{paddingRight:24}}>大小：{versionInfo.fileSize}</span>
                    <span style={{paddingRight:24}}>更新时间：{this.gettimeFn(versionInfo.updateTime||versionInfo.createTime)}</span>
                  </p>
                  <img src={versionInfo.qrcodeImage} width={120} height={120} style={{marginTop:26}} alt="二维码"/>
                  <p style={{marginTop:8,color:" rgba(0,0,0,0.45)"}}>用手机扫描二维码安装</p>
                  <Button type="primary"><a href={versionInfo.filePath}>点击下载</a></Button>
                </div>
                <Form style={{marginTop:36}}>
                  <FormItem {...fromItemLayout} label="版本更新说明：">
                    <p className="version-content">{versionInfo.versionDesc}</p>
                  </FormItem>
                  <FormItem {...fromItemLayout} label="应用介绍：">
                    <p className="version-content">{versionInfo.appContent}</p>
                  </FormItem>
                  <FormItem {...fromItemLayout} label=" ">
                    <Button type="primary"><Link to="/grayscale">完成</Link></Button>
                  </FormItem>
                </Form>
              </div>
              }
              </div>
            <div className="steps-action">
              {/*{current > 0 && <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>上一步</Button>}*/}
              {/*{current ===1 && <Button type="primary" onClick={() => this.savePackageInfo()}>下一步</Button>}*/}
              {/*{current === 2 && <Button type="primary"><Link to="/grayscale">完成</Link></Button>}*/}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const AddGrayscaleForm = Form.create()(AddGrayscale);
export default connect(state => {
  return{
    projectId: state.projectId,
    token: state.token
  }
}, {})(AddGrayscaleForm);
