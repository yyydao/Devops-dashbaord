import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Breadcrumb, message, Button, Checkbox} from 'antd';

import {reqPost, reqGet, checkPermission} from '@/api/api';
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;

class NoticeManager extends Component {
  constructor() {
    super();
    this.state = {
      taskTemplate: [],
      oldTaskTemplate: [],
      envTemplate: [],
      oldEnvTemplate: [],
      envPreviewData: {},
      taskPreviewData: {},
      envValue: {
        notice_env_project: "团贷网-Android",
        notice_env_task:"【提测】",
        notice_env_environment: "测试环境",
        notice_env_buildId: "338",
        notice_env_version: "V5.3.8",
        notice_env_submit: "liaoshengjian",
        notice_env_time: "2018-09-30 06:38PM",
        notice_env_detail: "【点击链接】",
        notice_env_atall:"@all"
      },
      taskValue: {
        notice_task_version: "V5.3.8",
        notice_task_task:"【流水线】",
        notice_task_time: "2018-09-30 06:38PM",
        notice_task_score: "89",
        notice_task_project: "团贷网-Android",
        notice_task_status: "成功/失败",
        notice_task_trigger_type: "liaoshengjian 手动触发/gitlab push by lixijian",
        notice_task_detail: "【点击链接】",
        notice_task_atall:"@all"
      },
      envToken: '',
      taskToken: ''
    }
  }

  componentWillMount() {
    this.getNoticeData()
  }

  getNoticeData = () => {
    reqGet('messageNotice/listNotice', {
      projectId: this.props.projectId
    }).then(res => {
      if (res.code === 0) {
        //判断每个任务模板是否全选
        res.data.taskTemplate.map(item => {
          if (!item.remind) {
            return
          }
          let selectAll = true
          item.contentItems.map(item1 => {
            if (!item1.checked) {
              selectAll = false
            }
          })
          item.selectAll = selectAll
        })
        //判断每个环境模板是否全选
        res.data.envTemplate.map(item => {
          if (!item.remind) {
            return
          }
          let selectAll1 = true
          item.contentItems.map(item1 => {
            if (!item1.checked) {
              selectAll1 = false
            }
          })
          item.selectAll = selectAll1
        })
        this.setState({
          taskTemplate: res.data.taskTemplate,
          oldTaskTemplate: JSON.parse(JSON.stringify(res.data.taskTemplate)),
          oldEnvTemplate: JSON.parse(JSON.stringify(res.data.envTemplate)),
          envTemplate: res.data.envTemplate,
          envToken: res.data.envTemplate[0].accessToken,
          taskToken: res.data.taskTemplate[0].accessToken
        })
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 开启通知的change事件
   * @param value boolean
   * @param index number 下标
   * @param type string 提测/流水线
   */
  startNoticeChange = (value, index, type) => {
    if (type === "envTemplate") {
      let envTemplate = this.state.envTemplate
      envTemplate[index].startNotice = value
      this.setState({envTemplate})
    } else {
      let taskTemplate = this.state.taskTemplate
      taskTemplate[index].startNotice = value
      this.setState({taskTemplate})
    }
  }

  /**
   * @desc 开启通知的change事件
   * @param value boolean
   * @param index number 下标
   * @param type string 提测/流水线
   */
  remindChecked = (value, index, type) => {
    if (type === "envTemplate") {
      let envTemplate = this.state.envTemplate
      envTemplate[index].remind = value
      this.setState({envTemplate})
    } else {
      let taskTemplate = this.state.taskTemplate
      taskTemplate[index].remind = value
      this.setState({taskTemplate})
    }
    this.isAllChecked(value, index, type)
  }

  /**
   * @desc 开启通知的change事件
   * @param value boolean
   * @param index number 下标
   * @param contentIndex contentItems数组的下标
   * @param type string 提测/流水线
   */
  contentItemChecked = (value, index, contentIndex, type) => {
    if (type === "envTemplate") {
      let envTemplate = this.state.envTemplate
      envTemplate[index].contentItems[contentIndex].checked = value
      this.setState({envTemplate})
    } else {
      let taskTemplate = this.state.taskTemplate
      taskTemplate[index].contentItems[contentIndex].checked = value
      this.setState({taskTemplate})
    }
    this.isAllChecked(value, index, type)
  }

  /**
   * @desc 全选的change事件
   * @param value boolean
   * @param index number 下标
   * @param type string 提测/流水线
   */
  selectAllChecked = (value, index, type) => {
    if (type === "envTemplate") {
      let envTemplate = this.state.envTemplate
      envTemplate[index].selectAll = value
      envTemplate[index].remind = value
      envTemplate[index].contentItems.map(item => item.checked = value)
      this.setState({envTemplate})
    } else {
      let taskTemplate = this.state.taskTemplate
      taskTemplate[index].selectAll = value
      taskTemplate[index].remind = value
      taskTemplate[index].contentItems.map(item => item.checked = value)
      this.setState({taskTemplate})
    }
  }

  /**
   * @desc 是否全选？是的话给selectAll设为true,不是的话不理啦
   * @param value boolean
   * @param index number 下标
   * @param type string 提测/流水线
   */
  isAllChecked = (value, index, type) => {
    if (type === "envTemplate") {
      let envTemplate = this.state.envTemplate
      if (value) {
        let isAll = false
        envTemplate[index].contentItems.map(item => {
          if (!item.checked) {
            isAll = true
          }
        })
        if (!isAll) {
          envTemplate[index].selectAll = true
          this.setState({envTemplate})
        }
      } else {
        if (envTemplate[index].selectAll) {
          envTemplate[index].selectAll = false
          this.setState({envTemplate})
        }
      }
    } else {
      let taskTemplate = this.state.taskTemplate
      if (value) {
        let isAll = false
        taskTemplate[index].contentItems.map(item => {
          if (!item.checked) {
            isAll = true
          }
        })
        if (!isAll) {
          taskTemplate[index].selectAll = true
          this.setState({taskTemplate})
        }
      } else {
        if (taskTemplate[index].selectAll) {
          taskTemplate[index].selectAll = false
          this.setState({taskTemplate})
        }
      }
    }
  }

  /**
   * @desc 保存数据
   * @param type string 提测/流水线
   */
  saveData = (type) => {
    let uploadData = type === 'envTemplate' ? JSON.parse(JSON.stringify(this.state.envTemplate)) : JSON.parse(JSON.stringify(this.state.taskTemplate))
    uploadData.map(item => {
      delete item.selectAll
      let contentItems = []
      item.contentItems.map((item1, index) => {
        if (item1.checked) {
          contentItems.push(item1.code)
        }
      })
      item.contentItem = contentItems.join(',')
      delete item.contentItems
    })

    reqPost('messageNotice/save', uploadData).then(res => {
      if (res.code === 0) {
        message.success('保存成功');
      } else {
        message.error(res.msg);
      }
    })
  }

  render() {
    const {taskTemplate, envTemplate, envPreviewData, envValue, taskPreviewData, taskValue, envToken, taskToken, oldTaskTemplate, oldEnvTemplate} = this.state

    return (
        <div>
          <Breadcrumb className="devops-breadcrumb">
            <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
            <BreadcrumbItem>通知管理</BreadcrumbItem>
          </Breadcrumb>
          {envTemplate &&
          <div className="nm-container">
            <p className="nm-title">【提测】-- 钉钉消息</p>
            <div className="nm-item">
              <span className="nm-key">access_token：</span>
              <input className="nm-input" defaultValue={envToken} disabled/>
            </div>
            <div className="nm-item">
              <div className="nm-item-left">
                {envTemplate.map((item, index) =>
                    <div className="nm-list" key={index}>
                      <div className="nm-list-lf">
                        <div style={{marginBottom: 8}}>{item.templateName}模板：</div>
                        <Checkbox style={{marginBottom: 8}}
                                  checked={item.startNotice}
                                  onChange={(e) => {
                                    this.startNoticeChange(e.target.checked, index, 'envTemplate')
                                  }}>
                          开启通知
                        </Checkbox>
                        <Button type="primary" onClick={() => {
                          this.setState({envPreviewData: item})
                        }}>预览</Button>
                      </div>
                      <div className="nm-list-rt">
                        <div className="nm-list-item">
                          <Checkbox checked={item.selectAll}
                                    onChange={(e) => {
                                      this.selectAllChecked(e.target.checked, index, 'envTemplate')
                                    }}>
                            全选</Checkbox>
                        </div>
                        {item.contentItems.map((contentItem, contentIndex) =>
                            <div className="nm-list-item" key={contentIndex}>
                              <Checkbox checked={contentItem.checked}
                                        onChange={(e) => {
                                          this.contentItemChecked(e.target.checked, index, contentIndex, 'envTemplate')
                                        }}>
                                {contentItem.name}</Checkbox>
                            </div>
                        )}
                        <div className="nm-list-item">
                          <Checkbox checked={item.remind}
                                    onChange={(e) => {
                                      this.remindChecked(e.target.checked, index, 'envTemplate')
                                    }}>
                            @提醒（在【发起提测】页面配置）</Checkbox>
                        </div>
                      </div>
                    </div>
                )}
                <div className="btn-group">
                  <Button type="primary" className="btn-group-item" onClick={() => {
                    this.saveData('envTemplate')
                  }}>保存</Button>
                  <Button type="primary" onClick={() => {
                    this.setState({envTemplate: JSON.parse(JSON.stringify(oldEnvTemplate))})
                  }}>重置</Button>
                </div>
              </div>
              {envPreviewData &&envPreviewData.contentItems&&
              <div className="nm-item-right">
                <p>预览：<span>({envPreviewData.templateName && envPreviewData.templateName})</span></p>
                <div className="nm-preview">
                  {envPreviewData.contentItems.map((item, index) => {
                    if (item.checked) {
                      return <p key={index}>{item.name}：{envValue[item.code]}</p>
                    }
                  })
                  }{
                  envPreviewData.remind && <p>@莫栋鸿@黎锡坚@何浩东</p>
                }
                </div>
              </div>
              }
            </div>
          </div>
          }
          {taskTemplate &&
          <div className="nm-container">
            <p className="nm-title">【流水线】-- 钉钉消息</p>
            <div className="nm-item">
              <span className="nm-key">access_token：</span>
              <input className="nm-input" defaultValue={taskToken} disabled/>
            </div>
            <div className="nm-item">
              <div className="nm-item-left">
                {taskTemplate.map((item, index) =>
                    <div className="nm-list" key={index}>
                      <div className="nm-list-lf">
                        <p style={{marginBottom: 8}}>【{item.templateName}】模板：</p>
                        <Checkbox style={{marginBottom: 8}}
                                  checked={item.startNotice}
                                  onChange={(e) => {
                                    this.startNoticeChange(e.target.checked, index, 'taskTemplate')
                                  }}>
                          开启通知
                        </Checkbox>
                        <Button type="primary" onClick={() => {
                          this.setState({taskPreviewData: item})
                        }}>预览</Button>
                      </div>
                      <div className="nm-list-rt">
                        <div className="nm-list-item">
                          <Checkbox checked={item.selectAll}
                                    onChange={(e) => {
                                      this.selectAllChecked(e.target.checked, index, 'taskTemplate')
                                    }}>
                            全选</Checkbox>
                        </div>
                        {item.contentItems.map((contentItem, contentIndex) =>
                            <div className="nm-list-item" key={contentIndex}>
                              <Checkbox checked={contentItem.checked}
                                        onChange={(e) => {
                                          this.contentItemChecked(e.target.checked, index, contentIndex, 'taskTemplate')
                                        }}>
                                {contentItem.name}</Checkbox>
                            </div>
                        )}
                        <div className="nm-list-item">
                          <Checkbox checked={item.remind}
                                    onChange={(e) => {
                                      this.remindChecked(e.target.checked, index, 'taskTemplate')
                                    }}>@提醒所有人</Checkbox>
                        </div>
                      </div>
                    </div>
                )}
                <div className="btn-group">
                  <Button type="primary" className="btn-group-item" onClick={() => {
                    this.saveData('taskTemplate')
                  }}>保存</Button>
                  <Button type="primary" onClick={() => {
                    this.setState({taskTemplate: JSON.parse(JSON.stringify(oldTaskTemplate))})
                  }}>重置</Button>
                </div>
              </div>
              {taskPreviewData && taskPreviewData.contentItems &&
              <div className="nm-item-right">
                <p>预览：<span>({taskPreviewData.templateName && taskPreviewData.templateName})</span></p>
                <div className="nm-preview">
                  {taskPreviewData.contentItems.map((item, index) => {
                    if (item.checked) {
                      return <p key={index}>{item.name}：{taskValue[item.code]}</p>
                    }
                  })
                  }{
                  taskPreviewData.remind && <p>@所有人</p>
                }
                </div>
              </div>
              }
            </div>
          </div>
          }
        </div>
    )
  }
}

export default connect(state => {
  return {
    projectId: state.projectId
  }
}, {})(NoticeManager);