import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {reqPost, reqGet} from '@/api/api'
import {
  Button,
  Breadcrumb,
  Row,
  Col,
  Card,
  Table,
  message,
  Icon,
  Modal,
  Checkbox,
  Input,
  Form,
  Divider,
  Select
} from 'antd'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class GrayscaleRelease extends Component {
  constructor() {
    super();
    this.state = {
      projectId: '',
      platform: '',
      projectName: '',
      columns: [
        {
          title: '版本',
          dataIndex: 'appVersion',
          key: 'appVersion',
        },
        {
          title: 'Build',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '大小',
          dataIndex: 'fileSize',
          key: 'fileSize'
        },
        {
          title: '下载次数',
          dataIndex: 'downloadCount',
          key: 'downloadCount'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime'
        },
        {
          title: '操作',
          render: (text, record) => <div><Link
            to={{pathname: '/addGrayscale', query: {packageID: record.packageID, versionID: record.id}}}>编辑</Link><span
            style={{color: "#eee"}}> | </span><a href={`${record.filePath}`}>下载</a></div>
        }
      ],
      listData: [],
      pagination: {
        pageSize: 7,
        total: 0,
        showTotal: null
      },
      loading: false,
      params: {
        limit: 7,
        page: 1,
        bundleID: 'com.tuandai.client'
      },
      downloadPath: '',

      //灰度发布-android
      modalVisible: false,
      areaList: [],
      checkAllArea: false,
      androidData: {},//分发数
      grayRules: ['规则0：关闭下发', '规则1：按区域下发', '规则2：按流量下发', '规则3：按设备下发', '规则4：按区域&流量下发'],
      rules: {},
      newRules: {}
    }
  }

  componentWillMount() {
    this.getPlatForm()
  }

  /**
   * @desc 获取项目详情为了获取platform，区分是ios,还是Android
   * @params {int} [page] 页数，默认为1
   */
  getPlatForm = () => {
    reqPost('/project/projectInfo', {
      projectId: this.props.projectId
    }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.setState({
          platform: res.data.platform,
          projectName: res.data.description
        }, () => {
          if (res.data.platform === 1) {
            this.getDistributeNum()
            this.getAndroidGrayScaleRules()
            this.getAreaInfo()
          }
          if (res.data.platform === 2) {
            this.getTableData()
          }
        })
      }
    })
  }

  /**
   * @desc 表格页数改变事件
   */
  handleTableChange = (pagination) => {
    const params = {...this.state.params};
    params.page = pagination.current;
    this.setState({params: params}, this.getTableData);
  }

  /**
   * @desc 获取ios表格数据
   */
  getTableData = () => {
    this.setState({loading: true});
    reqGet('/deploy/versionlist', this.state.params).then(res => {
      if (res.code === 0) {
        const pagination = {...this.state.pagination};
        const params = {...this.state.params};
        params.bundleID = res.package.bundleID;
        pagination.total = res.data.totalCount;
        pagination.showTotal = () => {
          return '共 ' + res.data.totalCount + ' 条';
        };

        this.setState({
          loading: false,
          listData: res.data.list,
          projectName: res.package.appName,
          downloadPath: res.package.downloadPath,
          pagination,
          params
        });
      } else {
        this.setState({loading: false});
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 获取android灰度发布主页数据
   */
  getAndroidGrayScaleRules = () => {
    reqGet('/distribute/queryRule', {projectId: this.props.projectId}).then(res => {
      if (res.code === 0) {
        if (res.data) {
          res.data.areas = res.data.areas.split(',')
          console.log(res.data.areas)
          this.setState({rules: res.data, newRules: res.data})
        }
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 灰度部署 / Android灰度分发-获取分发数
   */
  getDistributeNum = () => {
    reqGet('/distribute/getDistributeNum', {projectId: this.props.projectId}).then(res => {
      if (res.code === 0) {
        this.setState({androidData: res.data})
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 获取地区信息
   */
  getAreaInfo = () => {
    reqGet('/distribute/queryArea', {projectId: this.props.projectId}).then(res => {
      if (res.code === 0) {
        this.setState({areaList: res.data})
      } else {
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 判断地区是否全选
   */
  isCheckedAllArea = () => {
    let areaList = this.state.areaList
    let areas = this.state.newRules.areas
    this.setState({checkAllArea: areas.length === areaList.length})
  }

  /**
   * @desc
   */
  addRules = () => {
    let {rules} = this.state
    this.setState({
      newRules: JSON.parse(JSON.stringify(rules))
    }, () => {
      let fieldsValues = this.getReturnFieldsValues()
      this.props.form.setFieldsValue(fieldsValues)
      this.setState({modalVisible: true})
    })
  }

  /**
   * @desc 验证区域
   */
  areasValidate = (rule, value, callback) => {
    let areas = this.state.newRules.areas
    if (areas.length > 0) {
      callback();
      return;
    }
    callback("请选择灰度下发区域");
  }
  /**
   * @desc 获取表单默认数据
   */
  getReturnFieldsValues = () => {
    let newRules = this.state.newRules
    let fieldsValue = {}
    switch (newRules.type) {
      case 1:
        fieldsValue.areas = []
        break
      case 2:
        fieldsValue.flows = newRules.flows || ''
        break
      case 3:
        fieldsValue.devices = newRules.devices || ''
        break
      case 4:
        fieldsValue.flows = newRules.flows || ''
        fieldsValue.areas = []
        break
      default:
        break
    }
    if (newRules.type !== 0) {
      fieldsValue.version = newRules.version
      fieldsValue.versionName = newRules.versionName
      fieldsValue.name = newRules.name
      fieldsValue.url = newRules.url
      fieldsValue.desc = newRules.desc
    }
    return fieldsValue
  }
  /**
   * @desc 保存Android灰度发布
   */
  saveAndroidGrayScaleRules = () => {
    let fields = this.getReturnFieldsValues()
    this.props.form.validateFields(Object.keys(fields), (err, values) => {
      if (!err) {
        //合并要提交的数据
        let newRules = JSON.parse(JSON.stringify(this.state.newRules))
        if (values.areas) {
          values.areas = newRules.areas.join(',')
        }
        values.projectId = newRules.projectId
        values.type = newRules.type

        //不提交的数据都置为''
        let uploadKeys=Object.keys(values)
        for(let key in newRules){
          if(uploadKeys.indexOf(key)<0&&key!=='areaName'){
            newRules[key]=''
          }
        }
        reqPost('/distribute/saveRule', Object.assign({},newRules,values)).then(res => {
          if (res.code === 0) {
            message.success("保存成功")
            this.setState({modalVisible: false})
            this.getAndroidGrayScaleRules()
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  }

  /**
   * @desc 全选事件
   */
  onCheckAllChange = (e) => {
    const {newRules} = this.state
    let areas = []
    if (e === true) {
      this.state.areaList.map(item => {
        areas.push(item.code)
        return item
      })
    }
    newRules.areas = areas
    this.setState({newRules, checkAllArea: e})
  }

  /**
   * @desc 规则改变事件
   */
  onNewRulesChange = (e) => {
    let {newRules} = this.state
    newRules.type = e
    this.setState({newRules}, () => {
      let fieldsValues = this.getReturnFieldsValues()
      this.props.form.setFieldsValue(fieldsValues)
    })
  }

  /**
   * @desc 区域改变事件
   */
  onAreaChange = (e) => {
    const {newRules} = this.state
    newRules.areas = e
    this.setState({newRules}, () => {
      this.isCheckedAllArea()
    })
  }

  showTips = () => {
    Modal.info({
      title: '灰度规则',
      content: <div style={{paddingTop: 16}}>
        <p>规则0：关闭下发</p>
        <p>规则1：按区域下发，如“广东省”，“北京市”</p>
        <p>规则2：按流量下发，如“10%”，“50%”</p>
        <p>规则3：按设备下发，根据设备唯一码</p>
        <p>规则4：按区域&amp;流量下发，如“广东省，50%”</p>
      </div>
    });
  }

  render() {
    const {
      platform,
      projectName,
      listData,
      columns,
      pagination,
      loading,
      params,
      downloadPath,
      androidData,
      areaList,
      modalVisible,
      checkAllArea,
      grayRules,
      rules,
      newRules
    } = this.state
    const {getFieldDecorator} = this.props.form;
    const infoItem = {
      left: 4,
      right: 20
    }
    let flowList = () => {
      let list = []
      for (let i = 1; i < 11; i++) {
        list.push(<Option value={i * 10 + "%"} key={i}>{i * 10 + "%"}</Option>)
      }
      return list
    }
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>灰度发布</BreadcrumbItem>
        </Breadcrumb>
        {platform === 1 &&
        <div>
          <div className="button-container">
            <span>{projectName}</span>
          </div>
          <div className="content-container">
            <Card
              title="当前灰度策略"
              className="gray-feature"
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    this.addRules()
                  }}>
                  <Icon type="edit"/>编辑
                </Button>
              }>
              <Row className="info-item">
                <Col span={infoItem.left}><span onClick={this.showTips} style={{cursor: 'pointer'}}>灰度规则<Icon
                  type="question-circle" style={{paddingLeft: 8}}/></span></Col>
                <Col span={infoItem.right}>{grayRules[rules.type] || '-'}</Col>
              </Row>
              {
                rules.areaName &&
                <Row className="info-item">
                  <Col span={infoItem.left}>灰度下发区域</Col>
                  <Col span={infoItem.right}>{rules.areaName || '-'}</Col>
                </Row>
              }
              {
                rules.flows &&
                <Row className="info-item">
                  <Col span={infoItem.left}>灰度下发百分百</Col>
                  <Col span={infoItem.right}>{rules.flows || '-'}</Col>
                </Row>
              }
              {
                rules.devices &&
                <Row className="info-item">
                  <Col span={infoItem.left}>灰度下发设备</Col>
                  <Col span={infoItem.right}>{rules.devices || '-'}</Col>
                </Row>
              }
              <Divider/>
              <Row className="info-item">
                <Col span={infoItem.left}>version</Col>
                <Col span={infoItem.right}>{rules.version || '-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>versionName</Col>
                <Col span={infoItem.right}>{rules.versionName || '-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>name</Col>
                <Col span={infoItem.right}>{rules.name || '-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>url</Col>
                <Col span={infoItem.right}><a href={rules.url}>{ rules.url|| '-'}</a></Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>desc</Col>
                <Col span={infoItem.right}>{rules.desc || '-'}</Col>
              </Row>
            </Card>
            <Card title="分布情况" style={{marginTop: 24}}>
              <p>
                <span style={{paddingRight: 8, marginBottom: 0}}>实际分发数/预计分发数(昨天)：</span>
                {JSON.stringify(androidData.beforeActualQuantity) || '--'}/{JSON.stringify(androidData.beforeExpectQuantitty) || '--'}
              </p>
              <p>
                <span style={{paddingRight: 8, marginBottom: 0}}>实际分发数/预计分发数(今天)：</span>
                {JSON.stringify(androidData.actualQuantity) || '--'}/{JSON.stringify(androidData.expectQuantitty) || '--'}
              </p>
            </Card>
          </div>
        </div>
        }
        {platform === 2 &&
        <div>
          <div className="button-container">
            <span>{projectName}</span>
            <Button type="primary"><Link to="/addGrayscale">新发布</Link></Button>
            <Button>停止发布</Button>
          </div>
          <Row className="button-container">
            <Col span={8}><span className="item-name">Bundle ID：</span><span
              className="item-value">{params.bundleID}</span></Col>
            <Col span={8}><span className="item-name">下载地址：</span><a href={downloadPath} className="item-value">点击下载</a></Col>
          </Row>
          <div className="content-container">
            <Card title="版本信息">
              <Table columns={columns} rowKey={record => record.id} dataSource={listData} pagination={pagination}
                     loading={loading} onChange={this.handleTableChange}/>
            </Card>
          </div>
        </div>
        }
        <Modal
          title='编辑灰度策略'
          visible={modalVisible}
          onOk={this.saveAndroidGrayScaleRules}
          onCancel={() => {
            this.setState({modalVisible: false})
          }}
          okText="确认"
          cancelText="取消">
          <Select value={newRules.type} style={{width: "100%"}}
                  onChange={e => this.onNewRulesChange(e)}>
            {grayRules.map((item, index) => <Option value={index} key={index}>{item}</Option>)}
          </Select>
          {
            newRules.type === 0 &&
            <p style={{fontSize: 24, color: '#ccc', textAlign: "center", marginTop: 24}}>【关闭灰度下发】</p>
          }
          <Form className="editRules-active">
            {
              (newRules.type === 1 || newRules.type === 4) &&
              <FormItem label="灰度下发区域">
                {
                  getFieldDecorator('areas', {
                    rules: [{
                      validator: this.areasValidate
                    }]
                  })(
                    <div className="area-checkbox-container">
                      <Checkbox checked={checkAllArea}
                                onChange={e => this.onCheckAllChange(e.target.checked)}>全部</Checkbox>
                      <CheckboxGroup value={newRules.areas} onChange={(e) => {
                        this.onAreaChange(e)
                      }}>
                        <Row>
                          {
                            areaList.map((item, index) => {
                              return <Col span={12} key={index} style={{marginBottom: 8}}>
                                <Checkbox value={item.code.toString()}>{item.name}</Checkbox>
                              </Col>
                            })
                          }
                        </Row>
                      </CheckboxGroup>
                    </div>
                  )
                }
              </FormItem>
            }
            {
              (newRules.type === 2 || newRules.type === 4) &&
              <FormItem label="灰度下发百分百">
                {
                  getFieldDecorator('flows', {
                    rules: [{
                      required: true, message: '请选择灰度下发百分百'
                    }]
                  })(
                    <Select style={{width: "100%"}}>
                      {flowList()}
                    </Select>
                  )
                }
              </FormItem>
            }
            {
              newRules.type === 3 &&
              <FormItem label="灰度下发设备">
                {
                  getFieldDecorator('devices', {
                    rules: [{
                      required: true, message: '请填写灰度下发设备'
                    }]
                  })(
                    <TextArea style={{height: 100}} placeholder='填写下发设备唯一码，以【回车键】分割'/>
                  )
                }
              </FormItem>
            }
          </Form>
          {
            newRules.type !== 0 &&
            <div>
              <Form className="editRules">
                <FormItem label="version">
                  {
                    getFieldDecorator('version', {
                      rules: [{
                        required: true, message: '请填写version'
                      }]
                    })(<Input/>)
                  }
                </FormItem>
                <FormItem label="versionName">
                  {
                    getFieldDecorator('versionName', {
                      rules: [{
                        required: true, message: '请填写versionName'
                      }]
                    })(<Input/>)
                  }
                </FormItem>
                <FormItem label="name">
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: '请填写name'
                      }]
                    })(<Input/>)
                  }
                </FormItem>
                <FormItem label="url">
                  {
                    getFieldDecorator('url', {
                      rules: [{
                        required: true, message: '请填写url'
                      }]
                    })(<Input/>)
                  }
                </FormItem>
                <FormItem label="desc">
                  {
                    getFieldDecorator('desc')(<TextArea
                      style={{marginTop: 4, height: 100}}/>)
                  }
                </FormItem>
              </Form>
            </div>
          }
        </Modal>
      </div>
    )
  }
}

const GrayscaleReleaseForm = Form.create()(GrayscaleRelease);
export default connect(state => {
  return {
    projectId: state.project.projectId
  }
}, {})(GrayscaleReleaseForm);
