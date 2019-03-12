import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {reqPost, reqGet} from '@/api/api'
import {
  Breadcrumb,
  Card,
  Button,
  Icon,
  Modal,
  Table,
  Checkbox,
  Row,
  Col,
  Upload,
  message
} from 'antd'
import '././index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const Dragger = Upload.Dragger;

class PackageSelfCheck extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      columns: [
        {
          title: '资源名称',
          dataIndex: 'xitong',
          key: 'xitong',
        },
        {
          title: '大小(KB)',
          dataIndex: 'bengkui',
          key: 'bengkui'
        },
        {
          title: '次数',
          dataIndex: 'yingxiang',
          key: 'yingxiang'
        },
        {
          title: '标记',
          dataIndex: 'lianwang',
          key: 'lianwang',
          render: (text) => <Checkbox/>
        },
        {
          title: '标记时间',
          dataIndex: 'biaoji',
          key: 'biaoji'
        }
      ],
      tableData: [
        {
          xitong: 'res\\drawable-xxhdpi-v4\\loanrecordbiz_icon_reward.png',
          bengkui: '19.08',
          yingxiang: '2',
          lianwang: '',
          biaoji: '2019/03/07'
        },
        {
          xitong: 'res\\drawable-xxhdpi-v4\\loanrecordbiz_icon_reward.png',
          bengkui: '19.08',
          yingxiang: '2',
          lianwang: '',
          biaoji: '2019/03/07'
        },
        {
          xitong: 'res\\drawable-xxhdpi-v4\\loanrecordbiz_icon_reward.png',
          bengkui: '19.08',
          yingxiang: '2',
          lianwang: '',
          biaoji: '2019/03/07'
        }
      ],
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: null
      },
      keyName: {
        packageSize: '包大小',
        jiaGuSize: '加固包大小',
        totalResSize: '总资源大小',
        totalResRate: '资源总占比',
        repeatResSize: '重复资源总大小',
        repeatResRate: '重复资源占比',
        repeatResNum: '重复资源个数',
        repeatResMark: '重复资源已标注',
        picSize: '超大图片总大小',
        picRate: '超大图片占比',
        picNum: '超大图片个数',
        picMark: '超大图片已标注',
        unUseSize: '无用资源总大小',
        unUseRate: '无用资源占比',
        unUseNum: '无用资源个数',
        unUseMark: '无用资源已标注'
      },
      currentData: {
        packageSize: '36.6MB',
        jiaGuSize: '38.9MB',
        totalResSize: '21.2MB',
        totalResRate: '57.9%',
        repeatResSize: '8MB',
        repeatResRate: '21.9%',
        repeatResNum: '19',
        picSize: '5MB',
        picRate: '13.7%',
        picNum: '19',
        unUseSize: '5MB',
        unUseRate: '13.7%',
        unUseNum: '19',
        unUseMark: '16'
      },
      fileList: [],
      uploading: false
    }
  }

  componentWillMount() {
  }

  /**
   * @desc 拖拽文件的改变事件
   */
  onDraggerChange = (info) => {
    const status = info.file.status;
    let fileList = info.fileList;
    console.log(info)
    if (status === 'done') {
      if (info.file.response.code === 0) {

      } else {
        fileList = []
        message.error(info.file.response.msg)
      }
    } else if (status === 'error') {
      fileList = []
      message.error(`${info.file.name}  文件上传失败`)
    } else if (!status) {
      fileList = []
    }
    this.setState({fileList})
  }

  /**
   * @desc ipa上传之前的操作
   */
  beforeUpload = (file, fileList) => {
    if (fileList.length !== 1) {
      message.error("只支持上传一个文件")
      return false
    }
  }

  render() {
    const {fileList, modalVisible, columns, tableData, pagination, currentData, keyName, uploading} = this.state
    let dataList = (data) => {
      let list = [[], [], [], []], color = ['red', 'yellow', 'green', 'blue']
      for (let i in keyName) {
        let index = 0,
          isClick = (keyName[i].indexOf("个数") > -1 || keyName[i].indexOf("已标注") > -1) ? true : false
        if (keyName[i].indexOf("重复资源") > -1) {
          index = 1
        } else if (keyName[i].indexOf("超大图片") > -1) {
          index = 2
        } else if (keyName[i].indexOf("无用资源") > -1) {
          index = 3
        }
        if (!data[i]) {
          list[index].push(
            <Col span={6} key={i}>
              <div className="data-item-white">
                <p>--</p>
                <p>--</p>
              </div>
            </Col>
          )
        } else {
          if (index !== 0 && isClick) {
            list[index].push(
              <Col span={6} key={i}>
                <div className={`data-item-${color[index]} can-click`} onClick={() => {
                  this.setState({modalVisible: true})
                }}>
                  <p>{keyName[i]}</p>
                  <p>{data[i]}</p>
                  <Icon type="right" className="click-icon"/>
                </div>
              </Col>
            )
          } else {
            list[index].push(
              <Col span={6} key={i}>
                <div className={`data-item-${color[index]}`}>
                  <p>{keyName[i]}</p>
                  <p>{data[i]}</p>
                </div>
              </Col>
            )
          }
        }
      }
      list.map(item => <Row style={{width: "100%"}}>{item}</Row>)
      console.log(list)
      return list
    }
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>安装包</BreadcrumbItem>
          <BreadcrumbItem><Link to="/packageMonitor">包体监测</Link></BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <Card
            title="包体自检 ">
            <Dragger style={{padding: "40px 0px"}}
                     name='file'
                     disabled={uploading}
              // action='/deploy/upload'
              // data={{projectID:this.props.projectId,envID:62}}
                     onChange={(info) => {
                       this.onDraggerChange(info)
                     }}
                     beforeUpload={(file, fileList) => this.beforeUpload(file, fileList)}
                     accept=".ipa"
                     fileList={fileList}
              // headers={{token:this.props.token}}
            >
              <Button type="primary" size="large" disabled={uploading}><Icon type="upload"/>立即上传</Button>
              {!uploading &&
              <p style={{fontSize: 16, color: "#262626", paddingTop: 20, marginBottom: 4}}>上传安装包，即可自动分析</p>
              }
              {
                uploading &&
                <p style={{fontSize: 16, color: "#262626", paddingTop: 20, marginBottom: 4}}>
                  <Icon type="loading-3-quarters" spin style={{marginRight: 8}}/>
                  分析中，请勿离开当前页
                </p>
              }
              <span style={{color: 'rgba(0,0,0,0.43)'}}>支持ipa文件</span>
            </Dragger>
          </Card>
          <Card
            title="包体监测结果 "
            style={{marginTop: 24}}>
            {dataList(currentData)}
          </Card>
        </div>
        <Modal
          title='重复资源列表'
          visible={modalVisible}
          width={800}
          onOk={() => {
            this.setState({modalVisible: false})
          }}
          onCancel={() => {
            this.setState({modalVisible: false})
          }}
          okText="确认"
          cancelText="取消">
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey={(record, index) => index}
            pagination={pagination}/>
        </Modal>
      </div>
    )
  }
}

PackageSelfCheck = connect((state) => {
  return {
    token: state.auth.token,
    projectId: state.project.projectId
  }
})(PackageSelfCheck)

export default PackageSelfCheck
