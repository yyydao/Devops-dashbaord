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
        res.data.areas=res.data.areas.split(',')
        this.setState({rules: res.data, newRules: res.data})
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
    let {rules, newRules} = this.state
    newRules = JSON.parse(JSON.stringify(rules))
    this.setState({newRules, modalVisible: true})
  }

  /**
   * @desc 保存Android灰度发布
   */
  saveAndroidGrayScaleRules = () => {
    let params = JSON.parse(JSON.stringify(this.state.newRules))
    params.areas = params.areas.join(',')
    reqPost('/distribute/saveRule', params).then(res => {
      if (res.code === 0) {
        message.success("保存成功")
        this.setState({modalVisible: false})
        this.getAndroidGrayScaleRules()
      } else {
        message.error(res.msg)
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
  onNewRulesChange = (e, index) => {
    let {newRules} = this.state
    newRules[index] = e
    this.setState({newRules})
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

  showTips=()=>{
    Modal.info({
      title: '灰度规则',
      content: <div style={{paddingTop:16}}>
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
                <Col span={infoItem.left}><span onClick={this.showTips} style={{cursor:'pointer'}}>灰度规则<Icon type="question-circle" style={{paddingLeft:8}}/></span></Col>
                <Col span={infoItem.right}>{grayRules[rules.type]||'-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>灰度下发区域</Col>
                <Col span={infoItem.right}>{rules.areaName||'-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>灰度下发百分百</Col>
                <Col span={infoItem.right}>{rules.flows||'-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>灰度下发设备</Col>
                <Col span={infoItem.right}>{rules.devices||'-'}</Col>
              </Row>
              <Divider/>
              <Row className="info-item">
                <Col span={infoItem.left}>version</Col>
                <Col span={infoItem.right}>{rules.version||'-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>versionName</Col>
                <Col span={infoItem.right}>{rules.versionName||'-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>name</Col>
                <Col span={infoItem.right}>{rules.name||'-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>url</Col>
                <Col span={infoItem.right}>{rules.url||'-'}</Col>
              </Row>
              <Row className="info-item">
                <Col span={infoItem.left}>desc</Col>
                <Col span={infoItem.right}>{rules.desc||'-'}</Col>
              </Row>
            </Card>
            <Card title="分布情况" style={{marginTop: 24}}>
              <p>
                <span style={{paddingRight: 8, marginBottom: 0}}>实际分发数/预计分发数：(昨天)</span>
                {androidData.beforeActualQuantity||'--'}/{androidData.beforeExpectQuantitty||'--'}
              </p>
              <p>
                <span style={{paddingRight: 8, marginBottom: 0}}>实际分发数/预计分发数：(今天)</span>
                {androidData.actualQuantity||'--'}/{androidData.expectQuantitty||'--'}
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
                  onChange={e => this.onNewRulesChange(e, 'type')}>
            {grayRules.map((item, index) => <Option value={index} key={index}>{item}</Option>)}
          </Select>
          {
            newRules.type === 0 &&
            <p style={{fontSize: 24, color: '#ccc', textAlign: "center", marginTop: 24}}>【关闭灰度下发】</p>
          }
          {
            (newRules.type === 1 || newRules.type === 4) &&
            <div className="area-checkbox-container">
              <Checkbox checked={checkAllArea} onChange={e => this.onCheckAllChange(e.target.checked)}>全部</Checkbox>
              <div style={{marginTop: 8}}>
                <CheckboxGroup value={newRules.areas} onChange={(e) => {
                  this.onAreaChange(e)
                }}>
                  <Row>
                    {
                      areaList.map((item, index) => {
                        return <Col span={12} key={index} style={{marginBottom: 8}}>
                          <Checkbox value={item.code}>{item.name}</Checkbox>
                        </Col>
                      })
                    }
                  </Row>
                </CheckboxGroup>
              </div>
            </div>
          }
          {
            (newRules.type === 2 || newRules.type === 4) &&
            <Select value={newRules.flows} style={{width: "100%", marginTop: 16}}
                    onChange={e => this.onNewRulesChange(e, 'flows')}>
              {flowList()}
            </Select>
          }
          {
            newRules.type === 3 &&
            <TextArea style={{height: 100, marginTop: 16}} value={newRules.devices} placeholder='填写下发设备唯一码，以【回车键】分割'
                      onChange={e => this.onNewRulesChange(e, 'devices')}/>
          }
          {
            newRules.type !== 0 &&
            <div>
              <Form onSubmit={this.jenkinsSubmit} className="editRules">
                <FormItem label="version">
                  {
                    getFieldDecorator('version', {initialValue: newRules.version})(<Input/>)
                  }
                </FormItem>
                <FormItem label="versionName">
                  {
                    getFieldDecorator('versionName', {initialValue: newRules.versionName})(<Input/>)
                  }
                </FormItem>
                <FormItem label="name">
                  {
                    getFieldDecorator('name', {initialValue: newRules.name})(<Input/>)
                  }
                </FormItem>
                <FormItem label="url">
                  {
                    getFieldDecorator('url', {initialValue: newRules.url})(<Input/>)
                  }
                </FormItem>
                <FormItem label="desc">
                  {
                    getFieldDecorator('desc', {initialValue: newRules.desc})(<TextArea
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
