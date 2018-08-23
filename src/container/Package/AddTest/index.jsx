import React, {Component} from 'react'
import "./index.scss"
import {Select, Row, Col, Modal, Input, Form} from 'antd';
import {addTest,} from '@/api/package/task'
import {connect} from 'react-redux'
import {unFinishList as reqUnFinishList} from '@/api/package/package';
import {setUnFinishList} from '@/store/system/action'
import {fromJS} from 'immutable'

const {TextArea} = Input;
const Option = Select.Option;
const FormItem = Form.Item;

class AddTest extends Component {

  constructor() {
    super();
    this.state = {
      branchList: [],         // 分支列表
      defaultBranch: '',     // 默认分支
      selectBranch: '',        // 选中的分支
      preventRepeatSubmit: false // 防止多次触发表单
    }
  }

  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    let {defaultBranch, selectBranch} = this.state;
    this.props.form.validateFields(['taskMaster', 'tester', 'content', 'details'], async (err, values) => {
      if (!err) {
        let {envId, handleCancel} = this.props;
        let {unFinishList, setUnFinishList} = this.props;
        if (!selectBranch && !defaultBranch) {
          return;
        }
        let response = await addTest({
          envId,
          ...values,
          codeBranch: selectBranch ? selectBranch : defaultBranch
        })
        if (parseInt(response.data.code) === 0) {
          handleCancel();
          /*
           *  提交成功后，刚提测的内容会进入未完成列表
           *  需要手动拉去未完成列表接口的第一条信息，添加到未完成列表数组中
          */
          let response = await reqUnFinishList({
            envId,
            page: 1,
            count: 1
          });
          let data = response.data;
          unFinishList = [...unFinishList, ...data.data]
          setUnFinishList(fromJS(unFinishList));
          this.setState({
            selectBranch: defaultBranch
          })
          this.props.form.resetFields();
        }
      }
    });
  }

  handleSelect(value) {
    this.setState({
      selectBranch: value
    })
  }

  componentWillReceiveProps(nextProps) {
    let {branchList} = this.props;
    let {defaultBranch} = this.state;
    branchList = branchList.toJS();
    branchList.forEach((item, index) => {
      if (item.defaultBranch === 1) {
        defaultBranch = item.name;
      }
    })
    this.setState({
      defaultBranch
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    let {branchList, addTestVisible, handleCancel} = this.props;
    branchList = branchList.toJS();
    let {defaultBranch, selectBranch} = this.state;
    return (
      <div id="addTest">
        <Modal
          className="addTestModal"
          title="新增提测"
          visible={addTestVisible}
          onOk={this.handleSubmit.bind(this)}
          onCancel={handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              <Row>
                <Col span={4}>
                  {getFieldDecorator('taskMaster', {
                    rules: [{required: true, message: '请输入提测人'}],
                  })(
                    <Input placeholder="提测人 （必填）"/>
                  )}
                </Col>
                <Col span={6} offset={2}>
                  <Select placeholder="请选择分支"
                          dropdownMatchSelectWidth={false}
                          style={{width: 160}} value={selectBranch ? selectBranch : defaultBranch}
                          onSelect={this.handleSelect.bind(this)}>
                    {
                      branchList.map((item, index) => (
                        <Option value={item.name} key={index}>{item.name}</Option>
                      ))
                    }
                  </Select>
                </Col>
              </Row>
            </FormItem>

            <FormItem>
              {getFieldDecorator('tester', {})(
                <TextArea placeholder='通知人员（邮箱地址，以","号分割' rows={3}/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('content', {
                rules: [{required: true, message: '请输入提测概要'}],
              })(
                <TextArea placeholder="提测概要（多行）" rows={8}/>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('details', {
                rules: [{required: true, message: '请输入详情'}],
              })(
                <Input placeholder="提测详情（石墨URL）"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const WrappedAddTest = Form.create()(AddTest);

export default connect(state => {
  return ({
    unFinishList: state.get('system').get('unFinishList').toJS()
  })
}, {setUnFinishList})(WrappedAddTest);
