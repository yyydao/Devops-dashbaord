import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'
import toPairs from 'lodash.topairs'
import uniq from 'lodash.uniq'

import { Steps,Form,Input,Checkbox,Radio,Tooltip,Cascader, AutoComplete,Breadcrumb,Switch, Card, Button, Icon, Collapse, Row, Col, Select } from 'antd'

const AutoCompleteOption = AutoComplete.Option;
const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
const Panel = Collapse.Panel
const Option = Select.Option
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const enumStepsText = [{
    title: '开始',
    content: 'First-content',
}, {
    title: '构建阶段',
    content: 'Second-content',
}, {
    title: '测试阶段',
    content: 'Last-content',
}, {
    title: '部署阶段',
    content: 'Second-content',
}, {
    title: '完成',
    content: 'Last-content',
}]

const enumStatus = {
    1: 'wait',
    2: 'process',
    3: 'finish',
    4: 'error'
}
const enumStatusText = {
    1: '未开始',
    2: '执行中',
    3: '成功',
    4: '失败'
}

const enumButtonType = {
    1: 'wait',
    2: 'process',
    3: 'finish',
    4: 'error'
}

const enumButtonText = {
    1: '开始执行',
    2: '执行中',
    3: '开始执行',
    4: '开始执行'
}

const taskList = {
    'projectID': 63,
    'taskCode': 'td1539673436803',
    'taskName': '测试',
    'jenkinsJob': 'TuandaiAS2-develop-v4',
    'taskStatus': 1,
    'exexTime': 0,
    'lastExecTime': 0,
    'createTime': '2018-10-16 15:03:56.0',
    'updateTime': '2018-10-16 15:03:56.0'
}

const StepList = [
    {
        'stepID': '0923691354af43ed8afd27d832069f37L27SA3',
        'stepCategory': 1,
        'stepCode': 2,
        'stepName': '静态扫描',
        'stepDesc': '静态扫描',
        'webHook': 'www.baidu.com',
        'stepParams': '[{"json_jsonParams":21232,"type":1},{"build_compileType":"wasd","type":2}]',
        'paramSource': 2,
        'execTime': 0,
        'createTime': '2018-10-16 15:03:57.0',
        'updateTime': '2018-10-16 15:03:57.0',
        'remark': ''
    },
    {
        'stepID': '0923691354af43ed8afd27d832069f37L27SA3',
        'stepCategory': 1,
        'stepCode': 2,
        'stepName': '静态扫描',
        'stepDesc': '静态扫描',
        'webHook': 'www.baidu.com',
        'stepParams': '[{"json_jsonParams":21232,"type":1},{"build_compileType":"wasd","type":2}]',
        'paramSource': 2,
        'execTime': 0,
        'createTime': '2018-10-16 15:03:57.0',
        'updateTime': '2018-10-16 15:03:57.0',
        'remark': ''
    },
    {
        'stepID': '0923691354af43ed8afd27d832069f37L27SA3',
        'stepCategory': 2,
        'stepCode': 2,
        'stepName': '静态扫描',
        'stepDesc': '静态扫描',
        'webHook': 'www.baidu.com',
        'stepParams': '[{"json_jsonParams":21232,"type":1},{"build_compileType":"wasd","type":2}]',
        'paramSource': 2,
        'execTime': 0,
        'createTime': '2018-10-16 15:03:57.0',
        'updateTime': '2018-10-16 15:03:57.0',
        'remark': ''
    },
    {
        'stepID': '0923691354af43ed8afd27d832069f37L27SA3',
        'stepCategory': 3,
        'stepCode': 2,
        'stepName': '静态扫描',
        'stepDesc': '静态扫描',
        'webHook': 'www.baidu.com',
        'stepParams': '[{"json_jsonParams":21232,"type":1},{"build_compileType":"wasd","type":2}]',
        'paramSource': 2,
        'execTime': 0,
        'createTime': '2018-10-16 15:03:57.0',
        'updateTime': '2018-10-16 15:03:57.0',
        'remark': ''
    }
]

const residences = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];


class Add extends Component {
    constructor (props) {
        super(props)

        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    }


    componentWillMount () {
    }

    componentDidMount () {
        // this.setState({packageresult: packageresult})
        // this.checkTaskList(taskList)
        // this.checkStepList(StepList)
        // this.getPipelineDetail()
        //this.getPackageresult()
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult,
            projectID,
            taskCode,
            taskName,
            jenkinsJob,
            taskStatus,
            exexTime,
            lastExecTime,
            finalStep,
            currentJob} = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));

        return (
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/pipeline">流水线</Link></BreadcrumbItem>
                    <BreadcrumbItem>新增</BreadcrumbItem>
                </Breadcrumb>
                <section className="pipeline-box">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="流水线名称"
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'text', message: 'The input is not valid E-mail!',
                                }, {
                                    required: true, message: 'Please input your E-mail!',
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="执行分支"
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your password!',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Select placeholder="Please select a country">
                                    <Option value="china">China</Option>
                                    <Option value="use">U.S.A</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Jenkins Job"
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="钉钉消息："
                        >
                            {getFieldDecorator('switch', { valuePropName: 'checked' })(
                                <Switch />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="选择流水线节点"
                        >
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                            })(
                                <span className="ant-form-text"></span>
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">Register</Button>
                        </FormItem>
                    </Form>
                    <section className="pipeline-main">
                        <div className="pipeline-item">
                            <div className="pipeline-item-content">

                                <Steps size="small"
                                       status={enumStatus[taskStatus]}
                                       labelPlacement="vertical"
                                       current={taskStatus}>
                                    <Step title="开始"></Step>

                                    {/*{finalStep.map((item, index) => {*/}
                                        {/*return <Step title={enumStepsText[item[0]].title} key={index} description={*/}
                                            {/*item[1].map((item, index) => {*/}
                                                {/*// console.log(item)*/}
                                                {/*return <Card*/}
                                                    {/*style={{width: 180, marginLeft: '-40%'}}*/}
                                                    {/*title={item.stepName}*/}
                                                    {/*extra={<a href="#">编辑</a>}*/}
                                                    {/*key={index}*/}
                                                {/*>*/}
                                                    {/*<p>{item.stepDesc}</p>*/}
                                                {/*</Card>*/}
                                            {/*})*/}

                                        {/*}>*/}

                                        {/*</Step>*/}
                                    {/*})}*/}
                                    <Step title="完成" description={<div></div>}></Step>
                                </Steps>
                            </div>

                        </div>
                    </section>
                </section>
            </div>
        )
    }
}
const pipelineAdd = Form.create()(Add);


export default pipelineAdd