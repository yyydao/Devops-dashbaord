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
  Select,
  InputNumber,
  Spin
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
      performanceColumns: [
        {
          title: '域名',
          dataIndex: 'domain',
          key: 'domain',
          render: (text, record) => <div><a onClick={()=>{this.gotoAPM(record)}}>{text}</a></div>
        },
        {
          title: '请求量',
          dataIndex: 'requestNum',
          key: 'requestNum'
        },
        {
          title: '平均响应时间(ms)',
          dataIndex: 'avgAllTime',
          key: 'avgAllTime'
        },
        {
          title: 'DNS响应时间(ms)',
          dataIndex: 'avgDnsTime',
          key: 'avgDnsTime'
        },
        {
          title: '服务器响应时间(ms)',
          dataIndex: 'avgResponseTime',
          key: 'avgResponseTime'
        },
        {
          title: '吞吐率(次/分钟)',
          dataIndex: 'throughput',
          key: 'throughput'
        },
        {
          title: '错误率',
          dataIndex: 'errorRate',
          key: 'errorRate'
        }
      ],
      collapseCloumns: [
        {
          title: '系统版本',
          dataIndex: 'xitong',
          key: 'xitong',
        },
        {
          title: '用户崩溃率',
          dataIndex: 'bengkui',
          key: 'bengkui'
        },
        {
          title: '影响用户',
          dataIndex: 'yingxiang',
          key: 'yingxiang'
        },
        {
          title: '联网用户',
          dataIndex: 'lianwang',
          key: 'lianwang'
        }
      ],
      performanceData: [],
      collapseData: [
        {
          id: 1,
          xitong: 'Android 5.1.1,level 22',
          bengkui: '0.65%',
          yingxiang: '22',
          lianwang: '3358'
        },
        {
          id: 2,
          xitong: 'Android 5.1.1,level 22',
          bengkui: '0.65%',
          yingxiang: '22',
          lianwang: '3358'
        },
        {
          id: 3,
          xitong: 'Android 5.1.1,level 22',
          bengkui: '0.65%',
          yingxiang: '22',
          lianwang: '3358'
        },
        {
          id: 4,
          xitong: 'Android 5.1.1,level 22',
          bengkui: '0.65%',
          yingxiang: '22',
          lianwang: '3358'
        }
      ],
      modalVisible: false,
      performanceTitle:'',
      collapseTitle:'',
      areaList: [],
      checkAllArea: false,
      distributeData: {},//分发数
      grayRules: [
        '规则0：关闭下发',
        '规则1：按区域下发',
        '规则2：按流量下发',
        '规则3：按设备下发',
        '规则4：按区域&流量下发'
      ],
      rules: {},
      newRules: {},
      refreshLoading:false
    }
  }

  componentWillMount() {
    this.getPlatForm()
  }

  /**
   * @desc 获取项目详情为了获取platform，区分是ios,还是Android
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
          this.getGrayScaleRules()
          this.getAreaInfo()
        })
      }
    })
  }

  /**
   * @desc 获取灰度发布主页数据
   */
  getGrayScaleRules = () => {
    reqGet('/distribute/queryRule', {projectId: this.props.projectId}).then(res => {
      if (res.code === 0 && res.data) {
        res.data.areas = res.data.areas ? res.data.areas.split(',') : []
        res.data.devices = res.data.devices ? res.data.devices.split(',') : []
        this.setState({
          rules: res.data,
          newRules: res.data,
          performanceTitle:res.data.versionName?`灰度评估（网络性能、12小时内、v${res.data.versionName}）`:''
        },()=>{
          this.getAssessment()
        })
      } else {
        message.error(res.msg)
      }
    })
  }
  /**
   * @desc 跳转APM
   */
  gotoAPM = (data) =>{
    // let url=`http://10.100.14.152:8082/#/networkPerformance?appVersion=${data.appVersion}&appDomain=${data.domain}&retrieveTimeStart=${data.retrieveTimeStart}&retrieveTimeEnd=${data.retrieveTimeEnd}`
    let url=`http://10.100.14.152:8082/#/networkPerformance?params={appVersion:${data.appVersion},appDomain:${data.domain},retrieveTimeStart:${data.retrieveTimeStart},retrieveTimeEnd:${data.retrieveTimeEnd}}`
    window.open(url, '_blank')
  }
  /**
   * @desc 获取地区信息
   */
  getAreaInfo = () => {
    reqGet('/distribute/queryArea',
      {
        projectId: this.props.projectId
      }
    ).then(res => {
      if (res.code === 0 && res.data) {
        this.setState({areaList: res.data})
        return
      }
      message.error(res.msg)
    })
  }

  /**
   * @desc 灰度评估接口 /distribute/getAssessment
   */
  getAssessment = () => {
    this.setState({refreshLoading:true},()=>{
      reqGet('/distribute/getAssessment', {projectId: this.props.projectId}).then(res => {
        if (res.code === 0 && res.data) {
          this.setState({performanceData: res.data})
        } else {
          message.error(res.msg)
        }
        this.setState({refreshLoading:false})
      })
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
   * @desc 编辑规则
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
      console.log(areas)
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
        fieldsValue.devices = newRules.devices.join('\n') || ''
        break
      case 4:
        fieldsValue.flows = newRules.flows || ''
        fieldsValue.areas = []
        break
      default:
        break
    }
    if (newRules.type !== 0) {
      fieldsValue.maxQuantity = newRules.maxQuantity
      fieldsValue.version = newRules.version
      fieldsValue.versionName = newRules.versionName
      fieldsValue.name = newRules.name
      fieldsValue.url = newRules.url
      fieldsValue.desc = newRules.desc
    }
    return fieldsValue
  }
  /**
   * @desc 保存灰度发布
   */
  saveGrayScaleRules = () => {
    let fields = this.getReturnFieldsValues()
    this.props.form.validateFields(Object.keys(fields), (err, values) => {
      if (!err) {
        //合并要提交的数据
        let newRules = JSON.parse(JSON.stringify(this.state.newRules))
        if (values.areas) {
          values.areas = newRules.areas.join(',')
        }
        if (values.devices) {
          values.devices = values.devices.split('\n').join(',')
        }

        values.projectId = newRules.projectId || this.props.projectId
        values.type = newRules.type

        //不提交的数据都置为''
        let uploadKeys = Object.keys(values)
        for (let key in newRules) {
          if (uploadKeys.indexOf(key) < 0 && key !== 'areaName') {
            newRules[key] = ''
          }
        }
        reqPost('/distribute/saveRule', Object.assign({}, newRules, values)).then(res => {
          if (res.code === 0) {
            message.success("保存成功")
            this.setState({modalVisible: false})
            this.getGrayScaleRules()
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
      areaList,
      modalVisible,
      checkAllArea,
      grayRules,
      rules,
      newRules,
      performanceData,
      performanceColumns,
      performanceTitle,
      refreshLoading
    } = this.state
    const {getFieldDecorator} = this.props.form;
    const fromItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18}
      }
    };

    const infoItem = {
      left: 4,
      right: 10
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
                <Col span={infoItem.left}>
                  <span onClick={this.showTips} style={{cursor: 'pointer'}}>
                    灰度规则
                    <Icon type="question-circle" style={{paddingLeft: 8}}/>
                  </span>
                </Col>
                <Col span={infoItem.right}>{grayRules[rules.type] || '-'}</Col>
              </Row>
              {
                rules.maxQuantity &&
                <Row className="info-item">
                  <Col span={infoItem.left}>灰度下发最大数</Col>
                  <Col span={infoItem.right}>{rules.maxQuantity==='-1'?'不限':rules.maxQuantity|| '-'}</Col>
                </Row>
              }
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
                rules.devices && rules.devices.length > 0 &&
                <Row className="info-item">
                  <Col span={infoItem.left}>灰度下发设备</Col>
                  <Col span={infoItem.right}>
                    {rules.devices.map((item, index) => <p key={index} style={{marginBottom: 4}}>{item}</p>)}
                  </Col>
                </Row>
              }
              <Divider/>
              {platform === 1 &&
              <Row className="info-item">
                <Col span={infoItem.left}>version</Col>
                <Col span={infoItem.right}>{rules.version || '-'}</Col>
              </Row>
              }
              <Row className="info-item">
                <Col span={infoItem.left}>versionName</Col>
                <Col span={infoItem.right}>{rules.versionName || '-'}</Col>
              </Row>
              {platform === 1 &&
              <Row className="info-item">
                <Col span={infoItem.left}>name</Col>
                <Col span={infoItem.right}>{rules.name || '-'}</Col>
              </Row>
              }
              <Row className="info-item">
                <Col span={infoItem.left}>url</Col>
                <Col span={infoItem.right}><a href={rules.url}>{rules.url || '-'}</a></Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>desc</Col>
                <Col span={infoItem.right}>{rules.desc || '-'}</Col>
              </Row>
            </Card>
            <Card title="分布情况" style={{marginTop: 24}}>
              <p>
                <span style={{paddingRight: 8, marginBottom: 0}}>安装数/推送数：</span>
                {JSON.stringify(rules.installQuantity) || '--'}/{JSON.stringify(rules.pushQuantity) || '--'}
              </p>
            </Card>
            <Card
              title={performanceTitle||`灰度评估`}
              style={{marginTop: 24}}
              className="gray-feature"
              extra={<Button type="primary" onClick={()=>{this.getAssessment()}}>刷新</Button>}>
              <Spin spinning={refreshLoading}>
              <Table
                columns={performanceColumns}
                dataSource={performanceData}
                rowKey={(record,index) => index}
                pagination={false}/>
              </Spin>
            </Card>
            {/*<Card*/}
              {/*title={collapseTitle||`灰度评估（今天）`}*/}
              {/*style={{marginTop: 24}}*/}
              {/*className="gray-feature"*/}
              {/*extra={<Button type="primary">刷新</Button>}>*/}
              {/*<Table*/}
                {/*columns={collapseCloumns}*/}
                {/*dataSource={collapseData}*/}
                {/*rowKey={record => record.id}*/}
                {/*pagination={false}/>*/}
            {/*</Card>*/}
          </div>
        </div>
        <Modal
          title='编辑灰度策略'
          visible={modalVisible}
          onOk={this.saveGrayScaleRules}
          onCancel={() => {
            this.setState({modalVisible: false})
          }}
          okText="确认"
          cancelText="取消">
          <Select value={newRules.type} style={{width: "100%", marginBottom: 16}}
                  onChange={e => this.onNewRulesChange(e)}>
            {grayRules.map((item, index) => <Option value={index} key={index}>{item}</Option>)}
          </Select>
          {
            newRules.type === 0 &&
            <p className="close-distribute">【关闭灰度下发】</p>
          }
          <Form className="form-container">
            {
              (newRules.type === 1 || newRules.type === 4) &&
              <FormItem {...fromItemLayout} label="灰度下发区域">
                {
                  getFieldDecorator('areas', {
                    rules: [{
                      validator: this.areasValidate
                    }]
                  })(
                    <div className="area-checkbox-container">
                      {areaList.length > 0 &&
                      <Checkbox checked={checkAllArea}
                                onChange={e => this.onCheckAllChange(e.target.checked)}>全部</Checkbox>
                      }
                      {
                        areaList.length === 0 &&
                        <p>未获取到区域信息</p>
                      }
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
              <FormItem {...fromItemLayout} label="灰度下发百分百">
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
              <FormItem {...fromItemLayout} label="灰度下发设备">
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
            {
              newRules.type !== 0 &&
              <div>
                <FormItem {...fromItemLayout} label="最大下发数">
                  {
                    getFieldDecorator('maxQuantity', {
                      rules: [{
                        required: true, message: '请填写最大下发数'
                      }]
                    })(<InputNumber min={-1} max={1000000} placeholder='0-1000000,-1表示"不设限"' style={{width: '100%'}}/>)
                  }
                </FormItem>
                <FormItem {...fromItemLayout} label="version">
                  {
                    getFieldDecorator('version', {
                      rules: [{
                        required: true, message: '请填写version'
                      }]
                    })(<InputNumber style={{width: '100%'}}/>)
                  }
                </FormItem>
                <FormItem {...fromItemLayout} label="versionName">
                  {
                    getFieldDecorator('versionName', {
                      rules: [{
                        required: true, message: '请填写versionName'
                      }]
                    })(<Input/>)
                  }
                </FormItem>
                <FormItem {...fromItemLayout} label="name">
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: '请填写name'
                      }]
                    })(<Input/>)
                  }
                </FormItem>
                <FormItem {...fromItemLayout} label="url">
                  {
                    getFieldDecorator('url', {
                      rules: [{
                        required: true, message: '请填写url'
                      }]
                    })(<Input/>)
                  }
                </FormItem>
                <FormItem {...fromItemLayout} label="desc">
                  {
                    getFieldDecorator('desc')(<TextArea
                      style={{marginTop: 4, height: 100}}/>)
                  }
                </FormItem>
              </div>
            }
          </Form>
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
