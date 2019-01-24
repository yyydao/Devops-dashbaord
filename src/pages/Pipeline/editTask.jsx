import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'
import { setStep, removeSteps, setSteps } from '@/store/actions/pipeline'
import { stepParamstoArray, stepParamstoObject, isJsonString } from '@/utils/utils'

import {
  Form,
  Input,
  Breadcrumb,
  Button,
  Table,
  Popconfirm,
  Modal, message, Card
} from 'antd'

const { TextArea } = Input
const BreadcrumbItem = Breadcrumb.Item
const FormItem = Form.Item
const EditableContext = React.createContext()
const confirm = Modal.confirm

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount () {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true)
    }
  }

  componentWillUnmount () {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true)
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus()
      }
    })
  }

  handleClickOutside = (e) => {
    const { editing } = this.state
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save()
    }
  }

  save = () => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error) {
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values })
    })
  }

  render () {
    const { editing } = this.state
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form
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
              )
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    )
  }
}

class taskEdit extends Component {
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
        title: '值',
        dataIndex: 'json_jsonValue',
        key: 'json_jsonValue',
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
                  <a>Delete</a>
                </Popconfirm>
              ) : null
          )
        },
      }
    ]
    this.state = {
      paramsDatasource: [],
      confirmDirty: false,
      autoCompleteResult: [],
      finalStep: [],
      loading: false,
      importJSON: '',
      step: {}
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
    let { setStep, setSteps } = this.props
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.location.state && this.props.location.state.existPipeline) {
          let notFormattedSteps = this.state.paramsDatasource
          let obj = isJsonString(stepParamstoObject(notFormattedSteps)) ? JSON.parse(stepParamstoObject(notFormattedSteps)) : stepParamstoObject(notFormattedSteps)
          // let obj= transLocalStorage(notFormattedSteps)
          reqPost('/pipeline/updatestep', {
            stepID: this.props.location.state.stepID,
            taskID: this.props.location.state.taskID,
            stepCategory: this.props.location.state.stepCategory,
            stepCode: this.props.location.state.stepCode,
            stepName: this.props.location.state.stepName,
            stepDesc: this.props.location.state.stepDesc,
            webHook: this.props.location.state.webHook,
            stepParams: obj,
            paramSource: 1
          }).then((res) => {
            if (res.code === 0) {
              setStep({
                stepCategory: this.state.stepCategory,
                stepCode: this.state.stepCode,
                stepParams: JSON.stringify(obj),
                ...values
              })
              message.info('修改成功')
              this.props.history.replace({
                pathname: `/pipeline/edit/${this.state.step.taskID}`,
                search: this.props.location.search,
              })
            } else {
              message.error(res.msg)
            }
          })

        } else {
          //判断是否是编辑已存在流水线
          if (this.props.match.params.stepID) {
            console.log('refresh page')
            let notFormattedSteps = this.state.paramsDatasource
            let obj = isJsonString(stepParamstoObject(notFormattedSteps)) ? JSON.parse(stepParamstoObject(notFormattedSteps)) : stepParamstoObject(notFormattedSteps)
            reqPost('/pipeline/updatestep', {
              stepID: this.props.match.params.stepID,
              taskID: this.state.step.taskID,
              stepCategory: this.state.step.stepCategory,
              stepCode: this.state.step.stepCode,
              stepName: this.state.step.stepName,
              stepDesc: this.state.step.stepDesc,
              webHook: this.state.step.webHook,
              stepParams: obj,
              paramSource: 1
            }).then((res) => {
              if (res.code === 0) {
                setStep({
                  stepCategory: this.state.stepCategory,
                  stepCode: this.state.stepCode,
                  stepParams: JSON.stringify(obj),
                  ...values
                })
                message.info('修改成功')
                this.props.history.replace({
                  pathname: `/pipeline/edit/${this.state.step.taskID}`,
                  search: this.props.location.search,
                })
              } else {
                message.error(res.msg)
              }
            })
          } else {

            let oldSteps = JSON.parse(localStorage.getItem('steps'))
            for (let i = 0; i < oldSteps.length; i++) {
              if (oldSteps[i][0] === this.state.stepCategory) {
                for (let j = 0; j < oldSteps[i][1].length; j++) {
                  if (oldSteps[i][1][j].stepCode === this.state.stepCode) {
                    let obj = stepParamstoObject(this.state.paramsDatasource)
                    oldSteps[i][1][j].stepParams = JSON.parse(JSON.stringify(obj))
                  }
                }
              }
            }
            setSteps(oldSteps)
            this.props.history.replace({
              pathname: '/pipeline/add',
              state: {
                taskName: this.props.location.state.taskName,
                branchID: this.props.location.state.branchID,
                branchName: this.props.location.state.branchName,
                jenkinsJob: this.props.location.state.jenkinsJob,
              }
            })
          }
        }
      }
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const params = { ...this.state.params }
    params.pageNum = pagination.current
    this.setState({ params }, this.getBranchList)
  }

  handleDelete = (key) => {
    const paramsDatasource = [...this.state.paramsDatasource]
    this.setState({ paramsDatasource: paramsDatasource.filter(item => item.key !== key) })
  }

  handleAdd = () => {
    const { count, paramsDatasource } = this.state
    const newData = {
      key: count,
      json_jsonParams: ``,
      type: 32,
      json_jsonValue: ``,
    }
    this.setState({
      paramsDatasource: [...paramsDatasource, newData],
      count: count + 1,
    })
  }

  handleSave = (row) => {
    const newData = [...this.state.paramsDatasource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    this.setState({ paramsDatasource: newData })
  }

  importByJSON = () => {
    let jsonText = this.state.importJSON
    if (isJsonString(jsonText)) {
      let paramsArray = stepParamstoArray(jsonText, this.state.stepCode)

      this.setState({ paramsDatasource: paramsArray })
      this.hideModal()
    } else {
      message.error('请输入正确JSON')
      return
    }
  }

  importAutomation = () => {
    if (this.props.location.state && this.props.location.state.jenkinsJob) {
      reqGet('pipeline/autoimport', {
        code: this.props.location.state.stepCode,
        job: this.props.location.state.jenkinsJob
      }).then(res => {
        if (res.code === 0) {
          let paramsArray = [{ key: 0, json_jsonParams: 'stageId', json_jsonValue: this.state.stepCode }]
          /*eslint-disable array-callback-return*/
          res.list && res.list.map((item, index) => {
            paramsArray.push({ key: index + 1, json_jsonParams: item })
          })
          this.setState({ paramsDatasource: paramsArray })
        } else {
          message.error(`${res.msg} 请手动导入`)
        }
      })
    } else {
      confirm({
        title: '提示信息',
        content: '您还未输入流水线关联的Job名称，或者未完善Jenkins配置，暂时无法进行【自动导入】操作。',
        onCancel () {}
      })
    }

  }

  paramsTableChange = (pagination, filters, sorter, extra: { currentDataSource: [] }) => {
    console.log(`${pagination}, ${filters}, ${sorter}, ${extra}`)
  }

  componentWillMount () {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true)
    }
  }

  componentDidMount () {
    let stepCode, stepCategory, disabled = false, stepName = '', stepDesc = '', paramsDatasource = []
    if (this.props.location.state) {
      stepCode = this.props.location.state.stepCode
      stepCategory = this.props.location.state.stepCategory

    }
    if (stepCode !== -1) {
      disabled = true
    }
    //判断是否是编辑已存在流水线
    if (this.props.match.params.stepID) {
      console.log('steps has stepID')
      reqGet(`/pipeline/stepdetail`, { stepID: this.props.match.params.stepID }).then(res => {
        if (res.code === 0) {
          let d = res.step.stepParams
          this.setState({ paramsDatasource: stepParamstoArray(d) })
          this.setState({ step: res.step })
          this.props.form.setFieldsValue({
            stepName: res.step.stepName,
            stepDesc: res.step.stepDesc
          })
        } else {
          message.error(res.msg)
        }
      })
    } else {
      let existStep = JSON.parse(localStorage.getItem('steps'))
      let stepListByCategory = existStep && existStep.find((item) => item[0] === stepCategory)
      if (stepListByCategory) {
        for (let i = 0; i < stepListByCategory[1].length; i++) {
          const stepFilterByCode = stepListByCategory[1][i]
          if (stepFilterByCode.stepCode === stepCode && stepCode !== -1) {
            stepName = stepFilterByCode.stepName
            stepDesc = stepFilterByCode.stepDesc
            paramsDatasource = stepParamstoArray(stepFilterByCode.stepParams)
          }
        }
      }

      this.props.form.setFieldsValue({
        stepName: stepName,
        stepDesc: stepDesc
      })
    }

    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true)
    }

    this.setState({ disabled, paramsDatasource, stepCategory, stepCode })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const {
      paramsDatasource,
      disabled,
      addVisible,
      addConfirmLoading,
      importJSON
    } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
          offset: 0,
        },
      },
    }
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col
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
      }
    })

    return (
      <div id="pipeline-add">

        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem><Link to="/pipeline">流水线</Link></BreadcrumbItem>
          <BreadcrumbItem>编辑</BreadcrumbItem>
        </Breadcrumb>
        <Modal title="JSON"
               visible={addVisible}
               onOk={this.importByJSON}
               confirmLoading={addConfirmLoading}
               onCancel={this.hideModal}
               maskClosable={false}
               destroyOnClose={true}
        >
                    <TextArea rows={4} value={importJSON} onChange={(e) => {
                      this.setState({ importJSON: e.target.value })
                    }}/>

        </Modal>
        <section className="pipeline-box">
          <Card title="编辑任务" style={{ margin: 24 }}>
            <Form onSubmit={this.handleSubmit} className={'pipeline-task-from'}>
              <FormItem
                style={{ width: 386 }}
                {...formItemLayout}
                label="任务名称"
              >
                {getFieldDecorator('stepName', {
                  rules: [{ required: true, message: '请输入' }]
                })(
                  <Input disabled={disabled}/>
                )}
              </FormItem>
              <FormItem
                style={{ width: 386 }}
                {...formItemLayout}
                label="任务描述"
              >
                {getFieldDecorator('stepDesc', {
                  rules: [{ required: true, message: '请输入' }]
                })(
                  <Input disabled={disabled}/>
                )}
              </FormItem>
              <FormItem
                style={{ width: 386 }}
                {...formItemLayout}
                label="webHook"
              >
                {getFieldDecorator('webHook', {
                  rules: [{ required: false, message: '请输入' }]
                })(
                  <Input/>
                )}
              </FormItem>
              <FormItem
                style={{ width: 386 }}
                {...formItemLayout}
                label="运行参数"
              >
                <div>
                  <Button size={'small'} onClick={this.showModal} type="primary" style={{ margin: '0 8px 16px 0' }}>
                    JSON导入
                  </Button>
                  <Button size={'small'} onClick={this.importAutomation} type="basic" style={{ marginBottom: 16 }}>
                    自动导入
                  </Button>

                </div>
              </FormItem>


              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                dataSource={paramsDatasource}
                columns={columns}
                pagination={false}
                onChange={this.paramsTableChange}
              />
              <div className={'table-add-row'} onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                <p>+ 添加</p>
              </div>
              <FormItem {...tailFormItemLayout} style={{ width: 386 }}>
                <Button type="primary" htmlType="submit">保存</Button>
              </FormItem>
            </Form>
          </Card>

        </section>
      </div>
    )
  }
}

taskEdit = connect((state) => {
  return {
    projectId: state.project.projectId
  }
}, { setStep, setSteps })(taskEdit)

const pipelineTaskEdit = Form.create()(taskEdit)

export default withRouter(pipelineTaskEdit)
