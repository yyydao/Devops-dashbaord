import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {reqPost, reqGet} from '@/api/api'
import {
  Breadcrumb,
  Card,
  Button,
  Icon,
  Table,
  Modal,
  Form,
  Input,
  message
} from 'antd'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const FormItem = Form.Item;
const confirm = Modal.confirm;

class Hotfixs extends Component {
  constructor() {
    super();
    this.state = {
      tableData: [],
      columns: [
        {
          title: 'App版本',
          dataIndex: 'version',
          key: 'version'
        },
        {
          title: '最新补丁版本',
          dataIndex: 'patchNum',
          key: 'patchNum'
        },
        {
          title: '操作',
          render: (text, record) => <div><a onClick={()=>{this.editHotFixs(record)}}>编辑</a><span
            style={{color: "#eee"}}> | </span><a onClick={()=>{this.deleteHotFixs(record.id)}}>删除</a></div>
        }
      ],
      modalVisible: false,
      newHotfix:{}
    }
  }

  componentWillMount() {
    this.getHotFixsList()
  }

  /**
   * @desc 获取热修复列表数据
   */
  getHotFixsList = () => {
    reqGet('/hotRepair/listHotRepair', {
      projectId: this.props.projectId
    }).then(res => {
      if (res.code === 0) {
        this.setState({tableData:res.data})
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 编辑热修复
   */
  editHotFixs = (record) => {
    this.setState({newHotfix:record,modalVisible:true})
    this.props.form.setFieldsValue({
      version:record.version,
      patchNum:record.patchNum
    })
  }

  /**
   * @desc 新增热修复
   */
  addHotFixs = () =>{
    this.setState({modalVisible: true,newHotfix:{}})
    this.props.form.setFieldsValue({
      version:'',
      patchNum:''
    })
  }

  /**
   * @desc 删除热修复
   */
  deleteHotFixs = (id) =>{
    confirm({
      title: '',
      content: '该配置中可能存在重要数据，是否继续删除？（请谨慎操作！）',
      onOk:()=> {
        reqGet(`/hotRepair/remove`,{id:id}).then(res => {
          if(res.code === 0){
            message.success("删除成功")
            this.getHotFixsList()
          }else{
            message.error(res.msg);
          }
        })
      }
    });
  }

  /**
   * @desc 保存热修复
   */
  saveHotRepair = () => {
    this.props.form.validateFields(['version','patchNum'],(err, values) => {
      if (!err) {
        let params = JSON.parse(JSON.stringify(this.state.newHotfix))
        params.projectId=this.props.projectId
        reqPost('/hotRepair/saveHotRepair',
          Object.assign({},params,values)
        ).then(res=>{
          if(res.code===0){
            message.success('保存成功');
            this.setState({modalVisible:false},()=>this.getHotFixsList())
          }else{
            message.error(res.msg);
          }
        })
      }
    });
  }

  /**
   * @desc 上传补丁跳转
   */
  uploadPatch = () =>{
    window.open('http://www.tinkerpatch.com', '_blank')
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {columns, tableData, modalVisible} = this.state
    const fromItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      }
    };
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>热修复</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <Card
            title="当前热修复配置"
            extra={
              <div>
                <Button
                  type="primary"
                  style={{marginRight: 8}}
                  onClick={()=>{this.uploadPatch()}}>
                    <Icon type="upload"/>上传补丁
                </Button>
                <Button
                  type="primary"
                  onClick={() => {this.addHotFixs()}}>
                  <Icon type="plus"/>新增补丁配置
                </Button>
              </div>
            }>
            <Table
              columns={columns}
              dataSource={tableData}
              rowKey={record => record.id}
              pagination={false}/>
          </Card>
        </div>
        <Modal
          title='新增补丁配置'
          visible={modalVisible}
          onOk={this.saveHotRepair}
          onCancel={() => {
            this.setState({modalVisible: false})
          }}
          okText="确认"
          cancelText="取消">
          <Form style={{width: 500}}>
            <FormItem {...fromItemLayout} label="app版本：">
              {
                getFieldDecorator('version', {
                  rules: [{
                    required: true, message: '请填写app版本'
                  }]
                })(
                  <Input/>
                )
              }
            </FormItem>
            <FormItem {...fromItemLayout} label="最新补丁版本：">
              {
                getFieldDecorator('patchNum', {
                  rules: [{
                    required: true, message: '请填写最新补丁版本'
                  }]
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}


const HotfixsForm = Form.create()(Hotfixs);
export default connect(state => {
  return {
    projectId: state.project.projectId
  }
}, {})(HotfixsForm);
