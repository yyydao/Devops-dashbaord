import React, {Component} from 'react'
import "./index.scss"
import {Row, Col, Modal, Form, Checkbox, message} from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

class AddTest extends Component {
  constructor() {
    super();
    this.state = {
      addTestVisible: true,
      indeterminate: true,
      checkedList: [],
      checkAll: false,
      plainOptions: [],
      taskBranch: ''
    }
  }

  componentWillReceiveProps(props) {
    this.formatOptions(props.screenList);
  }

  formatOptions(screenList) {
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


  onChange = (checkedList) => {
    let {plainOptions} = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }

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
    let {checkedList} = this.state;
    if (!checkedList.length) {
      message.error('请选择场景');
    } else {
      this.props.startTest(checkedList)
    }
  }

  render() {
    let {handleCancel} = this.props;
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
                  <span>执行场景：</span>
                </Col>
                <Col span={16} style={{background: 'rgb(250,250,250)', paddingLeft: 10}}>

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
