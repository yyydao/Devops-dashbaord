import React, {Component} from 'react'
import Edit from '@/components/Edit'
import {Form, Modal, Alert, Input} from 'antd'
import ConfigHeader from '@/components/ConfigHeader'
import {projectList, addProject, projectUpdate, deleteProject} from '@/api/performance/project';
import {setPerformanceId} from '@/store/system/action'
import {connect} from 'react-redux'
import './index.scss'

const FormItem = Form.Item;

class PlatformPart extends Component {
  constructor() {
    super();
    this.state = {
      platformList: [],
      platformActiveIndex: '',
      id: '',
      addPlatformVisible: false, // 显示新增平台modal
      pfDeleteVisible: false      // 显示确认删除平台modal
    }
  }

  componentWillReceiveProps(props) {
    if (props.id) {

    }
  }


  componentWillMount() {
    this.getPlatformList();
  }


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

  // 获取平台列表
  async getPlatformList() {
    let platformRes = await projectList();
    if (parseInt(platformRes.data.code, 10) === 0) {
      let data = platformRes.data.data;
      if (data.length) {
        this.setState({
          platformList: data
        })
        // 如果没有选中平台 默认选中第一个
        if (this.props.performanceId) {
          this.mapPerformanceIndex(parseInt(this.props.performanceId, 10));
        } else {
          this.props.setPerformanceId(data[0].id);
          this.setState({
            platformActiveIndex: 0
          })
        }
      }
    }
  }

  // 平台切换
  platformChange(id, index) {
    this.setState({
      id,
      platformActiveIndex: index
    })
    this.props.setPerformanceId(id);
  }

  // 平台重命名
  async pfRenameSubmit(jenkinsAddr, platformName) {
    this.handleProjectUpdata(platformName, jenkinsAddr);
  }


  // 平台Jenkins修改
  async pfJenkinsChangeSubmit(platformName, jenkinsAddr) {
    this.handleProjectUpdata(platformName, jenkinsAddr);
  }

  async handleProjectUpdata(platformName, jenkinsAddr) {
    let {performanceId} = this.props;
    let {platformList} = this.state;
    let response = await projectUpdate({id: performanceId, name: platformName, jenkinsAddr})
    console.log('response', response)
    let data = response.data;
    if (parseInt(data.code, 10) === 0) {
      // 平台列表更新数据
      platformList = platformList.map(item => {
        if (item.id === performanceId) {
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

  // 新增平台
  async _addProject(e) {
    e.preventDefault();
    this.props.form.validateFields(['projectName', 'projectJenkinsAddr'], async (err, values) => {
      if (!err) {
        let response = await addProject({name: values.projectName, jenkinsAddr: values.projectJenkinsAddr});
        let data = response.data;
        if (parseInt(data.code, 10) === 0) {
          this.setState({
            platformList: [...this.state.platformList, data.data],
            addPlatformVisible: false
          });
          this.props.form.resetFields();
        }
      }
    });
  }

  // 确认删除平台
  async pfDeleteHandleOk() {
    let response = await deleteProject({projectId: this.props.performanceId});
    let data = response.data;
    if (parseInt(data.code, 10) === 0) {
      this.setState({
        pfDeleteVisible: false
      })
      this.props.history.push('/performance');
    }
  }

  render() {
    let {platformList, platformActiveIndex} = this.state;
    let {performanceId} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="performance-platform-part">
        <ConfigHeader
          platformList={platformList}
          id={performanceId ? performanceId : (platformList[0] && platformList[0].id)}
          platformActiveIndex={platformActiveIndex}
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
          title="新增项目"
          visible={this.state.addPlatformVisible}
          onOk={this._addProject.bind(this)}
          onCancel={() => {
            this.setState({
              addPlatformVisible: false
            })
          }
          }
        >
          <Form>
            <FormItem
              label="项目名称："
              labelCol={{span: 5}}
              wrapperCol={{span: 16}}
            >
              {getFieldDecorator('projectName', {
                rules: [{required: true, message: '请输入项目名'}],
              })(
                <Input placeholder="如：团贷网-Android"/>
              )}
            </FormItem>
            <FormItem
              label="Jenkins地址："
              labelCol={{span: 5}}
              wrapperCol={{span: 16}}
            >
              {getFieldDecorator('projectJenkinsAddr', {
                rules: [{required: true, message: '请输入jenkinsJob地址'}],
              })(
                <Input placeholder="如：http://10.100.11.222:8082/"/>
              )}
            </FormItem>
            <FormItem
              wrapperCol={{span: 12, offset: 5}}
            >
            </FormItem>
          </Form>
        </Modal>

        {/* 删除平台提示*/}
        <Modal
          title="温馨提示"
          visible={this.state.pfDeleteVisible}
          onOk={this.pfDeleteHandleOk.bind(this)}
          onCancel={() => {
            this.setState({
              pfDeleteVisible: false
            })
          }}
        >
          <Alert message="该配置中可能存在安装包，是否继续删除？（请谨慎操作！）" type="warning" showIcon/>
        </Modal>
      </div>
    )
  }
}

const WrappedPlatformPart = Form.create()(PlatformPart);
export default connect(state => ({
  performanceId: state.get('system').get('performanceId')
}), {setPerformanceId})(WrappedPlatformPart);