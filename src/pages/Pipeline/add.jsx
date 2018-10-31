import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'

import {
    Steps,
    Form,
    Input,
    Radio,
    AutoComplete,
    Breadcrumb,
    Switch,
    Card,
    Button,
    Icon,
    Collapse,
    Select,
    Modal, message
} from 'antd'

const AutoCompleteOption = AutoComplete.Option
const BreadcrumbItem = Breadcrumb.Item
const Step = Steps.Step
const Panel = Collapse.Panel
const Option = Select.Option
const FormItem = Form.Item
const RadioGroup = Radio.Group

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

const initialStep = [
    [1, []],
    [2, []],
    [3, []]
]

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

class Add extends Component {
    constructor (props) {
        super(props)

        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            branchList: [],
            formDataBranch: null
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
                reqPost('/pipeline/addtask', {projectID: this.props.projectId,...values}).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        message.success('项目新增成功！');
                        // this.setState({ proModalVisible: false });
                        // this.props.form.resetFields();
                        // this.getTableData();
                    }else{
                        message.error(res.msg);
                    }
                })
            }
        })

    }

    //获取分支列表
    getBranchList = (value='') => {
        reqPost('/branch/selectBranch', {
            projectId: this.props.projectId,
            branchName: value,
            pageSize: 100,
            pageNum: 1,
            type: 1,
            search: value ? 1 : ''
        }).then(res => {
            if (res.code === 0) {
                this.setState({
                    branchList: res.data
                })
                //
                // this.setState({
                //
                // });
            }
        })
    }

    //修改选中分支
    changeBranch = (formDataBranch) => {
        console.log(formDataBranch)
        this.setState({
            formDataBranch
        });
    }


    componentWillMount () {

    }

    componentDidMount () {
        this.getBranchList();
    }

    render () {
        const {getFieldDecorator} = this.props.form
        const {
            addVisible,
            addConfirmLoading,
            branchList,
            formDataBranch,
            projectID,
            taskCode,
            taskName,
            jenkinsJob,
            taskStatus,
            exexTime,
            lastExecTime,
            finalStep,
            currentJob
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

        const gridStyle = {
            width: '25%',
            textAlign: 'center',
        }

        return (
            <div id="pipeline-add">
                <Modal title="创建任务"
                       visible={addVisible}
                       onOk={this.addItem}
                       confirmLoading={addConfirmLoading}
                       onCancel={this.hideModal}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <Card>
                        {pipelineID.map((item, index) => {
                            return (
                                <Link key={index}
                                      to={{
                                          pathname: `/pipeline/task`,
                                          state: {
                                              taskID:item.id
                                          }
                                      }}>
                                    <Card.Grid style={gridStyle}>{item.name}</Card.Grid>
                                </Link>
                            )
                        })}

                    </Card>

                </Modal>

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
                            {getFieldDecorator('taskName', {
                                rules: [{ required: true, message: '请输入' }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="执行分支"
                        >
                            {getFieldDecorator('branchID', {
                                rules: [{ required: true, message: '请选择开发分支' }]
                            })(
                                <Select placeholder="请选择开发分支"
                                        showSearch
                                        onSearch={this.getBranchList}
                                        onChange={this.changeBranch}
                                        style={{ width: 300 }}>
                                    {
                                        this.state.branchList.map((item) => {
                                            return <Option value={item.id} key={item.id} title={item.name}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Jenkins Job"
                        >
                            {getFieldDecorator('jenkinsJob', {
                                rules: [{ required: true, message: '请输入' }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="钉钉消息："
                        >
                            {getFieldDecorator('ddStatus', {valuePropName: 'checked'})(
                                <Switch/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="选择流水线节点"
                        >
                            {getFieldDecorator('steps', {initialValue:[]})(
                                <Switch/>
                            )}
                        </FormItem>

                        <div className="pipeline-item-content">


                            <Steps size="small" labelPlacement="vertical" current={taskStatus}>
                                <Step title="开始"></Step>
                                {/*{enumStepsText.map((item,index) => <Step key={index} title={item.title}/>)}*/}
                                {initialStep.map((item, index) => {
                                    return <Step title={enumStepsText[item[0]].title} key={index} description={<div>
                                        {item[1].map((item, index) => {
                                            // console.log(item)
                                            return <Card
                                                style={{width: 180, marginLeft: '-40%'}}
                                                title={item.stepName}
                                                extra={<Icon type="setting" theme="outlined"/>}
                                                key={index}
                                            >
                                                <p>{item.stepDesc}</p>
                                            </Card>
                                        })}
                                        <Button icon="plus" type="default" onClick={() => {
                                            this.showModal(item[0])
                                        }}>添加任务</Button>
                                    </div>
                                    }>

                                    </Step>
                                })}
                                <Step title="完成" description={<div></div>}></Step>
                            </Steps>
                        </div>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">保存</Button>
                        </FormItem>
                    </Form>
                    <section className="pipeline-main">
                        <div className="pipeline-item">
                        </div>
                    </section>
                </section>
            </div>
        )
    }
}

Add = connect((state) => {
    return {
        projectId: state.projectId
    }
})(Add);

const pipelineAdd = Form.create()(Add)

export default pipelineAdd