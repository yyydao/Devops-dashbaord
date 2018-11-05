import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link,withRouter } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'
import { setStep,setSteps } from '@/store/action';

import {
    Steps,
    Form,
    Input,
    Radio,
    AutoComplete,
    Breadcrumb,
    Button,
    Collapse,
    Select,
    Table,
    Popconfirm,
    Modal, message
} from 'antd'

const AutoCompleteOption = AutoComplete.Option
const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
const Panel = Collapse.Panel
const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);


const pipelineID = [
    {id: 0, name: '代码拉取',description:'Gitlab 代码同步',params:[{ key: '1',json_jsonParams: 'code_branch'},{ key: '2',json_jsonParams:'code_gitServer'}]},
    {id: 1, name: '单元测试',description:'单元测试',params:[]},
    {id: 2, name: '静态扫描',description:'SonarQube 代码静态扫描'},
    {id: 3, name: '编译打包',description:'项目编译打包'},
    {id: 4, name: '安全扫描',description:'MobSF 安全检测'},
    {id: 5, name: 'UI测试',description:'自动化UI测试'},
    {id: 6, name: '性能测试',description:'自动化性能测试'},
    {id: 7, name: '加固',description:'爱加密加固'},
    {id: 8, name: '补丁',description:'生成 Tinker 补丁包'},
    {id: 9, name: '包管理',description:'DevOps平台安装包管理'},
    {id: -1, name: '自定义',description:''},
]

class EditableCell extends React.Component {
    state = {
        editing: false,
    }

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const { editing } = this.state;
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                    <div
                                        className="editable-cell-value-wrap"
                                        style={{ paddingRight: 24 }}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class taskAdd extends Component {
    constructor (props) {
        super(props)
        this.columns = [
            {
                title: '字段',
                dataIndex: 'json_jsonParams',
                key: 'json_jsonParams',
                editable: true,
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                editable: true,
            },
            {
                title: '值',
                dataIndex: 'paramSource',
                key: 'paramSource',
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'isPackageDefault',
                key: 'isPackageDefault',
                render: (text, record) => {
                    return (
                        this.state.paramsDatasource.length >= 1
                            ? (
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                    <a href="javascript:;">Delete</a>
                                </Popconfirm>
                            ) : null
                    );
                },
            }
        ]
        this.state = {
            paramsDatasource: [],
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
        let {setStep,setSteps} = this.props
        e.preventDefault()
        console.log(this.state.paramsDatasource)
        console.log(this.state.stepCategory)
        this.props.form.validateFieldsAndScroll((err, values) => {
            let oldSteps = [],stepsList = []
            if (!err) {
                if (this.props.location.state.editable) {
                    let oldSteps = JSON.parse(localStorage.getItem('steps'))
                    for (let i = 0; i < oldSteps.length; i++) {
                        if (oldSteps[i][0] === this.state.stepCategory) {
                            for (let j = 0; j < oldSteps[i][1].length; j++) {
                                if (oldSteps[i][1][j].stepCode === this.state.stepCode) {
                                    oldSteps[i][1][j].stepParams = this.state.paramsDatasource
                                }
                            }
                        }
                    }
                    setSteps(oldSteps)
                } else {
                    if (this.props.location.state.existPipeline) {
                        console.log(`this.props.location ${JSON.stringify(this.props.location.state.fullSteps)}`)
                        oldSteps = this.props.location.state.fullSteps
                        stepsList = this.props.location.state.stepsList
                        console.log(oldSteps)
                        console.log({...values})
                        console.log(this.state.stepCode)
                        console.log(this.state.paramsDatasource)
                        console.log(this.state.stepCategory)
                        for (let i = 0; i < oldSteps.length; i++) {
                            if (oldSteps[i][0] === this.state.stepCategory) {
                                oldSteps[i][1].push({
                                    stepCategory: this.state.stepCategory,
                                    stepCode: this.state.stepCode,
                                    stepParams: this.state.paramsDatasource,
                                    ...values
                                })
                            }
                        }
                        stepsList.push({
                            stepCategory: this.state.stepCategory,
                            stepCode: this.state.stepCode,
                            stepParams: this.state.paramsDatasource,
                            ...values
                        })
                        console.log(oldSteps)
                        setSteps(oldSteps)
                    }else{
                        setStep({
                            stepCategory: this.state.stepCategory,
                            stepCode: this.state.stepCode,
                            stepParams: this.state.paramsDatasource,
                            ...values
                        })
                    }

                }
                if(this.props.location.state.existPipeline){

                    this.props.history.push({
                        pathname:`/pipeline/edit/${this.props.location.state.taskID}`,
                        state: {
                            fullSteps: oldSteps,
                            stepsList: stepsList,
                        }
                    })
                }else{
                    this.props.history.push('/pipeline/add')
                }


            }
        })
    }

    handleTableChange = (pagination, filters, sorter) => {
        const params = {...this.state.params}
        params.pageNum = pagination.current
        this.setState({params}, this.getBranchList)
    }

    handleDelete = (key) => {
        const paramsDatasource = [...this.state.paramsDatasource];
        this.setState({ paramsDatasource: paramsDatasource.filter(item => item.key !== key) });
    }

    handleAdd = () => {
        const { count, paramsDatasource } = this.state;
        const newData = {
            key: count,
            json_jsonParams: ``,
            type: 32,
            paramSource: ``,
        };
        this.setState({
            paramsDatasource: [...paramsDatasource, newData],
            count: count + 1,
        });
    }

    handleSave = (row) => {
        const newData = [...this.state.paramsDatasource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ paramsDatasource: newData });
    }

    paramsTableChange =(pagination, filters, sorter, extra: { currentDataSource: [] }) => {
        console.log(`${pagination}, ${filters}, ${sorter}, ${extra}`)
    }


    componentWillMount () {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    componentDidMount () {
        let stepCode,stepCategory, disabled = false,taskName = '',taskDescription = '',paramsDatasource = []
        if (this.props.location.state) {
            stepCode = this.props.location.state.stepCode
            stepCategory = this.props.location.state.stepCategory

        }
        if (stepCode !== -1) {
            disabled = true
        }
        //判断是否是编辑
        if(this.props.location.state.editable){
            let stepsList = JSON.parse(localStorage.getItem('steps'))
            let stepListByCategory = stepsList.find((item) => item[0] === stepCategory)

            for (let i = 0; i < stepListByCategory[1].length; i++) {
                const stepListByCategoryElement = stepListByCategory[1][i]
                if(stepListByCategoryElement.stepCode === stepCode){
                    taskName = stepListByCategoryElement.stepName
                    taskDescription = stepListByCategoryElement.stepDesc
                    paramsDatasource = stepListByCategoryElement.stepParams
                }
            }

        }else{
            for (let i = 0; i < pipelineID.length; i++) {
                const pipelineIDElement = pipelineID[i]
                if (pipelineIDElement.id === stepCode && stepCode !== -1) {
                    taskName = pipelineIDElement.name
                    taskDescription = pipelineIDElement.description
                    paramsDatasource = pipelineIDElement.params
                }
            }
        }

        this.props.form.setFieldsValue({
            stepName: taskName,
            stepDesc:taskDescription
        })
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }

        this.setState({disabled,paramsDatasource,stepCategory,stepCode})
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {
            paramsDatasource,
            loading,
            stepCode,
            disabled,
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
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

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
                            {getFieldDecorator('stepName', {
                                rules: [{required: true, message: '请输入'}]
                            })(
                                <Input disabled={disabled}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="任务描述"
                        >
                            {getFieldDecorator('stepDesc', {
                                rules: [{required: true, message: '请输入'}]
                            })(
                                <Input disabled={disabled}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="webHook"
                        >
                            {getFieldDecorator('webHook', {
                                rules: [{required: false, message: '请输入'}]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="运行参数"
                        >
                            <div>

                                <Table
                                    components={components}
                                    rowClassName={() => 'editable-row'}
                                    bordered
                                    dataSource={paramsDatasource}
                                    columns={columns}
                                    onChange={this.paramsTableChange}
                                />
                                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                                    Add a row
                                </Button>
                            </div>
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
},{setStep,setSteps})(taskAdd)

const pipelineTask = Form.create()(taskAdd)

export default withRouter(pipelineTask)
