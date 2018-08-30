import React, {Component} from 'react'
import {Form, Modal, Alert, Input,message} from 'antd'

import ConfigHeader from '@/components/ConfigHeader'
import Edit from '@/components/Edit'

import {platformDelete, platformUpdate, platformList, platformAdd} from "@/api/package/platform";
import {connect} from 'react-redux'
import {setPackageId} from '@/store/system/action'
import './index.scss'

const FormItem = Form.Item;

class PlatformPart extends Component {
  constructor() {
    super();
    this.state = {
      platformList: [], // 平台列表
      envList: [],      //  环境列表
      platformActiveIndex: 0, // 当前选中的平台在数组中的下标 用于选中高亮
      id: '', // 当前平台选中的id
      addPlatformVisible: false, // 显示新增平台modal
      pfDeleteVisible: false      // 显示确认删除平台modal
    }
  }


  componentWillMount() {
    // 获取平台列表
    this.getPlatformList();
  }

  // 获取平台列表
  async getPlatformList() {
    let platformRes = await platformList();
    if (parseInt(platformRes.data.code,10) === 0) {
      let data = platformRes.data.data;
      if (data.length) {
        this.setState({
          platformList: data
        })
        // 如果当前有选中平台 找出该平台在数组中的下标位置
        if (this.props.packageId) {
          this.mapPerformanceIndex(parseInt(this.props.packageId,10));
        } else {
          this.props.setPackageId(data[0].id);  // 默认选中第一个平台 并保存当前id到redux中 用于触发环境和分支的拉取
          this.setState({
            platformActiveIndex: 0
          })
        }
      }
    }
  }

  // 根据id匹配出当前平台在数组的下标 用于选中高亮
  mapPerformanceIndex(id) {
    let index = 0;
    let {platformList} = this.state;
    for (let i = 0; i < platformList.length; i++) {
      if (platformList[i].id === id) {
        index = i;
        break;
      }
    }
    this.setState({
      platformActiveIndex: index
    })
  }


  // 平台切换
  platformChange(id, index) {
    this.setState({
      id,
      platformActiveIndex: index
    })
    this.props.setPackageId(id);
  }

  // 平台重命名
  async pfRenameSubmit(jenkinsAddr, platformName) {
    this._platformUpdata(platformName, jenkinsAddr);
  }


  // 平台Jenkins修改
  async pfJenkinsChangeSubmit(platformName, jenkinsAddr) {
    this._platformUpdata(platformName, jenkinsAddr);
  }

  async _platformUpdata(platformName, jenkinsAddr) {
    let {packageId} = this.props;
    let {platformList} = this.state;
    let response = await platformUpdate({platformId: packageId, platformName, jenkinsAddr})
    let data = response.data;
    if (parseInt(data.code,10) === 0) {
      // 平台列表更新数据
      platformList = platformList.map(item => {
        if (item.id === packageId) {
          item.name = platformName;
          item.jenkinsAddr = jenkinsAddr
        }
        return item;
      })
      this.setState({
        platformList
      })
    }
  }


  // 确认删除平台
  async pfDeleteHandleOk() {

    message.error('因权限未开启，暂停关闭删除平台功能，如需删除，请联系开发者');
    return;

    let {packageId} = this.props;
    let response = await platformDelete({platformId: packageId});
    let data = response.data;
    if (parseInt(data.code,10) === 0) {
      this.setState({
        pfDeleteVisible: false
      })
    }
    this.props.history.push('/package');
  }


  // 新增平台
  async handleAddPlatform(e) {
    e.preventDefault();
    this.props.form.validateFields(['platformName', 'jenkinsAddr'], async (err, values) => {
      if (!err) {
        let response = await platformAdd({...values});
        let data = response.data;
        if (parseInt(data.code,10) === 0) {
          this.setState({
            platformList: [...this.state.platformList, data.data],
            addPlatformVisible: false
          });
          this.props.form.resetFields();
        }
      }
    });
  }

  render() {
    let {platformList, platformActiveIndex} = this.state;
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="performance-platform-part">
        <ConfigHeader
          platformList={platformList}
          id={this.props.packageId || (platformList[0] && platformList[0].id)}
          platformChange={(id, index) => {
            this.platformChange(id, index);
          }}
          handleAdd={() => {
            this.setState({addPlatformVisible: true})
          }}
          handleDelete={() => {
            this.setState({pfDeleteVisible: true})
          }}
        />

        {/* 平台部分 */}
        <section className="platform-info">
          <Edit
            label="项目名称"
            value={platformList[platformActiveIndex] && platformList[platformActiveIndex].name}
            handleOk={this.pfRenameSubmit.bind(this, platformList[platformActiveIndex] && platformList[platformActiveIndex].jenkinsAddr)}
          />
          <Edit
            label="jenkins job地址"
            value={platformList[platformActiveIndex] && platformList[platformActiveIndex].jenkinsAddr}
            handleOk={this.pfJenkinsChangeSubmit.bind(this, platformList[platformActiveIndex] && platformList[platformActiveIndex].name)}
          />
        </section>

        {/*新增平台*/}
        <Modal
          title="新增平台"
          visible={this.state.addPlatformVisible}
          onOk={this.handleAddPlatform.bind(this)}
          onCancel={() => {
            this.setState({
              addPlatformVisible: false
            })
          }
          }
        >
          <Form>
            <FormItem>
              {getFieldDecorator('platformName', {
                rules: [{required: true, message: '请输入平台名'}],
              })(
                <Input placeholder="请输入平台名称"/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('jenkinsAddr', {
                rules: [{required: true, message: '请输入jenkinsJob地址'}],
              })(
                <Input placeholder="请输入jenkinsJob地址"/>
              )}
            </FormItem>
          </Form>
        </Modal>

        {/* 删除平台提示*/}
        <Modal
          title="确认删除平台"
          visible={this.state.pfDeleteVisible}
          onOk={this.pfDeleteHandleOk.bind(this)}
          onCancel={() => {
            this.setState({
              pfDeleteVisible: false
            })
          }}
        >
          <Alert message="该平台可能存在环境和分支，是否继续删除？" type="warning" showIcon/>
        </Modal>
      </div>
    )
  }
}

const WrappedPlatformPart = Form.create()(PlatformPart);
export default connect(state => ({
  packageId: state.get('system').get('packageId')
}), {setPackageId})(WrappedPlatformPart);