import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reqPost, reqGet } from '@/api/api';
import './list.scss';
import VersionPanel from './versionPanel';

import { Breadcrumb, Icon, Button, Radio, Input, Collapse, Modal, Select, Pagination, Popconfirm, message } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;
const Panel = Collapse.Panel;
const { TextArea } = Input;
const Option = Select.Option;


class BuildTestPackage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      envId: null,
      envName: '',
      passwdBuild: 0,

      modalVisible: false,
      modalConfirmLoading: false,
      modalType: 1,
      branchList: [],
      formDataBranch: null,
      formDataName: JSON.parse(localStorage.getItem('userInfo')).name,
      fromDataMail: '',
      formDataDesc: '',
      formDataWiki: '',
      formDataReDesc: '',
      formDataUser: '',
      formDataPassword: '',
      timer: null,
      timerStart: null,

      typeValue: 1,
      typeList: [
        {
          name: '查看成功列表',
          value: 1
        },
        {
          name: '查看失败列表',
          value: 2
        }
      ],

      versionTotal: 0,
      versionPage: 1,
      versionList: [],

      buildingLoading: false,
      buildingTotal: 0,
      buildingPage: 1,
      buildingList: [],

      failureLoading: false,
      failureTotal: 0,
      failurePage: 0,
      failureList: []
    }
  }

  //切换显示提测窗口
  toggleBuildModal = (isShow=true, modalType=1) => {
    const newState = {
      modalVisible: isShow,
      modalType: modalType,
      modalConfirmLoading: false
    };

    if (isShow) {
      this.getBranchList();
    } else {
      // newState.formDataName = '';
      newState.fromDataMail = '';
      newState.formDataDesc = '';
      newState.formDataWiki = '';
      newState.formDataReDesc = '';
      newState.formDataUser = '';
      newState.formDataPassword = '';
    }

    this.setState(newState);
  }

  //Input && Textarea 数据绑定
  bindInput = (e, name) => {
    const newState = {};
    newState[name] = e.target.value;
    this.setState(newState)
  }

  //获取分支列表
  getBranchList = (value='') => {
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
        });
      }
    })
  }

  //修改选中分支
  changeBranch = (formDataBranch) => {
    this.setState({
      formDataBranch
    });
  }

  addBuild = () => {
    const { envId, passwdBuild, formDataName, formDataBranch, fromDataMail, formDataDesc, formDataWiki, formDataReDesc, formDataUser, formDataPassword, modalType } = this.state;
    const url = modalType === 1 ? '/package/addSubmit' : '/package/regression';

    if (!formDataName) {
      message.error('请填写“提测人”');
      return;
    } else if (!formDataBranch) {
      message.error('请选择“开发分支”');
      return;
    }
    if (!formDataDesc) {
      message.error('请填写“提测概要”');
      return;
    }
    if (passwdBuild === 1) {
      if (!formDataUser) {
        message.error('请填写“构建账号”');
        return;
      } else if (!formDataPassword) {
        message.error('请选择“构建密码”');
        return;
      }
    }


    this.setState({
      modalConfirmLoading: true
    });

    reqPost(url, {
      projectId: this.props.projectId,
      envId: envId,
      developer: formDataName,
      branchName: formDataBranch,
      content: formDataDesc,
      details: formDataWiki,
      noticeEmails: fromDataMail,
      userName: formDataUser,
      password: formDataPassword,
      regression: formDataReDesc
    }).then((res) => {
      this.toggleBuildModal(false);

      if (res.code == 0) {
        this.getBuildingList();
      } else {
        Modal.info({
          title: '提示',
          content: (
              <p>{res.msg}</p>
          ),
          onOk() {}
        });
      }
    })
  }


  changeType = (e) => {
    const newValue = e.target.value;

    clearTimeout(this.state.timer);

    this.setState({
      typeValue: newValue,
      versionTotal: 0,
      versionPage: 1,
      versionList: [],
      buildingLoading: false,
      buildingTotal: 0,
      buildingPage: 1,
      buildingList: [],
      failureTotal: 0,
      failurePage: 0,
      failureList: [],
      timer: null
    }, () => {
      if (newValue === 1) {
        this.getVersionList();
        this.getBuildingList();
      } else {
        this.getFailureList();
      }
    })
  }

  getFailureList = (loadMore=0) => {
    const { envId, failureTotal, failurePage, failureList } = this.state;

    if (loadMore !== 0 && failurePage > failureTotal) return;

    reqGet('/package/failure/record', {
      envId: envId,
      page: failurePage + 1,
      count: 3
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          failureTotal: res.total,
          failurePage: loadMore === 0 ? 1 : failurePage + 1,
          failureList: loadMore === 0 ? res.data : failureList.concat(res.data)
        })
      }
    })
  }

  getVersionList = (loadMore=0) => {
    const { envId, versionPage, versionList } = this.state;

    reqGet('/package/version/more', {
      envId: envId,
      page: versionPage
    }).then((res) => {
      if (res.code === 0) {
        const dataVersionList = res.data.map((item, index) => {
          return item.version
        });

        this.setState({
          versionTotal: res.total,
          versionPage: versionPage + 1,
          versionList: loadMore === 0 ? dataVersionList : versionList.concat(dataVersionList)
        });
      }
    })
  }

  getBuildingList = (loadMore=0) => {
    console.log(`======= ${loadMore}`)
    const { envId, buildingPage, buildingTotal, buildingList, timer, typeValue } = this.state;

    if (loadMore !== 0 && buildingPage > buildingTotal) return;

    if (timer) {
      clearTimeout(timer);
      this.setState({
        timer: null
      });
    }

    reqGet('/package/unfinish/list', {
      envId: envId,
      page: loadMore === 0 ? buildingPage : buildingPage+1,
      count: 20
    }).then((res) => {
      if (res.code === 0) {
        this.setState({
          buildingTotal: res.total,
          buildingPage: loadMore === 0 ? 1 : buildingPage + 1,
          buildingList: loadMore === 0 ? res.data : this.state.buildingList.concat(res.data),
          timer: res.data.length && typeValue === 1 && (new Date().getTime() - this.state.timerStart < 3600000) ? setTimeout(this.getBuildingList, 10e3) : null
        });
      }
    })
  }

  handleChange = () =>{}
  componentWillMount() {
    const oldProjectId = window.localStorage.getItem('oldProjectId');

    window.localStorage.setItem('oldProjectId', this.props.projectId);

    if (oldProjectId !== null && oldProjectId !== this.props.projectId) {
      this.props.history.push('/package');
    }
    this.setState({
      timerStart: new Date().getTime()
    })
  }

  componentWillUnmount() {
    clearTimeout(this.state.timer);

    this.setState = (state,callback)=>{
      return;
    }
  }

  render() {
    const { modalVisible, modalConfirmLoading, modalType, formDataName, formDataBranch, fromDataMail, formDataDesc, formDataWiki, formDataReDesc, formDataUser, formDataPassword, branchList, passwdBuild, } = this.state;

    return (
        <div className="package">
          <Modal title={modalType===1?"新增提测":"版本回归"}
                 visible={modalVisible}
                 onOk={this.addBuild}
                 confirmLoading={modalConfirmLoading}
                 onCancel={() => {
                   this.toggleBuildModal(false)
                 }}
                 maskClosable={false}
                 destroyOnClose={true}
          >
            <div className="package-modal-item">
              <Input placeholder="提测人" style={{ width: 100, marginRight: 20 }} value={formDataName} onChange={(e) => {
                this.bindInput(e, 'formDataName');
              }} />
              <Select placeholder="开发分支"
                      showSearch
                      value={formDataBranch||undefined}
                      onSearch={this.getBranchList}
                      onChange={this.changeBranch}
                      style={{ width: 300 }}>
                {
                  branchList.map((item) => {
                    return <Option value={item.name} key={item.id} title={item.name}>{item.name}</Option>
                  })
                }
              </Select>
            </div>

            <div className="package-modal-item">
                        <TextArea rows={4} placeholder="通知人员（邮箱地址，以','号分隔）" value={fromDataMail} onChange={(e) => {
                          this.bindInput(e, 'fromDataMail');
                        }}/>
            </div>

            <div className="package-modal-item">
                        <TextArea rows={6} placeholder="提测概要（多行，请按实际情况填写）" value={formDataDesc} onChange={(e) => {
                          this.bindInput(e, 'formDataDesc');
                        }}/>
            </div>

            <div className="package-modal-item">
              <Input placeholder="提测详情（Wiki文档）" value={formDataWiki} onChange={(e) => {
                this.bindInput(e, 'formDataWiki');
              }} />
            </div>

            {
              modalType === 2 && <div className="package-modal-item">
                                                <TextArea rows={4} placeholder="回归内容（多行）" value={formDataReDesc} onChange={(e) => {
                                                  this.bindInput(e, 'formDataReDesc');
                                                }}/>
              </div>
            }

            {
              passwdBuild === 1 &&
              <div>
                <div className="package-modal-item">
                  <Input placeholder="构建账号" value={formDataUser} onChange={(e) => {
                    this.bindInput(e, 'formDataUser');
                  }} />
                </div>

                <div className="package-modal-item">
                  <Input placeholder="构建密码" value={formDataPassword} onChange={(e) => {
                    this.bindInput(e, 'formDataPassword');
                  }} />
                </div>
              </div>
            }

          </Modal>
          <div className="package-menu">
            <Button type="primary" onClick={() => {
              this.toggleBuildModal(true, 1)
            }}>新增提测</Button>
          </div>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
          <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>Disabled</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
    )
  }
}

BuildTestPackage = connect((state) => {
  console.log(state)
  return {
    projectId: state.projectId
  }
})(BuildTestPackage)

export default BuildTestPackage;
