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
  Radio,
  Divider,
  Select
} from 'antd'
import Edit from '@/pages/Setting/ConfigManager/Edit';
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

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
      selectedRowKeys: [],

      //灰度发布-android
      modalVisible: false,
      areaList: [],
      checkAllArea: false,
      androidData: {},
      grayRules: ['规则0：关闭下发', '规则1：按区域下发', '规则2：按流量下发', '规则3：按设备下发', '规则4：按区域&流量下发'],
      rules: {
        ruleId: 0,
        areaCheckedList: [],
        devices:'',
        flow:'10%',
        version: 153,
        versionName: '5.4.4',
        name: 'tuandai5.4.4.apk',
        url: 'https://apk.tuandai.com/tuandai/tuandai5.4.4.2.apk',
        desc: '为了让您获得更好的体验，我们本次更新：||- 团宝箱升级，可以更直观的查看所有优惠券；||- 部分界面优化，给您更清晰简洁的视觉体验。'
      }
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
            this.getAndroidGrayScaleData()
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
   * @desc 文本编辑事件
   * @param value string 文本编辑内容
   * @param key string 文本编辑字段
   * @param index num 环境下标
   */
  changeEdit = (value, index, key) => {
    if (key === "version") {
      let androidData = this.state.androidData
      androidData[key] = value
      this.setState({androidData}, () => {
        this.saveAndroidGrayScaleData(true)
      })
    } else {
      let androidData = this.state.androidData
      androidData.featureItems[index][key] = value
      this.setState({androidData})
    }
  }

  /**
   * @desc 新增特征值改变事件
   */
  onNewFeaturesChange = (e, key) => {
    let newFeatures = this.state.newFeatures
    newFeatures[key] = e
    this.setState({newFeatures})
  }
  /**
   * @desc 获取android灰度发布主页数据
   */
  getAndroidGrayScaleData = () => {
    reqGet('/distribute/queryInformation', {projectId: this.props.projectId}).then(res => {
      if (res.code === 0) {
        let selectedRowKeys = []
        if (res.data.featureItems) {
          res.data.featureItems.map((item, index) => {
            if (item.checked) {
              selectedRowKeys.push(index)
            }
            return item
          })
        }
        this.setState({androidData: res.data, selectedRowKeys})
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
        this.setState({areaList: res.data}, () => {
          this.isCheckedAllArea()
          this.setState({modalVisible: true})
        })
      } else {
        message.error(res.msg)
      }
    })
  }
  /**
   * @desc 判断地区是否全选
   */
  isCheckedAllArea = () => {
    let areaList =this.state.areaList
    let areaCheckedList = this.state.rules.areaCheckedList
    this.setState({checkAllArea:areaCheckedList.length===areaList.length})
  }

  /**
   * @desc 表格选择栏改变事件
   */
  onSelectedRowKeys = (selectedRowKeys) => {
    console.log(selectedRowKeys)
    let androidData = this.state.androidData
    androidData.featureItems.map((item, index) => {
      if (selectedRowKeys.indexOf(index) === -1) {
        item.checked = false
      } else {
        item.checked = true
      }
      return item
    })
    this.setState({androidData, selectedRowKeys: selectedRowKeys})
  }

  /**
   * @desc
   */
  addFeatures = () => {
    this.setState({modalVisible: true})
  }

  /**
   * @desc modal框确定事件
   */
  handleOk = () => {
    this.setState({modalVisible: false})
  }
  /**
   * @desc 保存Android灰度发布信息
   */
  saveAndroidGrayScaleData = (isVersion) => {
    let params = {}
    if (isVersion) {
      params = {
        projectId: this.props.projectId,
        version: this.state.androidData.version,
      }
    } else {
      params = {
        projectId: this.props.projectId,
        expression: this.state.androidData.expression,
        featureItems: this.state.androidData.featureItems
      }
    }
    reqPost('/distribute/saveDistribute', params).then(res => {
      if (res.code === 0) {
        message.success("保存成功")
      } else {
        message.error(res.msg)
      }
    })
  }
  /**
   * @desc 生成表达式
   */
  getExpression = () => {
    let androidData = this.state.androidData
    let featureItems = this.state.androidData.featureItems
    let area = "", flow = "", device = '', isDevice = false
    featureItems.map(item => {
      if (item.checked === true) {
        if (item.featureName === "T-G3-Device") {
          device = item.featureValue
          isDevice = true
        }
        if (item.featureName === "T-G1-Area" && item.featureValue) {
          let featureValue = item.featureValue.split(',')
          featureValue.map((item, index) => {
            if (index === 0) {
              area += "(" + encodeURI(item) + ")"
            } else {
              area += "|(" + encodeURI(item) + ")"
            }
            return item
          })
        }
        if (item.featureName === "T-G2-Flow" && item.featureValue) {
          let featureValue = parseInt(item.featureValue, 10) / 10
          flow = this.state.flowExpression[featureValue - 1]
        }
      }
      return item
    })
    if (device) {
      androidData.expression = "^" + device + "$"
      this.setState({androidData})
      return
    }
    if (isDevice) {
      androidData.expression = ""
    }
    if (!isDevice && (area || flow)) {
      androidData.expression = "^" + area + flow + "$"
    } else {
      androidData.expression = ""
    }
    this.setState({androidData})
  }
  /**
   * @desc Android表达式改变
   */
  onExpressionChange = (value) => {
    let androidData = this.state.androidData
    androidData.expression = value
    this.setState({androidData})
  }
  /**
   * @desc 全选事件
   */
  onCheckAllChange = (e) => {
    const {rules}= this.state
    let areaCheckedList = []
    if (e === true) {
      this.state.areaList.map(item => {
        areaCheckedList.push(item.name)
        return item
      })
    }
    rules.areaCheckedList=areaCheckedList
    this.setState({rules, checkAllArea: e})
  }
  /**
   * @desc 规则改变事件
   */
  onRulesChange = (e, index) => {
    const {rules} = this.state
    rules[index] = e
    if (index === 'ruleId' && (e === 1||e === 4)) {
      this.getAreaInfo()
    }
    this.setState({rules})
  }

  /**
   * @desc 区域改变事件
   */
  onAreaChange = (e) => {
    const {rules} = this.state
    rules.areaCheckedList = e
    this.setState({rules}, () => {
      this.isCheckedAllArea()
    })
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
      selectedRowKeys,
      areaList,
      areaCheckedList,
      modalVisible,
      checkAllArea,
      newFeatures,
      grayRules,
      rules
    } = this.state
    const {getFieldDecorator} = this.props.form;
    const fromItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20}
      }
    };
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
            {JSON.stringify(androidData) !== "{}" &&
            <Card
              title="当前灰度策略"
              className="gray-feature"
              extra={
                <Button
                  type="primary"
                  onClick={() => {
                    this.addFeatures()
                  }}>
                  <Icon type="edit"/>编辑
                </Button>
              }>
              <Row className="info-item">
                <Col span={infoItem.left}>灰度规则</Col>
                <Col span={infoItem.right}>{grayRules[rules.ruleId]}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>灰度下发区域</Col>
                <Col span={infoItem.right}>广东省、广西省、北京市、广西自治区</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>灰度下发百分百</Col>
                <Col span={infoItem.right}>50%</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>灰度下发设备</Col>
                <Col span={infoItem.right}>2225c695-cfb8-4ebb-aaaa-80da344e8352；
                  ed1847d9-254c-47d1-b213-f14c05e594ea</Col>
              </Row>
              <Divider/>
              <Row className="info-item">
                <Col span={infoItem.left}>version</Col>
                <Col span={infoItem.right}>153</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>versionName</Col>
                <Col span={infoItem.right}>5.4.4</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>name</Col>
                <Col span={infoItem.right}>tuandai5.4.4.apk</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>url</Col>
                <Col span={infoItem.right}>https://apk.tuandai.com/tuandai/tuandai5.4.4.2.apk</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>desc</Col>
                <Col span={infoItem.right}>为了让您获得更好的体验，我们本次更新：||- 团宝箱升级，可以更直观的查看所有优惠券；||- 部分界面优化，给您更清晰简洁的视觉体验。</Col>
              </Row>
            </Card>
            }
            {JSON.stringify(androidData) !== "{}" &&
            <Card title="分布情况" style={{marginTop: 24}}>
              <div className="config-project-item">
                <span>分发版本：</span>
                <Edit name='version' defaultValue={androidData.version} handleConfirm={this.changeEdit}/>
              </div>
              <p>
                <span style={{paddingRight: 8, marginBottom: 0}}>实际分发数/预计分发数：(昨天)</span>
                {androidData.beforeActualQuantity}/{androidData.beforeExpectQuantitty}
              </p>
              <p>
                <span style={{paddingRight: 8, marginBottom: 0}}>实际分发数/预计分发数：(今天)</span>
                {androidData.actualQuantity}/{androidData.expectQuantitty}
              </p>
            </Card>
            }
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
        <Modal title='编辑灰度策略' visible={modalVisible} onOk={this.handleOk} onCancel={() => {
          this.setState({modalVisible: false})
        }}
               okText="确认" cancelText="取消">
          <Select value={rules.ruleId} style={{width: "100%"}}
                  onChange={e => this.onRulesChange(e, 'ruleId')}>
            {grayRules.map((item, index) => <Option value={index} key={index}>{item}</Option>)}
          </Select>
          {
            rules.ruleId === 0 &&
            <p style={{fontSize: 24, color: '#ccc', textAlign: "center", marginTop: 24}}>【关闭灰度下发】</p>
          }
          {
            (rules.ruleId === 1|| rules.ruleId === 4)&&
            <div className="area-checkbox-container">
              <Checkbox checked={checkAllArea} onChange={e => this.onCheckAllChange(e.target.checked)}>全部</Checkbox>
              <div style={{marginTop: 8}}>
                <CheckboxGroup value={rules.areaCheckedList} onChange={(e) => {this.onAreaChange(e)}}>
                  <Row>
                    {
                      areaList.map((item, index) => {
                        return <Col span={12}key={index} style={{marginBottom: 8}}>
                          <Checkbox value={item.name}>{item.name}</Checkbox>
                        </Col>
                      })
                    }
                  </Row>
                </CheckboxGroup>
              </div>
            </div>
          }
          {
            (rules.ruleId === 2|| rules.ruleId === 4) &&
            <Select value={rules.flow} style={{width: "100%",  marginTop: 16}}
                    onChange={e => this.onRulesChange(e, 'flow')}>
              {
                flowList()
              }
              {/*{grayRules.map((item, index) => <Option value={index} key={index}>{item}</Option>)}*/}
            </Select>
          }
          {
            rules.ruleId === 3 &&
            <TextArea style={{marginTop: 4,height:100, marginTop: 16}} value={rules.devices} placeholder='填写下发设备唯一码，以【回车键】分割' onChange={e => this.onRulesChange(e, 'devices')}/>
          }
          {
            rules.ruleId !== 0 &&
            <div>
              <Form onSubmit={this.jenkinsSubmit} className="editRules">
                <FormItem label="version">
                  {
                    getFieldDecorator('version', {initialValue: rules.version})(<Input/>)
                  }
                </FormItem>
                <FormItem label="versionName">
                  {
                    getFieldDecorator('versionName', {initialValue: rules.versionName})(<Input/>)
                  }
                </FormItem>
                <FormItem label="name">
                  {
                    getFieldDecorator('name', {initialValue: rules.name})(<Input/>)
                  }
                </FormItem>
                <FormItem label="url">
                  {
                    getFieldDecorator('url', {initialValue: rules.url})(<Input/>)
                  }
                </FormItem>
                <FormItem label="desc">
                  {
                    getFieldDecorator('desc', {initialValue: rules.desc})(<TextArea style={{marginTop: 4,height:100}}/>)
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
    projectId: state.projectId
  }
}, {})(GrayscaleReleaseForm);
