import React, {Component} from 'react';
import {Button, Form, message} from 'antd';
import BranchBuild from './BranchBuild'
import ScheduledTask from '@/components/ScheduledTask'
import AddTest from './AddTest'

import {deleteTimer, timerList} from "@/api/performance/timer";
import {branchList} from "@/api/performance/branch";
import {taskSubmit, taskCancel} from "@/api/performance/task";
import {testScreenList} from "@/api/performance/screen";
import {failureList, unfinishList, successList,} from '@/api/performance/task'
import qs from 'qs'
import "./index.scss"

class PerformanceTest extends Component {
  constructor() {
    super();
    this.state = {
      successList: [],  // 成功列表
      unfinishList: [], // 未完成列表
      failureList: [],  // 失败列表
      type: 1,  // 当前选中哪个构建列表 0代表分支构建 1代表定时构建  2代表提测构建
      scheduledTaskList: [], // 定时任务列表
      showTaskList: false, // 显示定时列表
      projectId: '',   // 当前项目Id
      addTestVisible: false,  // 显示新增构建modal
      branchList: [],  // 分支列表
      screenList: [],   // 场景列表
      getMoreInfo: {
        successPage: 1,  // 当前成功列表页面
        hasMoreSuccess: true,  // 是否有更多成功列表
        unfinishPage: 1,  // 当前未完成页面
        hasMoreUnfinish: true,  // 是否有更多未完成列表
        failurePage: 1,  // 当前失败页面
        hasMoreFailure: true  // 是否有更多失败列表
      }
    }
  }

  async componentWillMount() {
    let parsed = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
    let id = parsed.projectId;
    if (id !== undefined) {
      this.getPackageList(id);
      this.setState({
        projectId: id
      })
    } else {
      this.props.history.push('/performance');
    }
  }

  // 获取列表
  getPackageList(id, type = 1) {
    successList({projectId: id, type}).then((response) => {
      if (parseInt(response.data.code,10) === 0) {
        let data = response.data.data;
        let {getMoreInfo} = this.state;
        if (data.length) {
          getMoreInfo.successPage++;
          this.setState({
            successList: response.data.data,
            getMoreInfo
          })
        } else {
          getMoreInfo.hasMoreSuccess = false;
          this.setState({
            getMoreInfo,
            successList: []
          })
        }
      }
    })

    // 获取未完成列表
    unfinishList({projectId: id, type}).then((response) => {
      if (parseInt(response.data.code,10) === 0) {
        let data = response.data.data;
        let {getMoreInfo} = this.state;
        if (data.length) {
          getMoreInfo.unfinishPage++;
          this.setState({
            unfinishList: response.data.data,
            getMoreInfo
          })
        } else {
          getMoreInfo.hasMoreUnfinish = false;
          this.setState({
            getMoreInfo,
            unfinishList: []
          })
        }
      }
    })

    // 获取失败列表
    failureList({projectId: id, type}).then((response) => {
      if (parseInt(response.data.code,10) === 0) {
        let data = response.data.data;
        let {getMoreInfo} = this.state;
        if (data.length) {
          getMoreInfo.failurePage++;
          this.setState({
            failureList: response.data.data,
            getMoreInfo
          })
        } else {
          getMoreInfo.hasMoreFailure = false
          this.setState({
            getMoreInfo,
            failureList: []
          })
        }
      }
    })
  }

  // 定时任务删除
  async deleteScheduledTask(timerId, index) {
    let response = await deleteTimer({timerId, projectId: this.state.projectId});
    if (parseInt(response.data.code,10) === 0) {
      message.success('删除成功')
      let {scheduledTaskList} = this.state;
      scheduledTaskList.splice(index, 1);
      this.setState({
        scheduledTaskList
      })
    }
  }

  // 任务取消
  async _taskCancel(buildId, index) {
    let {unfinishList} = this.state;
    let response = await taskCancel({type: this.state.type, buildId})
    if (parseInt(response.data.code,10) === 0) {
      unfinishList.splice(index, 1);
      this.setState({
        unfinishList
      })
    }
  }

  // 获取分支列表
  async getBranchList() {
    let {projectId} = this.state;
    let response = await branchList({projectId})
    if (parseInt(response.data.code,10) === 0) {
      this.setState({
        branchList: response.data.data
      })
    }
  }

  // 获取场景列表
  async getScreenList(id) {
    let {projectId} = this.state;
    let response = await testScreenList({projectId});
    if (parseInt(response.data.code,10) === 0) {
      this.setState({
        screenList: response.data.data
      })
    }
  }

  // 构建列表切换
  handleTypeChange(e) {
    let type = e.target.getAttribute('data-build-type')
    this.getPackageList(this.state.projectId, type)
    this.setState({
      type: parseInt(type,10),
      getMoreInfo: {  // 重置getMoreInfo
        successPage: 1,  // 当前成功列表页面
        hasMoreSuccess: true,  // 是否有更多成功列表
        unfinishPage: 1,  // 当前未完成页面
        hasMoreUnfinish: true,  // 是否有更多未完成列表
        failurePage: 1,  // 当前失败页面
        hasMoreFailure: true  // 是否有更多失败列表
      }
    })
  }

  // 显示定时任务列表
  async showScheduledTask() {
    let {projectId} = this.state;
    let response = await timerList({projectId});
    if (parseInt(response.data.code,10) === 0) {
      this.setState({
        scheduledTaskList: response.data.data,
        showTaskList: true
      })
    }
  }

  // 新增构建
  _addTest() {
    this.getBranchList(); // 获取分支
    this.getScreenList(); // 获取场景
    this.setState({addTestVisible: true})
  }

  // 提交测试
  async _taskSubmit(branchId, testScene, fixedTime) {
    let {type, projectId} = this.state;
    let response = await taskSubmit({projectId, branchId, type, testScene: testScene.join(','), fixedTime});
    if (parseInt(response.data.code,10) === 0) {
      if (type === 1) {
        // 提交完成后 如果是分支构建  需要获取第一条数据插入数组前面
        let response = await unfinishList({projectId, type, page: 1, count: 1});
        if (parseInt(response.data.code,10) === 0) {
          let data = response.data.data;
          this.setState({
            unfinishList: [...data, ...this.state.unfinishList]
          })
        }
      }
      this.setState({
        addTestVisible: false
      })
      message.success('构建成功')
    }
  }

  // 获取更多列表
  _loadMorePackage(type) {
    if (type === 'unfinish') {
      this._loadMoreUnfinishPackage();
    } else if (type === 'success') {
      this._loadMoreSuccessPackage();
    } else {
      this._loadMoreFailurePackage();
    }
  }

  // 加载更多成功列表
  async _loadMoreSuccessPackage() {
    let {projectId, type, getMoreInfo} = this.state;
    // 获取成功列表
    let response = await successList({projectId, type, page: getMoreInfo.successPage});
    if (parseInt(response.data.code,10) === 0) {
      let data = response.data.data
      // 没有更多
      if (data.length === 0) {
        getMoreInfo.hasMoreSuccess = false;
        this.setState({
          getMoreInfo
        })
      } else {
        let {successList} = this.state;
        successList = [...successList, ...data]
        getMoreInfo.successPage++;
        this.setState({
          successList,
          getMoreInfo
        })
      }
    }
  }

  // 加载更多未完成列表
  async _loadMoreUnfinishPackage() {
    let {projectId, type, getMoreInfo} = this.state;
    // 获取成功列表
    let response = await unfinishList({projectId, type, page: getMoreInfo.unfinishPage});
    if (parseInt(response.data.code,10) === 0) {
      let data = response.data.data;
      if (response.data.data.length === 0) {
        getMoreInfo.hasMoreUnfinish = false;
        this.setState({
          getMoreInfo
        })
      } else {
        let {unfinishList} = this.state;
        unfinishList = [...unfinishList, ...data]
        getMoreInfo.unfinishPage++;
        this.setState({
          unfinishList,
          getMoreInfo
        })
      }
    }
  }

  // 加载更多失败列表
  async _loadMoreFailurePackage() {
    let {projectId, type, getMoreInfo} = this.state;
    let response = await failureList({projectId, type, page: getMoreInfo.failurePage});
    if (parseInt(response.data.code,10) === 0) {
      let data = response.data.data;
      if (response.data.data.length === 0) {
        getMoreInfo.hasMoreFailure = false;
        this.setState({
          getMoreInfo
        })
      } else {
        let {failureList} = this.state;
        failureList = [...failureList, ...data]
        getMoreInfo.failurePage++;
        this.setState({
          failureList,
          getMoreInfo
        })
      }
    }
  }


  render() {
    let {type, getMoreInfo} = this.state;
    return (
      <div id="performance-test">
        <div className="header-bar">
          <div className="bar-left">
            {type === 1 || type === 2
              ? <Button
                type="primary"
                onClick={this._addTest.bind(this)}
                style={{display: 'inline-block', marginRight: 10}}>新增性能测试
              </Button>
              : ''}
            {type === 2 ? <Button type="primary" onClick={this.showScheduledTask.bind(this)}>定时任务列表</Button> : ''}
          </div>
          <div className="tabs" onClick={this.handleTypeChange.bind(this)}>
            <span className={type === 1 ? 'tab-active' : ''} data-build-type={1}>分支构建</span>
            <span className={type === 2 ? 'tab-active' : ''} data-build-type={2}>定时构建</span>
            <span className={type === 3 ? 'tab-active' : ''} data-build-type={3}>提测构建</span>
          </div>
        </div>
        {/*包列表*/}
        <BranchBuild
          successList={this.state.successList}
          unfinishList={this.state.unfinishList}
          failureList={this.state.failureList}
          hasMoreSuccess={getMoreInfo.hasMoreSuccess}
          hasMoreFailure={getMoreInfo.hasMoreFailure}
          hasMoreUnfinish={getMoreInfo.hasMoreUnfinish}
          loadMore={(type) => {
            this._loadMorePackage(type)
          }}
          taskCancel={(buildId, index) => {
            this._taskCancel(buildId, index)
          }}
        />
        {/*新增构建*/}
        <AddTest
          type={type}
          branchList={this.state.branchList}
          screenList={this.state.screenList}
          show={this.state.addTestVisible}
          handleCancel={() => {
            this.setState({
              addTestVisible: false
            })
          }}
          handleSubmit={(taskBranch, taskScreen, fixedTime) => {
            this._taskSubmit(taskBranch, taskScreen, fixedTime);
          }}
        />
        {/*定时任务*/}
        <ScheduledTask
          taskList={this.state.scheduledTaskList}
          show={this.state.showTaskList}
          handleDelete={(id, index) => {
            this.deleteScheduledTask(id, index)
          }}
          handleCancel={() => {
            this.setState({showTaskList: false})
          }}
        />
      </div>
    )
  }
}

const WrappedPerformanceTest = Form.create()(PerformanceTest);
export default WrappedPerformanceTest