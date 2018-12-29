import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reqPost, reqGet } from '@/api/api'
import './list.scss'
import favicon from '@/assets/favicon.ico'

import BuildTestPackageDetail from './detail'

import {
  Icon, Button, Input, Modal, Select, Pagination,
  Mention, message, Row, Col
} from 'antd'

const { TextArea } = Input
const Option = Select.Option
const { toContentState, getMentions } = Mention

class BuildTestPackage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      projectId: props.projectId,

      //控制列表数量以及当前页码
      totalCount: 100,
      curPage: 1,

      //列表list
      dataList: [],
      //环境列表
      envList: [],
      //版本列表
      versionList: [],
      //用户列表
      mentionList: [],
      // 当前buildId
      currentBuild: '',

      //筛选条件
      envID: '',
      status: 0,//默认显示成功列表
      version: '',
      selectDisabled: false,//环境&版本是否可选择

      //正在构建的数量
      buildingNum: 0,
      //状态集合
      statusList: ['成功', '等待构建', '正在构建', '构建失败', '取消构建'],

      //新建提测
      modalVisible: false,
      modalConfirmLoading: false,
      branchList: [],
      formDataBranch: null,
      formDataName: JSON.parse(localStorage.getItem('userInfo')).name,
      fromDataMail: '',
      formDataDesc: '',
      formDataWiki: '',
      formDataReDesc: '',
      formDataUser: '',
      formDataPassword: '',
      passwdBuild: 0,
      formDataEnvID: '',
      dingTalk: toContentState(''),
      suggestions:[]
    }
  }

  propTypes: {
    projectId: PropTypes.string.isRequired
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      projectId: nextProps.projectId
    }, () => {
      this.getEnvList()
      this.getBuildingNum()
      this.getMentionList()
    })
  }

  componentWillMount () {
    this.getEnvList()
    this.getBuildingNum()
    this.getMentionList()
  }

  /**
   * @desc 获取环境列表
   */
  getEnvList = () => {
    const { projectId } = this.state
    reqGet('package/envselect', { projectID: projectId }).then(res => {
      if (res.code === 0) {
        let id = ''
        res.data.map(item => {
          if (item.name === '测试环境') {id = item.id}
          return item
        })
        this.setState({
          envList: res.data,
          envID: id//默认为测试环境
        }, () => {this.getVersionList()})
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取版本列表
   */
  getVersionList = () => {
    const { projectId, envID, selectDisabled } = this.state
    reqGet('package/versionselect', {
      projectID: projectId,
      envID: envID
    }).then(res => {
      if (res.code === 0) {
        let buildVersion = ''
        if (res.data.length > 0 && !selectDisabled) {
          buildVersion = res.data[0].buildVersion
        }
        this.setState({
          versionList: res.data,
          version: buildVersion
        }, () => this.getPackageList())
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取正在构建的数量
   */
  getBuildingNum = () => {
    const { projectId } = this.state
    reqGet('package/buildingcount', {
      projectID: projectId
    }).then(res => {
      if (res.code === 0) {
        this.setState({ buildingNum: res.data })
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取提测列表
   */
  getPackageList = () => {
    const { projectId, envID, status, version, curPage } = this.state
    this.setState({ currentBuild: '' })//隐藏详情

    reqGet('package/packagelist', {
      projectID: projectId, envID, status, version, page: curPage, limit: 6
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          totalCount: res.data.totalCount,
          dataList: res.data.list,
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 筛选条件改变事件
   * @param e 条件被修改的值
   * @param key 条件字段
   */
  filterChange = (e, key) => {
    let newState = {}
    newState[key] = e
    newState['curPage'] = 1
    this.setState(newState, () => {
      if (key === 'envID') {
        this.getVersionList()
      } else if (key === 'status') {
        if (e === 99 || e === 3) {//状态为失败和构建中时，版本为不可选
          this.setState({ version: '', selectDisabled: true }, () => {this.getPackageList()})
        } else {
          let version = this.state.version
          if (this.state.versionList.length > 0 && !this.state.version) {
            version = this.state.versionList[0].buildVersion
          }
          this.setState({ selectDisabled: false, version: version }, () => {this.getPackageList()})
        }
      } else {
        this.getPackageList()
      }
    })
  }

  /**
   * @desc 分页的改变事件
   * @param page 修改成的页数
   */
  onPaginationChange = (page) => {
    this.setState({ curPage: page }, () => {this.getPackageList()})
  }

  /**
   * @desc 列表item的高亮显示以及详情页的调起
   * @param buildID
   */
  onListItemClick = (buildID) => {
    let dataList = this.state.dataList
    dataList.map(item => {
      item.active = item.buildID === buildID ? true : false
      return item
    })
    this.setState({ dataList, currentBuild: buildID })
  }

  /**
   * @desc 下载按钮点击
   */
  onDownloadClick = (e, buildId) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`${window.location.origin}/package/download?buildId=${buildId}&token=${this.props.token ? this.props.token : ''}`)
  }

  /**
   * @desc 取消按钮事件
   */
  onCancleClick = (e, buildId, envID) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
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
        this.getPackageList()
      }
    })
  }

  /**
   * @desc 获取@用户列表
   */
  getMentionList = () => {
    const { projectId } = this.state
    reqGet('package/selectusers', {
      projectID: projectId,
    }).then(res => {
      if (res.code === 0) {
        let mentionList = []
        res.data.map(item => {
          mentionList.push(item.name)
          return item
        })
        this.setState({ mentionList ,suggestions:mentionList})
      } else {
        message.error(res.msg)
      }
    })
  }
  /**
   * @desc 切换显示提测窗口
   * @param isShow
   */
  toggleBuildModal = (isShow = true) => {
    const newState = {
      modalVisible: isShow,
      modalConfirmLoading: false
    }

    if (isShow) {
      this.getBranchList()
    } else {
      newState.fromDataMail = ''
      newState.formDataDesc = ''
      newState.formDataWiki = ''
      newState.formDataReDesc = ''
      newState.formDataUser = ''
      newState.formDataPassword = ''
      newState.formDataEnvID = ''
      newState.passwdBuild = 0
    }

    this.setState(newState)
  }

  //Input && Textarea 数据绑定
  bindInput = (e, name) => {
    const newState = {}
    newState[name] = e.target.value
    this.setState(newState)
  }

  //获取分支列表
  getBranchList = (value = '') => {
    reqPost('/branch/selectBranch', {
      projectId: this.props.projectId,
      branchName: value,
      pageSize: 100,
      pageNum: 1,
      type: 1,
      search: value ? 1 : ''
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          branchList: res.data
        })
      }
    })
  }

  //修改选中分支
  changeNewBuildSelect = (e, name) => {
    const newState = {}
    if (name === 'formDataEnvID') {
      this.state.envList.map(item => {
        if (item.id === e) {
          newState['passwdBuild'] = item.passwdBuild
        }
        return item
      })
    }
    newState[name] = e
    this.setState(newState)
  }

  addBuild = () => {
    const { formDataEnvID, passwdBuild, formDataName, formDataBranch, formDataDesc, formDataWiki, formDataReDesc, formDataUser, formDataPassword, dingTalk } = this.state
    const url = '/package/addSubmit'

    if (!formDataEnvID) {
      message.error('请选择“环境”')
      return
    }
    if (!formDataName) {
      message.error('请填写“提测人”')
      return
    } else if (!formDataBranch) {
      message.error('请选择“开发分支”')
      return
    }
    if (!formDataDesc) {
      message.error('请填写“提测概要”')
      return
    }
    if (passwdBuild === 1) {
      if (!formDataUser) {
        message.error('请填写“构建账号”')
        return
      } else if (!formDataPassword) {
        message.error('请选择“构建密码”')
        return
      }
    }

    this.setState({
      modalConfirmLoading: true
    })

    reqPost(url, {
      projectId: this.props.projectId,
      envId: formDataEnvID,
      developer: formDataName,
      branchName: formDataBranch,
      content: formDataDesc,
      details: formDataWiki,
      dingTalk: getMentions(dingTalk).join(','),
      userName: formDataUser,
      password: formDataPassword,
      regression: formDataReDesc
    }).then((res) => {
      this.toggleBuildModal(false)

      if (res.code === 0) {
        message.success('新增提测成功')
        this.getPackageList()
      } else {
        Modal.info({
          title: '提示',
          content: (
            <p>{res.msg}</p>
          ),
          onOk () {}
        })
      }
    })
  }

  /**
   * @desc mention change事件
   */
  onMentionChange = (suggestion) => {
    this.setState({
      dingTalk: suggestion,
    })
  }

  onSearchChange = (value, trigger) => {
    const dataSource = this.state.mentionList;
    this.setState({
      suggestions: dataSource.filter(item => item.indexOf(value) !== -1),
    });
  }
  render () {
    const {
      totalCount,
      curPage,
      envList,
      versionList,
      dataList,
      envID,
      status,
      buildingNum,
      version,
      statusList,
      modalVisible,
      modalConfirmLoading,
      formDataBranch,
      branchList,
      dingTalk,
      formDataDesc,
      formDataWiki,
      formDataName,
      passwdBuild,
      formDataUser,
      formDataPassword,
      formDataEnvID,
      selectDisabled,
      suggestions
    } = this.state

    return (
      <div className="package">
        <Modal title="新增提测"
               visible={modalVisible}
               onOk={this.addBuild}
               confirmLoading={modalConfirmLoading}
               okText='确定'
               cancelText='取消'
               onCancel={() => {this.toggleBuildModal(false)}}
               maskClosable={false}
               destroyOnClose={true}
               width={600}>
          <div className="package-modal-item">
            <Input placeholder="提测人" style={{ width: 120, marginRight: 24 }} value={formDataName} onChange={(e) => {
              this.bindInput(e, 'formDataName')
            }}/>
            <Select placeholder="环境"
                    value={formDataEnvID || undefined}
                    onChange={(e) => this.changeNewBuildSelect(e, 'formDataEnvID')}
                    style={{ width: 120, marginRight: 24 }}>
              {envList.map((item, index) => {
                return <Option value={item.id} key={index}>{item.name}</Option>
              })}
            </Select>
            <Select placeholder="开发分支"
                    showSearch
                    value={formDataBranch || undefined}
                    onSearch={this.getBranchList}
                    onChange={(e) => this.changeNewBuildSelect(e, 'formDataBranch')}
                    style={{ width: 264 }}>
              {branchList.map((item, index) => {
                return <Option value={item.name} key={index}>{item.name}</Option>
              })}
            </Select>
          </div>
          <div className="package-modal-item">
            <Mention
              style={{ width: '100%', minHeight: 88 }}
              value={dingTalk}
              suggestions={suggestions}
              onChange={(e) => {this.onMentionChange(e)}}
              placeholder='钉钉通知（输入“@”选择用户，以空格分隔）'
              prefix={['@']}
              onSearchChange={this.onSearchChange}
            />
          </div>
          <div className="package-modal-item">
              <TextArea
                style={{ width: '100%', minHeight: 88 }}
                rows={4}
                placeholder="提测概要（多行，请按实际情况填写）"
                value={formDataDesc}
                onChange={(e) => {this.bindInput(e, 'formDataDesc')}}/>
          </div>
          <div className="package-modal-item">
            <Input
              placeholder="提测详情（Wiki文档）"
              value={formDataWiki}
              onChange={(e) => {this.bindInput(e, 'formDataWiki')}}/>
          </div>
          {passwdBuild === 1 &&
          <div>
            <div className="package-modal-item">
              <Input placeholder="构建账号" value={formDataUser} onChange={(e) => {
                this.bindInput(e, 'formDataUser')
              }}/>
            </div>
            <div className="package-modal-item">
              <Input placeholder="构建密码" value={formDataPassword} onChange={(e) => {
                this.bindInput(e, 'formDataPassword')
              }}/>
            </div>
          </div>
          }
        </Modal>
        <div className="package-title">
          <Button type="primary" onClick={() => {this.toggleBuildModal(true)}}>新增提测</Button>
          <span style={{ paddingRight: 0, paddingLeft: 40 }}>环境：</span>
          <Select value={envID}
                  style={{ width: 150, marginRight: 40 }}
                  onChange={(e) => {this.filterChange(e, 'envID')}}>
            {envList.length > 0 && envList.map((item, index) => {
              return <Option value={item.id} key={index}>{item.name}</Option>
            })}
          </Select>
          <span style={{ paddingRight: 0 }}>版本：</span>
          <Select value={version}
                  style={{ width: 150, marginRight: 40 }}
                  onChange={(e) => {this.filterChange(e, 'version')}}
                  disabled={selectDisabled}>
            {versionList.length > 0 && versionList.map((item, index) => {
              return <Option value={item.buildVersion} key={index}>{item.appVersion}</Option>
            })}
          </Select>
          <span style={{ paddingRight: 0 }}>类型：</span>
          <Select value={status}
                  style={{ width: 150, marginRight: 40 }}
                  onChange={(e) => {this.filterChange(e, 'status')}}>
            <Option value={0}>成功</Option>
            <Option value={3}>失败</Option>
            <Option value={99}>构建中</Option>
          </Select>
          <span style={{ color: '#389E0D', paddingRight: 8 }}>Tips：{buildingNum}个任务正在构建...</span>
        </div>
        <div className="package-content">
          {
            dataList.length > 0 &&
            <Row className="package-content-wrapper">

              <Col span={12} className="package-content-col col-left">

                <div className="package-content-left">

                  <div className="package-list">
                    {dataList.map((item, index) => {
                      let fileName = '', button = ''
                      if (item.jenkinsStatus === 0) {
                        fileName = <span className="fileName">{item.fileName}</span>
                        button = <Button
                          size="small"
                          type="primary"
                          style={{ marginRight: '24px' }}
                          onClick={(e) => {this.onDownloadClick(e, item.buildID)}}>下载</Button>
                      }
                      if (item.jenkinsStatus > 0 && item.jenkinsStatus < 3) {
                        fileName = <span className="fileName"
                                         style={{ color: '#1890FF' }}>{statusList[item.jenkinsStatus]}...</span>
                        button = <Button
                          size="small"
                          type="primary"
                          style={{ marginRight: '24px' }}
                          onClick={(e) => {this.onCancleClick(e, item.buildID, item.envID)}}>取消</Button>
                      }
                      if (item.jenkinsStatus > 2 && item.jenkinsStatus < 4) {
                        fileName = <span className="fileName"
                                         style={{ color: '#F5222D' }}>{statusList[item.jenkinsStatus]}</span>
                        button = <Button
                          size="small"
                          type="primary"
                          style={{ marginRight: '24px' }}>查看</Button>
                      }
                      return <Row type="flex" justify="space-between" align="middle"
                                  className="package-list-item"
                                  key={index}
                                  style={{ background: item.active ? '#F0FAFF' : '#fff' }}
                                  onClick={() => {this.onListItemClick(item.buildID)}}>
                        <Col span={20}>
                          <Row type="flex" justify="start" align="middle">
                            <Col>
                              <img src={item.iconPath || favicon} alt='icon'/>
                            </Col>
                            <Col>
                              <p>
                                {fileName}<span style={{ paddingLeft: '15px' }}>buildId：{item.buildID}</span>
                              </p>
                              <p>
                                <span>{item.createTime}</span>
                                <span style={{ paddingLeft: '27px' }}>提测人：{item.developer}</span>
                              </p>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={4}>
                          <div className="list-item-control">
                            <Col>
                              {!item.active && button}
                            </Col>
                            <Col>
                              {!item.active && <Icon type="right"/>}
                            </Col>
                          </div>
                        </Col>
                      </Row>
                    })
                    }
                  </div>

                  <div className="package-pager-wrapper">
                    <Pagination size="small"
                                onChange={(e) => {this.onPaginationChange(e)}}
                                total={totalCount}
                                showTotal={total => `共 ${totalCount} 条`}
                                pageSize={6}
                                current={curPage}
                                style={{ cssFloat: 'right' }}/>
                  </div>
                </div>
              </Col>

              <Col span={12} className="package-content-col">
                {!!this.state.currentBuild &&
                <BuildTestPackageDetail buildId={this.state.currentBuild} onCancleSuccess={this.onCancleClick}/>
                }
              </Col>

            </Row>

          }
        </div>
      </div>

    )
  }
}

BuildTestPackage = connect((state) => {
  console.log(state)
  return {
    token: state.token,
    projectId: state.projectId
  }
})(BuildTestPackage)

export default BuildTestPackage
