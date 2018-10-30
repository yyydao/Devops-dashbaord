import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'
import toPairs from 'lodash.topairs'
import uniq from 'lodash.uniq'

import {
    Steps,
    Form,
    Input,
    Checkbox,
    Radio,
    Tooltip,
    Cascader,
    AutoComplete,
    Breadcrumb,
    Switch,
    Card,
    Button,
    Icon,
    Collapse,
    Row,
    Col,
    Select,
    Modal, TimePicker, Table
} from 'antd'

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

const initialStep = [
    [1,[]],
    [2,[]],
    [3,[]]
]

const pipelineID= [
    {id: 0 ,name:"代码拉取"},
    {id: 1 ,name:"单元测试"},
    {id: 2 ,name:"静态扫描"},
    {id: 3 ,name:"编译打包"},
    {id: 4 ,name:"安全扫描"},
    {id: 5 ,name:"UI测试"},
    {id: 6 ,name:"性能测试"},
    {id: 7 ,name:"加固"},
    {id: 8 ,name:"补丁"},
    {id: 9 ,name:"包管理"},
    {id: -1 ,name:"自定义"},
]


class taskAdd extends Component {
    constructor (props) {
        super(props)
        this.columns = [
            {
                title: '字段',
                dataIndex: 'json_jsonParams',
                key: 'json_jsonParams'
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type'
            },
            {
                title: '值',
                dataIndex: 'paramSource',
                key: 'paramSource'
            },
            {
                title: '操作',
                dataIndex: 'isPackageDefault',
                key: 'isPackageDefault',
                render: (text, record) => {
                    return (
                        <Select value={text} onChange={(value) => this.handlePackageChange(value, record)}>
                            <Option value={0}>否</Option>
                            <Option value={1}>是</Option>
                        </Select>
                    )
                }
            }
        ];
        this.state = {
            data: [],
            confirmDirty: false,
            autoCompleteResult: [],
            finalStep: [],
            loading: false,
        }
    }

    //显示新建窗口
    showModal = () => {
        this.setState({
            addVisible: true
        });
    }
    hideModal = () => {
        this.setState({
            addVisible: false
        });
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

    handleTableChange = (pagination, filters, sorter) => {
        const params = { ...this.state.params };
        params.pageNum = pagination.current;
        this.setState({ params }, this.getBranchList);
    }

    addTask = (categoryID)=> {
        console.log(categoryID)
    }

    componentWillMount () {
    }

    componentDidMount () {
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult,
            data,
            loading,
            addVisible,
            addConfirmLoading,
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

        const gridStyle = {
            width: '25%',
            textAlign: 'center',
        };


        return (
            <div id="pipeline-add">

                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to="/pipeline">流水线</Link></BreadcrumbItem>
                    <BreadcrumbItem>新增</BreadcrumbItem>
                </Breadcrumb>
                <section className="pipeline-box">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="任务名称"
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
                            label="任务描述"
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your password!',
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(

                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="webhook"
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="运行参数"
                        >
                            <Table columns={this.columns} dataSource={data} loading={loading} rowKey={record => record.id} onChange={this.handleTableChange}></Table>
                        </FormItem>

                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">保存</Button>
                        </FormItem>
                    </Form>
                </section>
            </div>
        )
    }
}
const pipelineTask = Form.create()(taskAdd);


export default pipelineTask