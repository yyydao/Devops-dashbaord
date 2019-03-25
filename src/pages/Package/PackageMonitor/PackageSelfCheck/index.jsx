import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {reqPost, reqPostFormData} from '@/api/api'
import {
  Breadcrumb,
  Card,
  Button,
  Icon,
  Modal,
  Table,
  Row,
  Col,
  Upload,
  message,
  Popover,
  Spin
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
          dataIndex: 'resourcePath',
          key: 'resourcePath',
          width: '80%',
          render: (text) => {
            let snArray=[];
            snArray=text.split(",");

            let br=<br></br>;
            let result=null;
            if(snArray.length<2){
              return text;
            }

            for(let i=0;i<snArray.length;i++){
              if(i===0){
                result=snArray[i]
              }else{
                result=<span>{result}{br}{snArray[i]}</span>
              }
            }
            return <div>{result}</div>
          }
        },
        {
          title: '大小(KB)',
          dataIndex: 'resourceSize',
          key: 'resourceSize',
          width: '20%',
          align: 'center'
        }
      ],
      resourceList: [],
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: null
      },
      keyName: {
        totalSize: '包大小',
        reinforceSize: '加固包大小',
        resourceSize: '总资源大小',
        resourceRatio: '资源总占比',
        repeatResourceSize: '重复资源总大小',
        repeatResourceRatio: '重复资源占比',
        repeatResourcesQuantity: '重复资源个数',
        repeatResourcesMark: '重复资源已标记',
        imageSize: '超大图片总大小',
        imageRatio: '超大图片占比',
        imageResourcesQuantity: '超大图片个数',
        imageResourcesMark: '超大图片已标记',
        uselessResourceSize: '无用资源总大小',
        uselessResourceRatio: '无用资源占比',
        uselessResourcesQuantity: '无用资源个数',
        uselessResourcesMark: '无用资源已标记'
      },
      currentData: null,
      ipaList:[],
      apkList:[],
      txtList:[],
      platform: '',
      uploading: false,
      showLoading: false,
      //资源列表参数
      resourceParams: {
        limit: 10,
        page: 1,
        //资源文件类型：1-重复资源；2-超大图片资源；3-无用资源
        resourceType: 1,
      },
      confirmLoading: false,
      modalTitle: '',
      modalTitleList: ['重复资源列表', '超大图片列表', '无用资源列表']
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
    let {uploading} = this.state
    if(type==='ipa'){
      let ipaList = this.state.ipaList
      if (ipaList.length === 1) {
        message.error("只支持上传一个文件")
      } else {
        ipaList.push(file)
        uploading = true
        this.setState({ipaList, uploading})
      }
    }
    if(type==='txt'){
      let txtList = this.state.txtList
      if (txtList.length === 1) {
        message.error("只支持上传一个文件")
      } else {
        txtList.push(file)
        this.setState({txtList, uploading})
      }
    }
    if(type==='apk'){
      let apkList = this.state.apkList
      if (apkList.length === 1) {
        message.error("只支持上传一个文件")
      } else {
        apkList.push(file)
        this.setState({apkList, uploading})
      }
    }
    return false
  }

  /**
   * @desc 文件移除事件
   */
  onRemove = (file, type) => {
    if(type==='ipa'){
      let ipaList = this.state.ipaList
      const index = ipaList.indexOf(file);
      ipaList.splice(index, 1)
      this.setState({ipaList});
    }
    if(type==='apk'){
      let apkList = this.state.apkList
      const index = apkList.indexOf(file);
      apkList.splice(index, 1)
      this.setState({apkList});
    }
    if(type==='txt'){
      let txtList = this.state.txtList
      const index = txtList.indexOf(file);
      txtList.splice(index, 1)
      this.setState({txtList});
    }
  }

  /**
   * @desc android自检
   */
  onPackageSelfCheck = () => {
    if (this.state.apkList.length === 0) {
      message.warning('请上传安装包')
      return
    }
    this.setState({showLoading: true}, () => {
      let formData = new FormData();
      formData.append('files', this.state.apkList[0])
      formData.append('files', this.state.txtList[0])
      formData.append('projectId', this.props.projectId)
      reqPostFormData('/packageBody/selfCheck', formData).then(res => {
        if (parseInt(res.code, 0) === 0) {
          message.success("分析成功")
          this.setState({currentData: res.data})
        } else {
          message.error(res.msg)
        }
        this.setState({showLoading: false})
      })
    })
  }

  /**
   * @desc ios自检
   */
  onIOSPackageSelfCheck = () => {
    if (this.state.ipaList.length === 0) {
      message.warning('请上传安装包')
    }
    this.setState({uploading: true}, () => {
      let formData = new FormData();
      formData.append('files', this.state.ipaList[0])
      formData.append('projectId', this.props.projectId)
      reqPostFormData('/packageBody/selfCheck', formData).then(res => {
        if (parseInt(res.code, 0) === 0) {
          message.success("自检成功")
          this.setState({currentData: res.data})
        } else {
          message.error(res.msg)
        }
        this.setState({uploading: false})
      })
    })
  }
  /**
   * @desc 显示资源modal事件
   */
  showResourceList = (type) => {
    let resourceParams = this.state.resourceParams
    resourceParams.resourceType = type
    resourceParams.page = 1
    this.setState({
      resourceParams,
      modalVisible: true,
      confirmLoading: true,
      modalTitle: this.state.modalTitleList[type - 1]
    }, () => {
      this.getResourceList()
    })
  }
  /**
   * @desc 包体监控/资源文件分页列表查询
   */
  getResourceList = () => {
    let {pagination, resourceParams, currentData} = this.state
    let total = 0, current = resourceParams.page, resourceList = []
    if (resourceParams.resourceType === 1) {
      total = currentData.repeatResources.length
      resourceList = currentData.repeatResources.slice((current - 1) * 10, (current - 1) * 10 + 10)
    } else if (resourceParams.resourceType === 2) {
      total = currentData.imageResources.length
      resourceList = currentData.imageResources.slice((current - 1) * 10, (current - 1) * 10 + 10)
    } else {
      total = currentData.uselessResources.length
      resourceList = currentData.uselessResources.slice((current - 1) * 10, (current - 1) * 10 + 10)
    }
    pagination.total = total;
    pagination.current = current
    pagination.showTotal = () => {
      return '共 ' + total + ' 条';
    };
    this.setState({
      pagination,
      resourceParams,
      resourceList,
      confirmLoading: false
    })
  }
  /**
   * @desc 资源列表分页改变事件
   */
  handleTableChange = (pagination) => {
    const resourceParams = {...this.state.resourceParams};
    if (pagination) {
      resourceParams.page = pagination.current;
    } else {
      resourceParams.page = 1;
    }
    this.setState({resourceParams}, this.getResourceList);
  }

  render() {
    const {
      modalVisible,
      columns,
      modalTitle,
      pagination,
      currentData,
      keyName,
      uploading,
      platform,
      showLoading,
      confirmLoading,
      resourceList,
      ipaList,
      apkList,
      txtList
    } = this.state
    let dataList = (data) => {
      let list = [[], [], [], []], color = ['red', 'yellow', 'green', 'blue']
      for (let i in keyName) {
        let index = 0,
          isClick = (keyName[i].indexOf("个数") > -1 || keyName[i].indexOf("已标记") > -1),
          isPercent = keyName[i].indexOf("占比") > -1 ? '%' : ''
        if (keyName[i].indexOf("重复资源") > -1) {
          index = 1
        } else if (keyName[i].indexOf("超大图片") > -1) {
          index = 2
        } else if (keyName[i].indexOf("无用资源") > -1) {
          index = 3
        }
        if (data[i] !== 0 && !data[i]) {
          list[index].push(
            <Col span={6} key={i}>
              <div className="data-item-white">
                <p>--</p>
                <p>--</p>
              </div>
            </Col>
          )
        } else {
          if (index !== 0 && isClick && data[i] !== 0) {
            list[index].push(
              <Col span={6} key={i}>
                <div className={`data-item-${color[index]} can-click`} onClick={() => {
                  this.showResourceList(index)
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
                  <p>{data[i]}{isPercent}</p>
                </div>
              </Col>
            )
          }
        }
      }
      list.map(item => <Row style={{width: "100%"}}>{item}</Row>)
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
                     customRequest={() => {
                       this.onIOSPackageSelfCheck()
                     }}
                     fileList={ipaList}
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
            <Spin
              spinning={showLoading}
              tip="分析中，请稍等...">
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
                           customRequest={() => {
                           }}
                           fileList={apkList}
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
                           fileList={txtList}
                           customRequest={() => {
                           }}
                  >
                    {getDraggerContext('txt')}
                  </Dragger>
                </Col>
              </Row>
              <Button type="primary" className='analysis-btn' onClick={() => {
                this.onPackageSelfCheck()
              }}>开始分析</Button>
            </Spin>
          </Card>
          }
          {currentData &&
          <Card
            title="包体监测结果 "
            style={{marginTop: 24}}>
            {dataList(currentData)}
          </Card>
          }
        </div>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          width={1000}
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
            dataSource={resourceList}
            rowKey={record => record.id}
            pagination={pagination}
            onChange={this.handleTableChange}/>
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
