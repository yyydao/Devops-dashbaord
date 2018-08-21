import React, {Component} from 'react'
import {Form, Modal, Alert, Input, Icon, Radio, Switch, Checkbox} from 'antd'
import {connect} from 'react-redux'
import {setPackageId} from '@/store/system/action'

import './index.scss'
import {envList, envAdd, envDelete, envUpdate} from "@/api/package/env";
import {branchList, branchAdd, branchDelete, branchUpdate} from "@/api/package/branch";

import Edit from '@/components/Edit'
import BranchList from '../BranchList'

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class EnvPart extends Component {
  constructor() {
    super();
    this.state = {
      envList: [],       // 环境列表
      branchList: [],   // 分支列表
      envActiveIndex: 0,          // 当前选中环境在数组的下标
      envId: 0,                   // 当前选中环境id
      addBranchVisible: false,  // 增加分支modal
      defaultBranchVisible: false,  // 默认分支选择modal
      defaultBranchId: null, // 选择默认分支的id
      addEnvVisible: false, // 新增环境
      branchDeleteVisible: false,  // 删除分支提示modal
      branchDeleteId: '',         // 删除分支的id
      branchDeleteIndex: '',     // 当前分支删除的下标
      envDeleteVisible: false,  // 环境删除modal显示
      switchValue: false,
      noTestTipVisible: false,
      startPerformanceTest: false  // 开启性能测试
    }
  }

  componentWillReceiveProps(props) {
    if (props.packageId !== this.state.packageId) {
      this.getEnvList(props.packageId)
    }
  }

  componentDidMount() {
    let id = this.props.packageId;
    if (id) {
      this.getEnvList(id)
    }
  }

  // 获取环境
  async getEnvList(id) {
    let envResponse = await envList({platformId: id});
    if (parseInt(envResponse.data.code) === 0) {
      let envData = envResponse.data.data;
      if (envData.length) {
        this._getBrachList(envData[0].id) // 默认获取第一个环境的分支
        this.setState({
          envList: envData,
          envId: envData[0].id
        })
      } else {
        this.setState({
          envList: [],
        })
      }
    }
  }

  // 获取分支
  _getBrachList(id) {
    branchList({envId: id}).then((response) => {
      if (parseInt(response.data.code) === 0) {
        this.setState({branchList: response.data.data});
      }
    })
  }

  // 新增分支提交
  handleAddBranchSubmit(e) {
    let {envId, branchList} = this.state;
    e.preventDefault();
    this.props.form.validateFields(['branchName'], async (err, values) => {
      if (!err) {
        let response = await branchAdd({...values, envId})
        let data = response.data;
        if (parseInt(data.code) === 0) {
          branchList.push(data.data)
          this.setState({
            branchList,
            addBranchVisible: false
          })
          this.props.form.resetFields();
        }
      }
    });
  }

  // 确认删除环境
  async envDeleteHandleOk() {
    let {envId} = this.state;
    if (envId) {
      let response = await envDelete({envId});
      let data = response.data;
      if (parseInt(data.code) === 0) {
        this.state.envList.splice(this.state.envActiveIndex, 1)
        this.setState({
          envDeleteVisible: false,
        })
      }
    }
  }

  // 选择默认分支
  defaultBranch() {
    let {envId, branchList, defaultBranchId} = this.state;
    branchUpdate({branchId: defaultBranchId, envId, isDefaultBranch: 1}).then((resposne) => {
      let data = resposne.data;
      if (parseInt(data.code) === 0) {
        branchList.forEach((item) => {
          if (item.id === defaultBranchId) {
            item.defaultBranch = 1;
          } else {
            item.defaultBranch = 0;
          }
        })
        this.setState({
          branchList,
          defaultBranchVisible: false
        })
      }
    })
  }

  // 确认删除分支
  async branchDeleteHandleOk() {
    let {branchDeleteId, branchList} = this.state;
    if (branchDeleteId) {
      let response = await branchDelete({branchId: branchDeleteId});
      let data = response.data;
      if (parseInt(data.code) === 0) {
        branchList.forEach((item, index) => {
          if (item.id === branchDeleteId) {
            branchList.splice(index, 1);
          }
        })
      }
      this.setState({
        branchList,
        branchDeleteVisible: false,
      })
    }
  }

  // 环境切换
  envChange(id, index) {
    this._getBrachList(id)
    this.setState({
      envId: id,
      envActiveIndex: index
    })
  }

  // 新增环境提交
  handleAddEnvSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields(['jenkinJobName', 'envName'], async (err, values) => {
      if (!err) {
        let response = await envAdd({...values, platformId: this.props.packageId,})
        let data = response.data;
        if (parseInt(data.code) === 0) {
          data.data.branchList = [];
          this.setState({
            addEnvVisible: false,
            envList: [...this.state.envList, data.data]
          })
          this.props.form.resetFields();
        }
      }
    });
  }

  // 环境重命名
  async handleEnvRenameSubmit({envName, jenckinJob}) {
    let {envList, envId} = this.state;
    let response = await envUpdate({
      envId,
      envName,
      jenkinJobName: jenckinJob
    });
    let data = response.data;
    if (parseInt(data.code) === 0) {
      envList = envList.map(item => {
        if (item.id === envId) {
          item.name = envName
          item.jenckinJob = jenckinJob
        }
        return item;
      })
      this.setState({
        envList
      })
    }
  }

  // 触发性能测试
  switchChange() {
    this.setState({
      // noTestTipVisible: true
      startPerformanceTest: true
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };
    let {envList, envActiveIndex, envId} = this.state;
    return (
      <div id="env-part">
        {/*性能测试环境部分*/}
        <div>
          <ul className="env-header">
            <div style={{display: 'inline-block'}}>
              <RadioGroup onChange={(e) => {
                let target = e.target;
                this.envChange(target.value, target['data-index'])
              }} value={envId}>
                {
                  envList.map((item, index) => (
                    <RadioButton data-index={index} key={index} value={item.id}>{item.name}</RadioButton>
                  ))
                }
              </RadioGroup>
              {/*新增环境*/}
              <Icon
                className="icon-add"
                type="plus-circle-o"
                onClick={() => {
                  this.setState({addEnvVisible: true})
                }}
              />
            </div>
          </ul>
        </div>

        <div className="detail-info-container">
          <div>
            <div>
              <Edit
                label="环境名称"
                value={envList[envActiveIndex] ? envList[envActiveIndex].name : ''}
                handleOk={(envName) => {
                  console.log('envList', envList)
                  this.handleEnvRenameSubmit({
                    envName,
                    jenckinJob: envList[envActiveIndex].jenckinJob
                  })
                }}
              />
              {/* 删除环境 */}
              {
                this.state.envList.length ?
                  <Icon
                    className="env-delete-icon"
                    type="delete"
                    onClick={() => {
                      this.setState({
                        envDeleteVisible: true
                      })
                    }
                    }
                  /> : ''
              }
            </div>
          </div>
          <div>
            <Edit
              label="Task名称"
              value={envList[envActiveIndex] ? envList[envActiveIndex].jenckinJob : ''}
              handleOk={(jenckinJob) => {
                console.log('jenckiniJob', jenckinJob)
                this.handleEnvRenameSubmit({
                  envName: envList[envActiveIndex].name,
                  jenckinJob
                })
              }}
            />
          </div>
          <div className="performance-emit" style={{height: 40}}>
            <span className="label">性能测试：</span>
            <Switch
              checked={this.state.switchValue} onChange={this.switchChange.bind(this)}/>
          </div>
          {/*  是否需要密码
          <div className="password-require" style={{height: 40}}>
            <span className="label">是否需要密码：</span>
            <Switch
              checked={this.state.switchValue} onChange={this.switchChange.bind(this)}/>
          </div>*/}
          <div>
            <span className="add-branch-txt">分支列表（选中为默认分支）</span>
            {
              envId
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
            <BranchList
              branchList={this.state.branchList}
              defaultBranch={(defaultBranch) => {
                this.setState({defaultBranchId: defaultBranch, defaultBranchVisible: true})
              }}
              handleDelete={
                (id, index) => {
                  this.setState({
                    branchDeleteVisible: true,
                    branchDeleteId: id,
                    branchDeleteIndex: index,

                  })
                }}/>
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
          onOk={this.branchDeleteHandleOk.bind(this)}
          onCancel={() => {
            this.setState({
              branchDeleteVisible: false
            })
          }}
        >
          <Alert message="确认删除该分支？" type="warning" showIcon/>
        </Modal>

        {/* 新增环境*/}
        <Modal
          title="新增环境"
          visible={this.state.addEnvVisible}
          onOk={this.handleAddEnvSubmit.bind(this)}
          onCancel={() => {
            this.setState({
              addEnvVisible: false
            })
          }}
        >
          <Form onSubmit={this.handleAddEnvSubmit}>
            <FormItem
              {...formItemLayout}
              label="jenkinsJob">
              {getFieldDecorator('jenkinJobName', {
                initialValue: this.state.envEditIndex,
                rules: [{required: true, message: '请输入jenckin对应的job名称'}],
              })(
                <Input placeholder="请输入jenckin对应的job名称"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="环境名称："
            >
              {getFieldDecorator('envName', {
                rules: [{required: true, message: '请输入环境名'}],
              })(
                <Input placeholder="请输入环境名"/>
              )}
            </FormItem>
          </Form>
        </Modal>

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
          <Form onSubmit={this.handleAddBranchSubmit}>
            <FormItem
              {...formItemLayout}
              label="分支名称：">
              {getFieldDecorator('branchName', {
                rules: [{required: true, message: '请输入分支名称'}],
              })(
                <Input placeholder="请输入分支名"/>
              )}
            </FormItem>
          </Form>
        </Modal>


        {/* 未创建测试项目提示*/}
        <Modal
          title="温馨提示"
          visible={this.state.noTestTipVisible}
          onOk={this.defaultBranch.bind(this)}
          onCancel={() => {
            this.setState({
              noTestTipVisible: false
            })
          }}
        >
          <Alert message="您还未创建测试项目，请先点击左侧【设置-性能测试配置】菜单前往创建？" type="Informational " showIcon/>
        </Modal>

        {/* 开启性能测试*/}
        <Modal
          title="开启性能测试"
          className="start-test-modal"
          visible={this.state.startPerformanceTest}
          onOk={this.defaultBranch.bind(this)}
          onCancel={() => {
            this.setState({
              startPerformanceTest: false
            })
          }}
        >
          <Form>
            <FormItem>
              <span>请选择关联的测试项目</span>
            </FormItem>
            <FormItem>
              <div className="start-test-options">
                <CheckboxGroup options={['团贷网-Android-性能测试', '团贷网-ios-性能测试', '取消关联']}
                               defaultValue={['团贷网-Android-性能测试']}
                               onChange={() => {
                               }}/>
              </div>
            </FormItem>
          </Form>
        </Modal>

        {/* 删除环境提示*/}
        <Modal
          title="确认删除环境"
          visible={this.state.envDeleteVisible}
          onOk={this.envDeleteHandleOk.bind(this)}
          onCancel={() => {
            this.setState({
              envDeleteVisible: false
            })
          }}
        >
          <Alert message="该配置环境可能已存在安装包，是否继续删除？" type="warning" showIcon/>
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
      </div>
    )
  }
}

const WrappedEnvPart = Form.create()(EnvPart);
export default connect(state => ({
  packageId: state.get('system').get('packageId')
}), {setPackageId})(WrappedEnvPart);