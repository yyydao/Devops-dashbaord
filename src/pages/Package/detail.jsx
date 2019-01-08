import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'

import {
  Button,
  Skeleton,
  Modal,
  message,
  Row,
  Col,
  Input,
  Form,
} from 'antd'

const { TextArea } = Input
const FormItem = Form.Item

class packageDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      buildId: props.buildId,
      addVisible: false,
      regressModalVisible: false,
      addConfirmLoading: false,
      branchList: [],
      sceneList: [],
      sceneIndeterminate: false,
      sceneCheckAll: false,
      breadcrumbPath: [],
      formDataBranch: null,
      formDataScene: [],
      formDataTime: '',
      formDataReDesc: '',
      regressDesc: '',
      loading: true,
      skeletonLoading: true,

      timer: null,

      version: '',
      taskMaster: '',
      codeBranch: '',
      fileName: '',
      fileSize: '',
      buildTime: '',
      submitDetails: '',
      submitContent: '',
      rebuildContent: '',
      imageUrl: '',
      openTesting: '',
      performanceProjectId: '',
      performanceProjectStatus: '',
      downloadPath: '',
      status: null,
      envName: '',
      taskId: '',
      envId: '',
      appUrl: '',
      ipaPath: '',
      apkBuildId: '',
      dingTalk: '',
      jenkinsStatus: '',
      storys:[],
      demandName:'',

      passwdBuild: 0,
      formDataUser: '',
      formDataPassword: '',
      buildUrl:''
    }
  }

  propTypes: {
    buildId: PropTypes.string.isRequired
  }
  /**
   * @desc 获取详情
   */
  getDetail = () => {
    reqGet('/package/detail', {
      buildId: this.state.buildId
    }).then((res) => {
      if (res.code === 0 || res.code === '0') {
        const {
          version,
          taskMaster,
          codeBranch,
          fileName,
          fileSize,
          buildTime,
          submitDetails,
          submitContent,
          rebuildContent,
          imageUrl,
          openTesting,
          performanceProjectId,
          downloadPath,
          status,
          envName,
          taskId,
          envId,
          dingTalk,
          passwdBuild,
          jenkinsStatus,
          ipaPath,
          storys,
          demandName,
          buildUrl
        } = res.data

        this.setState({
          version,
          taskMaster,
          codeBranch,
          fileName,
          fileSize,
          buildTime,
          submitDetails,
          submitContent,
          rebuildContent,
          imageUrl,
          openTesting,
          performanceProjectId,
          downloadPath,
          status,
          envName,
          taskId,
          envId,
          dingTalk,
          passwdBuild,
          jenkinsStatus,
          ipaPath,
          storys,
          demandName,
          buildUrl
        })
        if (res.data.apkBuildId) {
          this.setState({ apkBuildId: res.data.apkBuildId })
        }
      } else {
        Modal.info({
          title: '提示',
          content: (
            <p>{res.msg}</p>
          ),
          onOk () {
          }
        })
      }
    }).finally(() => {
      this.setState({
        loading: false,
        skeletonLoading: false,
      })
    })
  }
  /**
   * @desc 发起构建
   */
  rebuild = () => {
    reqGet('/package/failure/recommit', {
      taskId: this.state.taskId
    }).then((res) => {
      Modal.info({
        title: '提示',
        content: (
          <p>{res.code === 0 ? '已成功发起构建' : res.msg}</p>
        ),
        onOk () {
        }
      })
    })
  }

  /**
   * @desc 取消构建
   */
  cancleBuild = (buildId, envID, onCancleSuccess) => {
    reqPost('/package/cancel', {
      buildId: buildId,
      type: 0,
      envId: envID
    }).then((res) => {
      if (res.code !== 0) {
        Modal.info({
          title: '提示',
          content: (
            <p>{res.msg}</p>
          ),
          onOk () {}
        })
      } else {
        message.success('取消成功')
        onCancleSuccess()
      }
    })
  }
  /**
   * @desc 回归
   */
  versionRegress = () => {
    const { envId, taskMaster, codeBranch, submitContent, submitDetails, regressDesc, formDataUser, formDataPassword, dingTalk } = this.state
    if (!this.state.regressDesc) {
      message.error('请输入回归内容')
      return
    }
    reqPost('/package/regression', {
      projectId: this.props.projectId,
      envId: envId,
      developer: taskMaster,
      branchName: codeBranch,
      content: submitContent,
      details: submitDetails,
      noticeEmails: '',
      regression: regressDesc,
      userName: formDataUser,
      password: formDataPassword,
      dingTalk: dingTalk
    }).then((res) => {
      if (res.code === 0) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    })
    this.setState({
      regressModalVisible: false
    })
  }

  /**
   * @desc 显示回归的窗口
   */
  showRegressModal = () => {
    this.setState({
      regressModalVisible: true
    })
  }

  /**
   * @desc 隐藏回归的窗口
   */
  hideRegressModal = () => {
    this.setState({
      regressModalVisible: false,
      addConfirmLoading: false
    })
  }

  componentWillMount () {
    this.getDetail()
    this.setState({
      appUrl: `${window.location.origin}/package/download?buildId=${this.state.buildId}&token=${this.props.token ? this.props.token : ''}`,
      ipaPath: this.state.ipaPath,
      // passwdBuild: passwdBuild
    }, () => {
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      buildId: nextProps.buildId,
      appUrl: `${window.location.origin}/package/download?buildId=${nextProps.buildId}&token=${this.props.token ? this.props.token : ''}`,
      ipaPath: nextProps.ipaPath,
    }, () => {
      this.getDetail()
    })
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  render () {
    const {
      regressModalVisible, addConfirmLoading, dingTalk,
      status, apkBuildId, fileName, version, fileSize, buildTime, taskMaster, codeBranch, submitDetails,
      submitContent, rebuildContent, appUrl, imageUrl,
      formDataUser, regressDesc, formDataPassword, passwdBuild, jenkinsStatus, buildId, envId, storys, demandName,buildUrl
    } = this.state
    const { onCancleSuccess } = this.props
    let cancleButton,rebuildButton,downloadButton,showLogButton
    let actionArray = []
    let cardTitle = <span style={{ color: '#1890FF' }}>正在构建...</span>

    if (status === 0) {
      cardTitle = fileName
      downloadButton =
        <Button key={1} ghost type="primary" icon="download"><a href={appUrl} target="_blank">下载</a></Button>
      actionArray.push(downloadButton)
    }
    if (status === 1 || status === 2) {
      cardTitle = <span style={{ color: '#F5222D' }}>失败</span>
      rebuildButton = <Button key={2} ghost type="primary" icon="redo" onClick={this.rebuild}>重新提交</Button>
      showLogButton = <Button key={4} type="primary" style={{marginRight:16}}><a href={buildUrl}>查看日志</a></Button>
      actionArray.push(showLogButton,rebuildButton)
    }
    if (jenkinsStatus === 1 || jenkinsStatus === 2) {
      if(jenkinsStatus === 1 ){
        cardTitle = <span style={{ color: '#1890FF' }}>等待构建...</span>
      }
      cancleButton = <Button key={3} ghost type="primary" icon="redo"
                             onClick={(e) => {onCancleSuccess(null, buildId, envId)}}>取消构建</Button>
      actionArray.push(cancleButton)
    }


    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <div className="packagedetail">
        <Modal title="版本回归"
               visible={regressModalVisible}
               onOk={this.versionRegress}
               confirmLoading={addConfirmLoading}
               onCancel={this.hideRegressModal}
               maskClosable={false}
               destroyOnClose={true}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="提测人"
            >
              <p className="pForList">{taskMaster}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="开发分支"
            >
              <p className="pForList">{codeBranch}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="提及@"
            >
              <p className="pForList">{dingTalk}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="提测概要"
            >
              <p className="pForList">{submitContent}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="提测详情"
            >
              <p className="pForList">{submitDetails}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="回归内容"
            >
                          <TextArea rows={4} placeholder="回归内容（多行）" value={regressDesc} onChange={(e) => {
                            this.setState({ regressDesc: e.target.value })
                          }}/>
            </FormItem>
            {
              passwdBuild === 1 &&
              <div>
                <FormItem
                  {...formItemLayout}
                  label="构建账号"
                >
                  <Input placeholder="构建账号" value={formDataUser} onChange={(e) => {
                    this.setState({ formDataUser: e.target.value })
                  }}/>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="构建账号"
                >
                  <Input placeholder="构建账号" value={formDataPassword} onChange={(e) => {
                    this.setState({ formDataPassword: e.target.value })
                  }}/>
                </FormItem>
              </div>
            }
          </Form>
        </Modal>
        <Skeleton loading={this.state.skeletonLoading}>
          <div className='detail-card'>

            <div className="detail-meta">
              <div className="detail-meta-content">

                <Row>
                  <Col span={18} className="detail-main">
                    <h3 className='detail-title'>{cardTitle}</h3>
                    {status === 0 &&
                    <p><span>版本：</span>{version}</p>}
                    {status === 0 && this.state.apkBuildId && this.state.apkBuildId.length > 0 &&
                    <p><span>Code：</span>{apkBuildId}</p>}
                    {status === 0 && <p><span>大小：</span>{fileSize}</p>}
                    <p><span>时间：</span>{buildTime}</p>
                    <p><span>提测人：</span>{taskMaster}</p>
                    <p><span>提测分支：</span>{codeBranch}</p>
                    <p><span>提测详情：</span><a href={submitDetails} target="_blank">{submitDetails}</a></p>
                  </Col>
                  <Col span={6}>
                    {status === 0 &&
                    <div style={{ width: 120 }}>
                      <img width='140' src={imageUrl} alt="下载二维码"/>
                      <p style={{ textAlign: 'center', color: '#000' }}>【钉钉】扫码安装</p>
                    </div>
                    }
                  </Col>
                </Row>
                <p><span>提测需求：</span><Link to={'/requirement'}>{demandName}</Link></p>
                <div className="packagedetail-info-desc" style={{padding:8,overflowY:"scroll",maxHeight:200}}>
                  {storys&&storys.length>0&& storys.map((item,index)=><p key={index} style={{marginBottom:4}}>{item}</p>)
                  }
                  </div>
                <p><span>提测概要：</span></p>
                <p className="packagedetail-info-desc">{submitContent}</p>
                {
                  rebuildContent &&
                  <div>
                    <p><span>回归内容：</span></p>
                    <p className="packagedetail-info-desc">{rebuildContent}</p>
                  </div>
                }
              </div>
              <div className="detail-action">{actionArray}</div>
            </div>
          </div>
        </Skeleton>
      </div>
    )
  }
}

packageDetail = connect((state) => {
  return {
    token: state.token,
    projectId: state.projectId
  }
})(packageDetail)

export default packageDetail
