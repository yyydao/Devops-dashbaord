import React, {Component} from 'react'
import {Form, Modal, Alert, Input, Icon, Radio, Checkbox, Row, Col} from 'antd'
import {branchList, branchAdd, branchDelete, branchUpdate} from '@/api/performance/branch';
import {detailProject, projectUpdate} from '@/api/performance/project'
import {setPerformanceId} from '@/store/system/action'
import {connect} from 'react-redux'
import './index.scss'

import Edit from '@/components/Edit'
import BranchList from '../BranchList'

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ScreenPart extends Component {
  constructor() {
    super();
    this.state = {
      envList: [{name: '分支性能测试'}, {name: '定时性能测试'}, {name: '提测性能测试'}],          // 场景列表
      branchList: [], // 分支列表
      envActiveIndex: 0,  // 当前选中的环境
      tempPlatformId: '', // 保存旧的平台ID 当props改变用于判断，优化性能
      addBranchVisible: false,  // 显示新增分支modal
      branchDeleteVisible: false, // 显示分支删除modal
      branchDeleteId: '', // 分支删除ID
      branchDeleteIndex: '',  // 分支删除在branchList的下标 用于删除时splice
      defaultBranchVisible: false,    // 默认分支
      defaultBranchId: null     // 默认分支ID
    }
  }

  componentWillReceiveProps(props) {
    // 平台切换 获取该平台的分支和task信息
    if (props.performanceId !== this.state.tempPlatformId) {
      this._getBrachList(props.performanceId)
      this._getTaskName(props.performanceId)
      this.setState({
        tempPlatformId: props.performanceId
      })
    }
  }

  componentDidMount() {
    let id = this.props.performanceId;
    if (id) {
      this._getBrachList(id)
      this._getTaskName(id)
      this.setState({
        tempPlatformId: id
      })
    }
  }

  // 获取taskName
  async _getTaskName(id) {
    let response = await detailProject({projectId: id});
    if (parseInt(response.data.code, 10) === 0) {
      let data = response.data.data;
      let envList = this.state.envList;
      envList[0]['taskName'] = data.branchTaskName;
      envList[1]['taskName'] = data.timerTaskName;
      envList[2]['taskName'] = data.submitTaskName;
      this.setState({
        envList
      })
    }
  }

  // 获取分支
  _getBrachList(id) {
    branchList({projectId: id}).then((response) => {
      if (parseInt(response.data.code, 10) === 0) {
        this.setState({branchList: response.data.data});
      }
    })
  }

  // 新增分支提交
  handleAddBranchSubmit(e) {
    let {performanceId} = this.props;
    e.preventDefault();
    this.props.form.validateFields(['branchName', 'isDefaultBranch'], async (err, values) => {
      if (!err) {
        let response = await branchAdd({
          name: values.branchName,
          projectId: performanceId,
          isDefaultBranch: values.isDefaultBranch ? 1 : 0
        })
        let data = response.data;
        let {branchList} = this.state;
        if (parseInt(data.code, 10) === 0) {
          if (values.isDefaultBranch) {
            branchList = branchList.map((item) => {
              item.isDefaultBranch = 0;
              return item;
            })
          }
          this.setState({
            branchList: [...branchList, data.data],
            addBranchVisible: false
          })
          this.props.form.resetFields(['branchName']);
        }
      }
    });
  }

  // 选择默认分支
  defaultBranch() {
    let {defaultBranchId, branchList} = this.state;
    let {performanceId} = this.props;
    branchUpdate({id: defaultBranchId, projectId: performanceId, isDefaultBranch: 1}).then((resposne) => {
      let data = resposne.data;
      if (parseInt(data.code, 10) === 0) {
        // 设置默认分支成功后 把当前的分支标志位isDefaultBranch设置为1 其它分支设置为0
        branchList.forEach(item => {
          if (item.id === defaultBranchId) {
            item.isDefaultBranch = 1;
          } else {
            item.isDefaultBranch = 0;
          }
        })
        this.setState({
          branchList,
          defaultBranchVisible: false
        })
      }
    })
  }

  // 底部tab切换
  _projectDetailChange(index) {
    this.setState({
      envActiveIndex: index
    })
  }

  // 修改task名称
  async _taskNameChange(value) {
    let {envActiveIndex, envList} = this.state;
    let key = '';
    switch (envActiveIndex) {
      case 0:
        key = 'branchTaskName'
        break;
      case 1:
        key = 'timerTaskName'
        break;
      case 2:
        key = 'submitTaskName'
        break;
      default:
        key = 'branchTaskName'
        break;
    }
    let response = await projectUpdate({id: this.props.performanceId, [key]: value.taskName});
    if (parseInt(response.data.code, 10) === 0) {
      envList[envActiveIndex].taskName = value.taskName;
      this.setState({
        envList
      })
    }
  }

  // 删除分支
  async _deleteBranch() {
    let {branchDeleteIndex, branchDeleteId} = this.state;
    let response = await branchDelete({branchId: branchDeleteId});
    if (parseInt(response.data.code, 10) === 0) {
      let branchList = this.state.branchList
      branchList.splice(branchDeleteIndex, 1);
      this.setState({
        branchList,
        branchDeleteVisible: false
      })
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    let {envList, envActiveIndex, branchList, tempPlatformId} = this.state;
    return (
      <div id="branch-part">
        {/*性能测试环境部分*/}
        <div>
          <ul className="branch-header">
            <div style={{display: 'inline-block'}}>
              <RadioGroup onChange={(e) => {
                this._projectDetailChange(e.target['data-index']);
              }} defaultValue={0}>
                {
                  envList.map((item, index) => (
                    <RadioButton data-index={index} key={index} value={index}>{item.name}</RadioButton>
                  ))
                }
              </RadioGroup>
            </div>
          </ul>
        </div>

        <div className="detail-info-container">
          <div>
            <span>环境名称：</span>
            <span>{envList[envActiveIndex] ? envList[envActiveIndex].name || '-' : ''}</span>
          </div>
          <div>
            <Edit
              label="Task名称"
              value={envList[envActiveIndex] ? envList[envActiveIndex].taskName || '-' : ''}
              handleOk={(taskName) => {
                this._taskNameChange({
                  taskName
                })
              }}
            />
          </div>
          <div>
            <span className="add-branch-txt">分支列表（选中为默认分支）</span>
            {
              tempPlatformId
                ? <Icon
                  type="plus-circle-o"
                  className="icon-add"
                  onClick={() => {
                    this.setState({
                      addBranchVisible: true
                    })
                  }}
                />
                : null
            }
            {/*分支列表*/}
            {
              envActiveIndex !== 2
                ? <BranchList
                  branchList={branchList}
                  defaultBranch={(branchId) => {
                    this.setState({defaultBranchVisible: true, defaultBranchId: branchId})
                  }}
                  handleDelete={
                    (id, index) => {
                      this.setState({
                        branchDeleteVisible: true,
                        branchDeleteId: id,
                        branchDeleteIndex: index,
                      })
                    }}/>
                : null
            }

          </div>
        </div>

        {/* 新增分支*/}
        <Modal
          title="新增分支"
          visible={this.state.addBranchVisible}
          onOk={this.handleAddBranchSubmit.bind(this)}
          onCancel={() => {
            this.setState({
              addBranchVisible: false
            })
          }}
        >
          <Form>
            <FormItem
              label="分支名称："
              labelCol={{span: 5}}
              wrapperCol={{span: 16}}
            >
              {getFieldDecorator('branchName', {
                rules: [{required: true, message: '请输入分支名称'}],
              })(
                <Input placeholder="请输入分支名"/>
              )}
            </FormItem>

            <FormItem>
              <Row align="middle" type="flex">
                <Col offset={1}>
                  {getFieldDecorator('isDefaultBranch')(
                    <Checkbox>是否选择为默认分支</Checkbox>
                  )}
                </Col>
              </Row>
            </FormItem>

          </Form>
        </Modal>

        {/* 选择为默认分支提示*/}
        <Modal
          title="确认选择"
          visible={this.state.defaultBranchVisible}
          onOk={this.defaultBranch.bind(this)}
          onCancel={() => {
            this.setState({
              defaultBranchVisible: false
            })
          }}
        >
          <Alert message="确认将该分支选为默认分支？" type="Informational " showIcon/>
        </Modal>

        {/* 删除分支*/}
        <Modal
          title="确认删除分支"
          visible={this.state.branchDeleteVisible}
          onOk={this._deleteBranch.bind(this)}
          onCancel={() => {
            this.setState({
              branchDeleteVisible: false
            })
          }}
        >
          <Alert message="确认删除该分支？" type="warning" showIcon/>
        </Modal>

      </div>
    )
  }
}

const WrappedScreenPart = Form.create()(ScreenPart);
export default connect(state => ({
  performanceId: state.get('system').get('performanceId')
}), {setPerformanceId})(WrappedScreenPart);