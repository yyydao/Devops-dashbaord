import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'

import {
  Breadcrumb,
  Button,
  Spin,
  Icon,
  Skeleton,
  Modal,
  message,
  Row,
  Col,
  Input,
  Form,
  Card,
} from 'antd'

const { TextArea } = Input
const { Meta } = Card
const FormItem = Form.Item

const QRCode = require('qrcode.react')

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
      apkBuildId: '',
      dingTalk: '',
      jenkinsStatus: '',

      passwdBuild: 0,
      formDataUser: '',
      formDataPassword: ''
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
      if (res.code == 0) {
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
          jenkinsStatus
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
          jenkinsStatus
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
          <p>{res.code == 0 ? '已成功发起构建' : res.msg}</p>
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
      if (res.code != 0) {
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
      // passwdBuild: passwdBuild
    }, () => {
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      buildId: nextProps.buildId,
      appUrl: `${window.location.origin}/package/download?buildId=${nextProps.buildId}&token=${this.props.token ? this.props.token : ''}`,
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
      submitContent, rebuildContent, appUrl, openTesting,
      formDataUser, regressDesc, formDataPassword, passwdBuild, jenkinsStatus, buildId, envId
    } = this.state
    const { onCancleSuccess } = this.props
    let regressButton, cancleButton
    let rebuildButton
    let downloadButton
    let actionArray = []
    let cardTitle = <span color='#1890ff'>正在构建...</span>

    if (status === 0) {
      cardTitle = fileName
      downloadButton =
        <Button ghost type="primary" icon="download"><a href={appUrl} target="_blank">下载</a></Button>
      actionArray.push(downloadButton)
    }
    if (status === 1 || status === 2) {
      cardTitle = <span color='#f5222d'>failure</span>
      rebuildButton = <Button ghost type="primary" icon="redo" onClick={this.rebuild}>重新提交</Button>
      actionArray.push(rebuildButton)
    }
    if (jenkinsStatus === 1 || jenkinsStatus === 2) {
      cancleButton = <Button ghost type="primary" icon="redo"
                             onClick={(e) => {onCancleSuccess(null, buildId, envId)}}>取消构建</Button>
      actionArray.push(cancleButton)
    }
    // if (openTesting) {
    //     regressButton = <Button ghost type="primary" icon="sync" onClick={this.showRegressModal}>版本回归</Button>
    //     actionArray.push(regressButton)
    // }

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
      <div className="pkgdetail">
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

          <Card
            style={{ width: 560 }}
            // cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
            actions={actionArray}
          >
            <Meta
              // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={cardTitle}
              description={
                <div>
                  <Row>
                    <Col span={12}>
                      <Row>
                        {status === 0 &&
                        <Col>版本：{version}</Col>}
                        {status === 0 && this.state.apkBuildId && this.state.apkBuildId.length > 0 &&
                        <Col>Code:{apkBuildId}</Col>}
                        {status === 0 && <Col>大小：{fileSize}</Col>}
                        <Col>时间：{buildTime}</Col>
                      </Row>
                    </Col>
                    <Col span={12}>
                      {status === 0 &&
                      <div style={{ width: 170 }}>
                        <QRCode value={appUrl} size={170}/>
                        <p style={{ textAlign: 'center', color: '#000' }}>【钉钉】扫码安装</p>
                      </div>
                      }
                    </Col>

                  </Row>
                  <Row>
                    <p>提测人：{taskMaster}</p>
                    <p>提测分支：{codeBranch}</p>
                    <p>提测详情：{submitDetails}</p>
                    <p>提测概要：</p>
                    <p className="pkgdetail-info-desc">{submitContent}</p>
                    {
                      rebuildContent &&
                      <div>
                        <p>回归内容：</p>
                        <p className="pkgdetail-info-desc">{rebuildContent}</p>
                      </div>
                    }

                  </Row>
                </div>
              }
            />
          </Card>
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
