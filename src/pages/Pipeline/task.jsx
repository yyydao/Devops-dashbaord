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

const AutoCompleteOption = AutoComplete.Option
const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
const Panel = Collapse.Panel
const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group

const pipelineID = [
    {id: 0, name: '代码拉取'},
    {id: 1, name: '单元测试'},
    {id: 2, name: '静态扫描'},
    {id: 3, name: '编译打包'},
    {id: 4, name: '安全扫描'},
    {id: 5, name: 'UI测试'},
    {id: 6, name: '性能测试'},
    {id: 7, name: '加固'},
    {id: 8, name: '补丁'},
    {id: 9, name: '包管理'},
    {id: -1, name: '自定义'},
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
        ]
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
        })
    }
    hideModal = () => {
        this.setState({
            addVisible: false
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
            }
        })
    }

    handleTableChange = (pagination, filters, sorter) => {
        const params = {...this.state.params}
        params.pageNum = pagination.current
        this.setState({params}, this.getBranchList)
    }

    componentWillMount () {

    }

    componentDidMount () {
        let taskID, disabled = false,taskName = ''
        if (this.props.location.state) {
            taskID = this.props.location.state.taskID

        }
        if (taskID !== -1) {
            disabled = true
        }


        for (let i = 0; i < pipelineID.length; i++) {
            const pipelineIDElement = pipelineID[i]
            if (pipelineIDElement.id === taskID && taskID !== -1) {
                taskName = pipelineIDElement.name
            }
        }
        this.props.form.setFieldsValue({
            name: taskName,
        })

        this.setState({disabled})
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {
            data,
            loading,
            taskID,
            disabled
        } = this.state

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        }
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
        }

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
                            {getFieldDecorator('name', {
                                rules: [{required: true, message: '请输入'}]
                            })(
                                <Input disabled={disabled}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="任务描述"
                        >
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入'}]
                            })(
                                <Input disabled={disabled}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="webhook"
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{required: true, message: '请输入'}]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="运行参数"
                        >
                            <Table columns={this.columns} dataSource={data} loading={loading}
                                   rowKey={record => record.id} onChange={this.handleTableChange}></Table>
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

taskAdd = connect((state) => {
    return {
        projectId: state.projectId
    }
})(taskAdd)

const pipelineTask = Form.create()(taskAdd)

export default pipelineTask