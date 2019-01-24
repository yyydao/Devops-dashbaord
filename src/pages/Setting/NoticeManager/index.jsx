import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Breadcrumb, message, Button, Checkbox, Card, Row, Col, Modal} from 'antd';

import {reqPost, reqGet} from '@/api/api';
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
      reviewData: {},
      reviewValue:{},
      modalVisible:false,
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
        res.data.taskTemplate.noticeTemplates.map(item => {
          if (!item.remind) {
            return item
          }
          let selectAll = true
          item.contentItems.map(item1 => {
            if (!item1.checked) {
              selectAll = false
            }
            return item1
          })
          item.selectAll = selectAll
          return item
        })
        //判断每个环境模板是否全选
        res.data.envTemplate.noticeTemplates.map(item => {
          if (!item.remind) {
            return item
          }
          let selectAll1 = true
          item.contentItems.map(item1 => {
            if (!item1.checked) {
              selectAll1 = false
            }
            return item1
          })
          item.selectAll = selectAll1
          return item
        })
        this.setState({
          taskTemplate: res.data.taskTemplate.noticeTemplates,
          oldTaskTemplate: JSON.parse(JSON.stringify(res.data.taskTemplate)),
          oldEnvTemplate: JSON.parse(JSON.stringify(res.data.envTemplate)),
          envTemplate: res.data.envTemplate.noticeTemplates,
          envToken: res.data.envTemplate.accessToken,
          taskToken: res.data.taskTemplate.accessToken
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
          return item
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
          return item
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
        return item1
      })
      item.contentItem = contentItems.join(',')
      delete item.contentItems
      return item
    })

    let uploadObj={}
    uploadObj.accessToken= type==='envTemplate'?this.state.envToken:this.state.taskToken
    uploadObj.messageNoticeManages=uploadData

    reqPost('messageNotice/save', uploadObj).then(res => {
      if (res.code === 0) {
        message.success('保存成功');
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 预览
   * @param data object 预览数据
   * @param type string task流水线/env提测
   */
  previewData = (data, type) =>{
    this.setState({reviewData:data,reviewValue:type==='env'?this.state.envValue:this.state.taskValue},()=>{this.setState({modalVisible:true})})

  }

  render() {
    const {taskTemplate, envTemplate, reviewData, reviewValue, modalVisible, envToken, taskToken, oldTaskTemplate, oldEnvTemplate} = this.state
    return (
        <div>
          <Breadcrumb className="devops-breadcrumb">
            <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
            <BreadcrumbItem>通知管理</BreadcrumbItem>
          </Breadcrumb>
          <div className="content-container">
            {envTemplate && envTemplate.length>0 &&
            <Card title="[提测]--钉钉消息">
              <div className="token-container">
                <span>access_token：</span>
                <input value={envToken} onChange={(e)=>{this.setState({envToken:e.target.value})}}/>
              </div>
              {envTemplate.map((item, index) =>
                <Card
                  type="inner"
                  title={item.templateName+"模板："}
                  key={index}
                  style={{marginBottom:24}}
                  extra={
                    <div>
                      <Checkbox
                        style={{marginRight:24}}
                        checked={item.startNotice}
                        onChange={(e) => {
                          this.startNoticeChange(e.target.checked, index, 'envTemplate')
                        }}>
                        开启通知
                      </Checkbox>
                      <button style={{padding:"2px 16px",color: "#fff",backgroundColor:"#1890ff",border:"none",borderRadius:4,cursor:"pointer"}}
                              onClick={() => {this.previewData(item,'env')}}>预览</button>
                    </div>}>
                  <div className="nm-list-rt">
                    <div className="nm-list-item">
                      <Checkbox checked={item.selectAll}
                                 onChange={(e) => {
                                   this.selectAllChecked(e.target.checked, index, 'envTemplate')
                                 }}>全选</Checkbox>
                    </div>
                    <Row>
                    {item.contentItems.map((contentItem, contentIndex) =>
                      <Col span={4} style={{marginTop:14}} key={contentIndex}>
                        <Checkbox checked={contentItem.checked}
                                  onChange={(e) => {
                                    this.contentItemChecked(e.target.checked, index, contentIndex, 'envTemplate')
                                   }}>{contentItem.name}</Checkbox>
                      </Col>
                    )}
                    <Col span={8} style={{marginTop:14}}>
                      <Checkbox checked={item.remind}
                                onChange={(e) => {
                                  this.remindChecked(e.target.checked, index, 'envTemplate')
                                }}>@提醒（在【发起提测】页面配置）</Checkbox>
                    </Col>
                    </Row>
                  </div>
                </Card>
              )}
               <div className="btn-group">
                 <Button type="primary" className="btn-group-item" onClick={() => {
                   this.saveData('envTemplate')
                 }}>保存</Button>
                 <Button onClick={() => {
                   this.setState({
                     envTemplate: JSON.parse(JSON.stringify(oldEnvTemplate.noticeTemplates)),
                     envToken:oldEnvTemplate.accessToken
                   })
                 }}>重置</Button>
               </div>
            </Card>
            }
            {taskTemplate && taskTemplate.length>0 &&
            <Card title="[流水线]--钉钉消息" style={{marginTop:24}}>
              <div className="token-container">
                <span>access_token：</span>
                <input value={taskToken} onChange={(e)=>{this.setState({taskToken:e.target.value})}}/>
              </div>
              {taskTemplate.map((item, index) =>
                <Card
                  type="inner"
                  title={"["+item.templateName+"]模板："}
                  key={index}
                  style={{marginBottom:24}}
                  extra={
                    <div>
                      <Checkbox
                        style={{marginRight:24}}
                        checked={item.startNotice}
                        onChange={(e) => {
                          this.startNoticeChange(e.target.checked, index, 'taskTemplate')
                        }}>
                        开启通知
                      </Checkbox>
                      <button style={{padding:"2px 16px",color: "#fff",backgroundColor:"#1890ff",border:"none",borderRadius:4,cursor:"pointer"}}
                              onClick={() => {this.previewData(item,'task')}}>预览</button>
                    </div>}>
                  <div className="nm-list-rt">
                    <div className="nm-list-item">
                      <Checkbox checked={item.selectAll}
                                onChange={(e) => {
                                  this.selectAllChecked(e.target.checked, index, 'taskTemplate')
                                }}>全选</Checkbox>
                    </div>
                    <Row>
                      {item.contentItems.map((contentItem, contentIndex) =>
                        <Col span={4} style={{marginTop:14}} key={contentIndex}>
                          <Checkbox checked={contentItem.checked}
                                    onChange={(e) => {
                                      this.contentItemChecked(e.target.checked, index, contentIndex, 'taskTemplate')
                                    }}>{contentItem.name}</Checkbox>
                        </Col>
                      )}
                      <Col span={8} style={{marginTop:14}}>
                        <Checkbox checked={item.remind}
                                  onChange={(e) => {
                                    this.remindChecked(e.target.checked, index, 'taskTemplate')
                                  }}>@提醒所有人</Checkbox>
                      </Col>
                    </Row>
                  </div>
                </Card>
              )}
              <div className="btn-group">
                <Button type="primary" className="btn-group-item" onClick={() => {
                  this.saveData('taskTemplate')
                }}>保存</Button>
                <Button onClick={() => {this.setState({
                  taskTemplate: JSON.parse(JSON.stringify(oldTaskTemplate)),
                  taskToken:oldTaskTemplate.accessToken})
                }}>重置</Button>
              </div>
            </Card>
            }
          </div>
          <Modal
            title={`预览-${reviewData.templateName}`}
            visible={modalVisible}
            onCancel={()=>{this.setState({modalVisible:false})}}
            className="nofootModal"
          >
            {reviewData.templateName && reviewData.contentItems.map((item, index) => {
              if (item.checked) {
                return <Row key={index} style={{padding:"0px 24px 0px 48px",marginBottom:18}}><Col span={6}>{item.name}：</Col><Col span={18}>{reviewValue[item.code]}</Col></Row>
              } else {
                return false
              }
              })
            }
            { reviewData.remind &&  <Row style={{padding:"0px 24px 0px 48px",marginBottom:18}}><Col span={6}/><Col span={18}>@所有人</Col></Row>
            }
          </Modal>
        </div>

    )
  }
}

export default connect(state => {
  return {
    projectId: state.project.projectId
  }
}, {})(NoticeManager);
