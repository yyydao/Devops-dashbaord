import React, {Component} from 'react'
import "./index.scss"
import {Select, Row, Col, Modal, Form, Checkbox, message, TimePicker} from 'antd';
import moment from 'moment';

const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class AddTest extends Component {
  constructor() {
    super();
    this.state = {
      addTestVisible: true, // 新增提测
      indeterminate: true,  // 场景多选标志位
      checkedList: [],       // 场景选中列表
      checkAll: false,      // 多选标志位
      plainOptions: [],     // 场景可选列表
      taskBranch: '',       // 任务分支
      fixedTime: ''  // 定时时间
    }
  }

  componentWillReceiveProps(props) {
    this._formatOptions(props.screenList);
  }

  // 格式化场景可选列表
  _formatOptions(screenList) {
    let options = [];
    if (screenList) {
      screenList.forEach((item, index) => {
        options.push({label: item.name, value: item.id})
      })
      this.setState({
        plainOptions: options,
      })
    }
  }

  // 场景选择
  onChange = (checkedList) => {
    let {plainOptions} = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  // 场景全选
  onCheckAllChange = (e) => {
    let {plainOptions} = this.state;
    let checkedList = [];
    plainOptions.forEach((item) => {
      checkedList.push(item.value)
    })
    this.setState({
      checkedList: e.target.checked ? checkedList : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  initScreenList() {

  }

  taskSubmit() {
    let {taskBranch, checkedList, fixedTime} = this.state;
    if (!taskBranch) {
      message.error('请选择分支');
    } else if (!checkedList.length) {
      message.error('请选择场景');
    }
    if (this.props.type === 2 && !fixedTime) {
      message.error('请输入定时时间');
    } else {
      this.props.handleSubmit(taskBranch, checkedList, fixedTime)
    }
  }


  // 时间改变
  timeChange(time, timeString) {
    this.setState({
      fixedTime: timeString
    })
  }

  render() {
    let {branchList, handleCancel, type} = this.props;
    return (
      <div>
        <Modal
          className="add-test-modal"
          title="新增提测性能测试"
          visible={this.props.show}
          onOk={this.taskSubmit.bind(this)}
          onCancel={handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              <Row>
                <Col span={4}>
                  <span>开发分支：</span>
                </Col>
                <Col span={16}>
                  <Select placeholder="请选择分支" onChange={(value) => {
                    this.setState({taskBranch: value})
                  }}>
                    {
                      branchList.map((item, index) => (
                        <Option key={index} value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                </Col>
              </Row>
            </FormItem>

            {
              type === 2
                ? <FormItem>
                  <Row>
                    <Col span={4}>
                      <span>定时时间：</span>
                    </Col>
                    <Col span={16}>
                      <TimePicker placeholder="定时时间" onChange={this.timeChange.bind(this)}
                                  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}/>
                    </Col>
                  </Row>
                </FormItem>
                : ''
            }

            <FormItem>
              <Row>
                <Col span={4}>
                  <span>执行场景：</span>
                </Col>
                <Col span={16} className="screen-select-container">

                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    全部
                  </Checkbox>
                  <CheckboxGroup
                    style={{display: 'block'}}
                    options={this.state.plainOptions}
                    value={this.state.checkedList}
                    onChange={this.onChange}/>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const WrappedAddTest = Form.create()(AddTest);

export default WrappedAddTest;
