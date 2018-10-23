import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

class EditScene extends Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        const { title, visible, handleConfirm, handleCancel, jenkinsParam, name } = this.props;

        const fromItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        };

        return(
            <div>
                <Modal title={title} visible={visible} okText="确定" cancelText="取消" onOk={handleConfirm} onCancel={handleCancel}>
                    <Form>
                        <FormItem {...fromItemLayout} label="场景名称">
                            {
                                getFieldDecorator('name', {
                                    initialValue: name,
                                    rules: [{ required: true, message: '必填项' }]
                                })(
                                    <Input placeholder="如：签到" />
                                )
                            }
                        </FormItem>
                        <FormItem {...fromItemLayout} label="场景参数名">
                            {
                                getFieldDecorator('jenkinsParam', {
                                    initialValue: jenkinsParam,
                                    rules: [{ required: true, message: '必填项' }]
                                })(
                                    <Input placeholder="对应Jenkins Job参数" />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const EditSceneForm = Form.create()(EditScene);
export default EditSceneForm;