import React, {Component} from 'react'
import {Form, Modal, Input} from 'antd'
import {addScreen, testScreenList} from '@/api/performance/screen';
import {setPerformanceId} from '@/store/system/action'
import ScreenList from '../ScreenList'
import {connect} from 'react-redux'
import './index.scss'

const FormItem = Form.Item;

class ScreenPart extends Component {
  constructor() {
    super();
    this.state = {
      screenList: [],          // 场景列表
      addScreenVisible: false,  // 新增场景modal
      tempPlatformId: ''  // 保存旧的平台ID 当props改变用于判断，优化性能
    }
  }

  componentDidMount() {
    let id = this.props.performanceId;
    if (id) {
      this._getScreenList(id)
      this.setState({
        tempPlatformId: id
      })
    }
  }

  componentWillReceiveProps(props) {
    if (props.performanceId !== this.state.tempPlatformId) {
      this._getScreenList(props.performanceId)
      this.setState({
        tempPlatformId: props.performanceId
      })
    }
  }

  // 获取场景列表
  _getScreenList(id) {
    testScreenList({projectId: id}).then((response) => {
      if (parseInt(response.data.code) === 0) {
        this.setState({screenList: response.data.data});
      }
    })
  }

  // 新增场景
  async _addScreen(e) {
    e.preventDefault();
    this.props.form.validateFields(['screenName', 'jenkinsParam'], async (err, values) => {
      if (!err) {
        let response = await addScreen({
          projectId: this.props.performanceId,
          name: values.screenName,
          jenkinsParam: values.jenkinsParam
        });
        let data = response.data;
        if (parseInt(data.code) === 0) {
          this.setState({
            screenList: [...this.state.screenList, data.data],
            addScreenVisible: false
          });
          this.props.form.resetFields();
        }
      }
    });
  }

  // 确认场景删除
  _handleDeleteOk(index) {
    let {screenList} = this.state;
    screenList.splice(index, 1);
    this.setState({
      screenList
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="screen-part">
        {/*场景列表*/}
        <ScreenList
          platformId={this.state.tempPlatformId}
          screenList={this.state.screenList}
          handleAddScreen={() => {
            this.setState({
              addScreenVisible: true
            })
          }}
          handleDeleteOk={(index) => {
            this._handleDeleteOk(index)
          }}
        />
        {/*新增场景*/}
        <Modal
          title="新增场景"
          visible={this.state.addScreenVisible}
          onOk={this._addScreen.bind(this)}
          onCancel={() => {
            this.setState({
              addScreenVisible: false
            })
          }}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label="场景名称："
              labelCol={{span: 5}}
              wrapperCol={{span: 16}}
            >
              {getFieldDecorator('screenName', {
                rules: [{required: true, message: '请输入场景名称'}],
              })(
                <Input placeholder="如：签到"/>
              )}
            </FormItem>
            <FormItem
              label="场景参数名："
              labelCol={{span: 5}}
              wrapperCol={{span: 16}}
            >
              {getFieldDecorator('jenkinsParam', {
                rules: [{required: true, message: '请输入场景参数名'}],
              })(
                <Input placeholder="对应jenkins job 参数"/>
              )}
            </FormItem>
            <FormItem
              wrapperCol={{span: 12, offset: 5}}
            >
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const WrappedScreenPart = Form.create()(ScreenPart);
export default connect(state => ({
  performanceId: state.get('system').get('performanceId')
}), {setPerformanceId})(WrappedScreenPart);