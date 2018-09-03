import React, {Component} from 'react'
import "./index.scss"
import {Select, Row, Col, Modal, Input, Form} from 'antd';
import {packageRebuild} from '@/api/package/package'

const {TextArea} = Input;
const FormItem = Form.Item;

class RebuildTest extends Component {

  // 提交
  handleRebuildSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields(['changeLog'], async (err, values) => {
      if (!err) {
        let {envId, handleCancel} = this.props;
        let response = await packageRebuild({
          envId: parseInt(envId, 10),
          ...values
        })
        if (parseInt(response.data.code, 10) === 0) {
          this.props.form.resetFields();
          handleCancel();
        }

      }
    });
  }

  render() {
    let {rebuildData} = this.props;
    let {rebuildTestVisible, handleCancel} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="rebuildTest">
        <Modal
          title="回归提测"
          visible={rebuildTestVisible}
          onOk={this.handleRebuildSubmit.bind(this)}
          onCancel={handleCancel}
        >
          <Form onSubmit={this.handleRebuildSubmit}>
            <FormItem>
              <Row>
                <Col span={4}>
                  <Input placeholder="提测人 （必填）" value={rebuildData.taskMaster} disabled/>
                </Col>
                <Col span={8} offset={4}>
                  <Select value={rebuildData.codeBranch} style={{width: 160}} disabled>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <TextArea placeholder="通知人员（邮箱，不填按默认列表发送" value={rebuildData.tester} disabled rows={3}/>
            </FormItem>
            <FormItem>
              <TextArea placeholder="提测概要（多行" value={rebuildData.content} disabled rows={8}/>
            </FormItem>
            <FormItem>
              <Input placeholder="提测详情（Wiki URL）" value={rebuildData.details} disabled/>
            </FormItem>
            <FormItem>
              {getFieldDecorator('changeLog', {
                rules: [{required: true, message: '请输入回归内容'}],
              })(
                <TextArea placeholder="回归内容（多行）"/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const WrappedRebuildTest = Form.create()(RebuildTest);
export default WrappedRebuildTest;
