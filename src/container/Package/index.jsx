import React, {Component} from 'react';
import {Select, Button, Form} from 'antd';
import {platformList} from "@/api/package/platform";
import {branchList} from '@/api/package/branch'
import {getTestContent} from '@/api/package/task'
import {envList} from "@/api/package/env";

import {connect} from 'react-redux'
import {fromJS} from 'immutable'
import AddTestComponent from './AddTest'
import RebuildTestComponent from './RebuildTest'
import SuccessList from './SuccessList'
import FailureList from './FailureList'
import qs from 'qs'
import "./index.scss"

const Option = Select.Option;
const FormItem = Form.Item;

class Package extends Component {

  constructor() {
    super();
    this.state = {
      platformList: [],
      envList: [],
      packageList: [],
      failureList: [],
      rebuildData: {},   // 回归提测内容
      envId: '',
      buildPage: 1,          // 加载更多build页数
      failurePage: 1,        // 加载更多失败页数
      failureCount: 1,       // 加载更多失败数量
      loadMoreFailureText: '点击加载更多失败包',
      addTestVisible: false, // 新增提测显示
      rebuildTestVisible: false,  // 重建提测显示
      detailVisible: false,       // 详情显示
      branchList: fromJS([]),         // 分支列表
      showSuccessPackage: true,      // 显示成功列表或者失败列表
      platformName: '',       // 平台名
      tempPlatformName: '',   // 暂存平台名
      envName: '',     // 环境名
      tempEnvName: '', // 暂存环境名
      detailBuildId: ''        // 查看详情的buildId
    }
  }

  async componentWillMount() {

    let parsed = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});
    let envId = parsed.envId || '';
    envId && this.getBranch(envId)
    let platformName = decodeURI(parsed.platformName || '');
    let envName = decodeURI(parsed.envName || '');
    if (envId) {
      this.getPackageList(envId);
      this.setState({
        platformName,
        envName
      })
    }

    let response = await platformList();
    this.setState({
      platformList: response.data.data
    })
  }

  async getBranch(envId) {
    // 根据环境获取分支列表
    let branchRes = await branchList({envId});
    let data = branchRes.data;
    if (parseInt(data.code) === 0) {
      if (data.data.length) {
        this.setState({
          branchList: fromJS(data.data)
        })
      } else {
        this.setState({
          branchList: fromJS([])
        })
      }
    }
  }

  // 显示回归提测
  async showRebuildTest() {
    let envId = this.state.envId;
    let response = await getTestContent({
      envId
    });
    let data = response.data;
    if (parseInt(data.code) === 0) {
      this.setState({
        rebuildData: data.data,
        rebuildTestVisible: true
      })
    }
  }

  // 监听平台选择
  async platSelectChange(id, option) {
    // 重置环境选择框
    this.props.form.resetFields(['envId']);
    let platformName = option.props.children;
    let response = await envList({platformId: id});
    this.setState({
      envList: response.data.data,
      tempPlatformName: platformName
    })
  }

  // 监听环境选择
  async envSelectChange(id, option) {
    let envName = option.props.children;
    this.setState({
      tempEnvName: envName
    })
  }

  // 包搜索
  async searchPackage(e) {
    e.preventDefault();
    this.props.form.validateFields(['platformId', 'envId'], async (err, values) => {
      if (!err) {
        this.getPackageList(values.envId);
        // 根据环境获取分支列表
        this.getBranch(values.envId)
        this.setState({
          platformName: this.state.tempPlatformName,
          envName: this.state.tempEnvName
        })
      }
    });
  }

  // 获取包列表 通过改变envId 让子组件通过props改变去获取
  getPackageList(envId) {
    this.setState({envId, showSuccessPackage: true});
  }

  // 切换失败和成功包
  packageSwitch() {
    this.setState({
      showSuccessPackage: !this.state.showSuccessPackage
    })
  }

  render() {
    let {envId, platformName, envName, rebuildData, platformList, envList, branchList, addTestVisible, rebuildTestVisible, showSuccessPackage} = this.state;
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="package">
        <div className="select-container">
          <Form layout="inline" onSubmit={this.searchPackage}>
            <FormItem>
              {getFieldDecorator('platformId', {
                rules: [{required: true, message: '请选择平台'}],
              })(
                <Select placeholder="请选择平台" style={{width: 150, marginRight: '10px'}}
                        onSelect={this.platSelectChange.bind(this)}>
                  {
                    platformList.map((item, index) => (
                      <Option value={item.id} key={index}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('envId', {
                rules: [{required: true, message: '请选择环境'}],
              })(
                <Select placeholder="请选择环境" style={{width: 150, marginRight: '10px'}}
                        onSelect={this.envSelectChange.bind(this)}>
                  {
                    envList.map((item, index) => (
                      <Option value={item.id} key={index}>{item.name}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.searchPackage.bind(this)}>搜索</Button>
            </FormItem>
          </Form>
        </div>
        {
          envId ?
            <div className="main-container">
              <h4 className="title">{platformName}-{envName}</h4>
              <div className="button-select-container">
                <Button type="primary" onClick={() => {
                  this.setState({
                    addTestVisible: true
                  })
                }} style={{marginRight: '10px'}}>版本新增提测</Button>
                <Button type="primary" onClick={this.showRebuildTest.bind(this)}>版本回归提测</Button>
                <Button type={showSuccessPackage ? 'danger' : 'primary'}
                        onClick={this.packageSwitch.bind(this)}
                        style={{float: 'right'}}>{showSuccessPackage ? '查看失败列表' : '查看成功列表'}</Button>

              </div>
              {
                showSuccessPackage ?
                  <SuccessList
                    envId={envId}
                    platformName={platformName}
                    envName={envName}
                  /> :
                  <FailureList
                    envId={envId}
                    platformName={platformName}
                    envName={envName}
                  />
              }
            </div> : ''
        }
        {/*新增提测*/}
        <AddTestComponent
          handleCancel={() => {
            this.setState({
              addTestVisible: false
            })
          }}
          addTestVisible={addTestVisible}
          envId={envId}
          branchList={branchList}
        />

        {/*版本回归提测*/}
        <RebuildTestComponent
          envId={envId}
          rebuildData={rebuildData}
          rebuildTestVisible={rebuildTestVisible}
          handleCancel={() => {
            this.setState({
              rebuildTestVisible: false
            })
          }}
        />
      </div>
    )
  }
}

const WrappedPackage = Form.create()(Package);
export default connect(state => ({}), {})(WrappedPackage);