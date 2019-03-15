import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {reqPost} from '@/api/api'
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
  message,
  Popover
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
      fileList: {
        ipa: [],
        apk: [],
        txt: []
      },
      platform: '',
      uploading: false
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
        })
      }
    })
  }
  /**
   * @desc 文件上传（判断是否一个文件）
   */
  beforeUpload = (file, fileList1, type) => {
    let {fileList, uploading} = this.state
    if (fileList[type].length === 1) {
      message.error("只支持上传一个文件")
      return false
    }
    fileList[type].push(file)
    uploading = type === 'ipa'
    this.setState({fileList, uploading})
  }

  /**
   * @desc 文件移除事件
   */
  onRemove = (file, type) => {
    let fileList = JSON.parse(JSON.stringify(this.state.fileList))
    const index = fileList[type].indexOf(file);
    fileList[type].splice(index, 1)
    this.setState({fileList});
  }

  render() {
    const {fileList, modalVisible, columns, tableData, pagination, currentData, keyName, uploading, platform} = this.state
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
    let getDraggerContext = (type) => {
      let textTips = '', fileTips = ''
      switch (type) {
        case 'ipa':
          textTips = '上传安装包，即可自动分析'
          fileTips = '支持ipa文件'
          break
        case 'apk':
          textTips = '上传安装包，点击"开始分析"'
          fileTips = '支持apk文件'
          break
        case 'txt':
          textTips = '上传R.txt文件'
          fileTips = '可选择上传，用于分析"无用资源"'
          break
        default:
          break
      }
      return <div>
        <Button type="primary" size="large" disabled={uploading}><Icon type="upload"/>立即上传</Button>
        {!uploading &&
        <p style={{fontSize: 16, color: "#262626", paddingTop: 20, marginBottom: 4}}>{textTips}</p>
        }
        {
          uploading &&
          <p style={{fontSize: 16, color: "#262626", paddingTop: 20, marginBottom: 4}}>
            <Icon type="loading-3-quarters" spin style={{marginRight: 8}}/>
            分析中，请勿离开当前页
          </p>
        }
        <span style={{color: 'rgba(0,0,0,0.43)'}}>{fileTips}</span>
      </div>
    }
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>安装包</BreadcrumbItem>
          <BreadcrumbItem><Link to="/packageMonitor">包体监测</Link></BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          {platform === 2 &&
            <Card title="包体自检 ">
              <Dragger style={{padding: "40px 0px"}}
                       name='file'
                       disabled={uploading}
                       accept=".ipa"
                       beforeUpload={(file, fileList) => {
                         this.beforeUpload(file, fileList, 'ipa')
                       }}
                       onRemove={(file) => {
                         this.onRemove(file, 'ipa')
                       }}
                       fileList={fileList.api}
              >
                {getDraggerContext('ipa')}
              </Dragger>
            </Card>
          }
          {platform === 1 &&
          <Card title={<div>
            <span>包体自检</span>
            <Popover
              content={<p className='package-info'>【R.txt文件】：app\build\intermediates\symbols\normal\debug\R.txt</p>}
              trigger="hover">
              <Button
                type="primary"
                ghost={true}
                shape="circle"
                icon="info"
                style={{fontSize: 12, marginLeft: 16, width: 18, height: 18}}/>
            </Popover>
          </div>}>
            <Row>
              <Col span={11}>
                <Dragger style={{padding: "40px 0px"}}
                         name='file'
                         disabled={uploading}
                         accept=".apk"
                         beforeUpload={(file, fileList) => {
                           this.beforeUpload(file, fileList, 'apk')
                         }}
                         onRemove={(file) => {
                           this.onRemove(file, 'apk')
                         }}
                         fileList={fileList.apk}
                >
                  {getDraggerContext('apk')}
                </Dragger>
              </Col>
              <Col span={11} offset={2}>
                <Dragger style={{padding: "40px 0px"}}
                         name='file'
                         disabled={uploading}
                         accept=".txt"
                         beforeUpload={(file, fileList) => {
                           this.beforeUpload(file, fileList, 'txt')
                         }}
                         onRemove={(file) => {
                           this.onRemove(file, 'txt')
                         }}
                         fileList={fileList.txt}
                >
                  {getDraggerContext('txt')}
                </Dragger>
              </Col>
            </Row>
            <Button type="primary" className='analysis-btn'>开始分析</Button>
          </Card>
          }
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
