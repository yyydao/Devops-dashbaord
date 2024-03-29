import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import './index.scss'
import { reqPost, reqGet } from '@/api/api'
import { setStep, setSteps } from '@/store/actions/pipeline'

import { isJsonString, stepParamstoArray, stepParamstoObject } from '@/utils/utils'

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
const confirm = Modal.confirm

const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

const pipelineID = [
  {
    id: 0,
    name: '代码拉取',
    description: 'Gitlab 代码同步',
    params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '0' },
      { key: '1', json_jsonParams: 'code_branch' },
      { key: '2', json_jsonParams: 'code_gitServer' }]
  },
  {
    id: 1, name: '单元测试', description: '单元测试', params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '1' }
    ]
  },
  {
    id: 2,
    name: '静态扫描',
    description: 'SonarQube 代码静态扫描',
    params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '2' },
      { key: '1', json_jsonParams: 'sonnar_sonarProjectKey', json_jsonValue: 'TuandaiAS2d' },
      { key: '2', json_jsonParams: 'sonnar_code_analysis_moduleName', json_jsonValue: '' },
      { key: '3', json_jsonParams: 'sonnar_code_analysis_all', json_jsonValue: false }]
  },
  {
    id: 3,
    name: '编译打包',
    description: '项目编译打包',
    params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '3' },
      { key: '1', json_jsonParams: 'build_compileType', json_jsonValue: 'other' },
      { key: '2', json_jsonParams: 'build_environment', json_jsonValue: 'develop' },
      { key: '3', json_jsonParams: 'build_username', json_jsonValue: 'tuandaideveloper' },
      { key: '4', json_jsonParams: 'build_ijiami_server', json_jsonValue: 'http://10.100.12.24:10099/api' },
      { key: '5', json_jsonParams: 'build_ijiami_account', json_jsonValue: 'CI' },
      { key: '6', json_jsonParams: 'build_ijiamitinker_variant', json_jsonValue: 'normal-release' },
      { key: '7', json_jsonParams: 'build_tinker_type', json_jsonValue: 'base' }]
  },
  {
    id: 4, name: '安全扫描',
    description: 'MobSF 安全检测',
    params: [{ key: '0', json_jsonParams: 'stageId', json_jsonValue: '4' }
      , { key: '1', json_jsonParams: 'safe_server', json_jsonValue: 'http://10.100.12.52:8000/' },
      {
        key: '2',
        json_jsonParams: 'safe_token',
        json_jsonValue: '2dc06726e9562f1713b81f07d53e7b926825cddc2aa37ee529a1f2b8f09ec252'
      },
      {
        key: '3',
        json_jsonParams: 'safe_gitserver',
        json_jsonValue: 'http://git.tuandai888.com/MPD-DevOps/SecurityAnalysis.git'
      }]
  },
  {
    id: 5,
    name: 'UI测试',
    description: '自动化UI测试',
    params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '5' },
      {
        key: '1',
        json_jsonParams: 'autotest_uiTestGitServer',
        json_jsonValue: 'http://git.tuandai888.com/MPD-DevOps/UITestScript.git'
      },
      { key: '2', json_jsonParams: 'autotest_noreset', json_jsonValue: 'false' }, {
        key: '3',
        json_jsonParams: 'autotest_tags',
        json_jsonValue: '~'
      },
      { key: '4', json_jsonParams: 'autotest_appiumserver', json_jsonValue: '10.100.12.52:4723' },
      { key: '5', json_jsonParams: 'autotest_testusername', json_jsonValue: '13070901314' },
      { key: '6', json_jsonParams: 'autotest_testpwd', json_jsonValue: '123456a' }]
  },
  {
    id: 6,
    name: '性能测试',
    description: '自动化性能测试',
    params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '6' },
      {
        key: '1',
        json_jsonParams: 'performance_testGitServer',
        json_jsonValue: 'http://git.tuandai888.com/MPD-DevOps/PrismReport.git'
      }]
  },
  {
    id: 7,
    name: '加固',
    description: '爱加密加固',
    params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '7' },
      { key: '1', json_jsonParams: 'tinker_ijiami_plan_id', json_jsonValue: '51' },
      { key: '2', json_jsonParams: 'tinker_ijiami_sign_alias', json_jsonValue: '团贷网' },
      {
        key: '3',
        json_jsonParams: 'tinker_ijiami_so',
        json_jsonValue: `"\\"lib/armeabi-v7a/libjuntejni.so;lib/x86/libjuntejni.so\\""`
      }]
  },
  {
    id: 8, name: '补丁', description: '生成 Tinker 补丁包', params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '8' },
      { key: '1', json_jsonParams: 'patch_baseapkurl', json_jsonValue: '' }]
  },
  {
    id: 9, name: '包管理', description: 'DevOps平台安装包管理', params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '9' },
      { key: '1', json_jsonParams: 'deploy_ipAddress', json_jsonValue: '' }]
  },
  {
    id: -1, name: '自定义', description: '', params: [
      { key: '0', json_jsonParams: 'stageId', json_jsonValue: '-1' }]
  },
]

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
      importJSON: ''
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
      let oldSteps = [], stepsList = []
      if (!err) {
        if (this.props.location.state.existPipeline) {
          console.log('edit exist pipeline')
          // console.log(`this.props.location ${JSON.stringify(this.props.location.state.fullSteps)}`)
          oldSteps = this.props.location.state.fullSteps
          stepsList = this.props.location.state.stepsList
          let notFormattedSteps = this.state.paramsDatasource
          let obj = isJsonString(stepParamstoObject(notFormattedSteps)) ? JSON.parse(stepParamstoObject(notFormattedSteps)) : stepParamstoObject(notFormattedSteps)
          // console.log(obj)
          // let obj= transLocalStorage(stepParamstoObject(notFormattedSteps))
          reqPost('pipeline/addstep', {
            stepCategory: this.state.stepCategory,
            stepCode: this.state.stepCode,
            stepParams: obj,
            taskID: this.props.location.state.taskID,
            ...values
          }).then(res => {
            if (res.code === 0) {
              for (let i = 0; i < oldSteps.length; i++) {
                if (oldSteps[i][0] === this.state.stepCategory) {
                  oldSteps[i][1].push({
                    stepID: res.data.stepID,
                    stepCategory: this.state.stepCategory,
                    stepCode: this.state.stepCode,
                    stepParams: obj,
                    ...values
                  })
                }
              }
              stepsList.push({
                stepID: res.data.stepID,
                stepCategory: this.state.stepCategory,
                stepCode: this.state.stepCode,
                stepParams: JSON.stringify(obj),
                ...values
              })
              setSteps(oldSteps)
              localStorage.setItem('currentEditedPipeline', JSON.stringify({
                fullSteps: oldSteps,
                stepsList: stepsList
              }))
              this.props.history.replace({
                pathname: `/pipeline/edit/${this.props.location.state.taskID}`,
                search: this.props.location.search,
                state: {
                  fullSteps: oldSteps,
                  stepsList: stepsList,
                }
              })
            } else {
              message.error(res.msg)
            }
          })

        } else {
          let obj = stepParamstoObject(this.state.paramsDatasource)
          console.log(`add new pipeline`)
          setStep({
            stepCategory: this.state.stepCategory,
            stepCode: this.state.stepCode,
            stepParams: obj,
            ...values
          })
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
      paramSource: ``,
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

      let paramsArray = stepParamstoArray(jsonText)

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
          console.log(paramsArray)
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
    let stepCode, stepCategory, disabled = false, taskName = '', taskDescription = '', paramsDatasource = []
    if (this.props.location.state) {
      stepCode = this.props.location.state.stepCode
      stepCategory = this.props.location.state.stepCategory

    }
    if (stepCode !== -1) {
      disabled = true
    }
    this.importAutomation()
    for (let i = 0; i < pipelineID.length; i++) {
      const pipelineIDElement = pipelineID[i]
      if (pipelineIDElement.id === stepCode && stepCode !== -1) {
        taskName = pipelineIDElement.name
        taskDescription = pipelineIDElement.description
      }
    }

    this.props.form.setFieldsValue({
      stepName: taskName,
      stepDesc: taskDescription
    })
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
          <BreadcrumbItem>新增</BreadcrumbItem>
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
        <section className="pipeline-box pipeline-modify">
          <Card title="新增任务" style={{ margin: 24 }}>
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

taskAdd = connect((state) => {
  return {
    projectId: state.project.projectId
  }
}, { setStep, setSteps })(taskAdd)

const pipelineTask = Form.create()(taskAdd)

export default withRouter(pipelineTask)
