import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {reqPost, reqGet} from '@/api/api'
import Chart from './chart'
import {
  Breadcrumb,
  Collapse,
  Card,
  Button,
  Icon,
  Modal,
  Table,
  Checkbox,
  Row,
  Col,
  Popover,
  Divider,
  message
} from 'antd'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const Panel = Collapse.Panel;

class PackageMonitor extends Component {
  constructor() {
    super();
    this.state = {
      // chartData: [
      //   {
      //     version: 'V3.3.1',
      //     name: '包大小',
      //     size: 20
      //   },
      //   {
      //     version: 'V3.3.2',
      //     name: '包大小',
      //     size: 10
      //   },
      //   {
      //     version: 'V3.3.3',
      //     name: '包大小',
      //     size: 15
      //   },
      //   {
      //     version: 'V3.3.4',
      //     name: '包大小',
      //     size: 25
      //   },
      //   {
      //     version: 'V3.3.1',
      //     name: '加固包大小',
      //     size: 5
      //   },
      //   {
      //     version: 'V3.3.2',
      //     name: '加固包大小',
      //     size: 13
      //   },
      //   {
      //     version: 'V3.3.3',
      //     name: '加固包大小',
      //     size: 10
      //   },
      //   {
      //     version: 'V3.3.4',
      //     name: '加固包大小',
      //     size: 8
      //   },
      //   {
      //     version: 'V3.3.1',
      //     name: '总资源大小',
      //     size: 50
      //   },
      //   {
      //     version: 'V3.3.2',
      //     name: '总资源大小',
      //     size: 30
      //   },
      //   {
      //     version: 'V3.3.3',
      //     name: '总资源大小',
      //     size: 40
      //   },
      //   {
      //     version: 'V3.3.4',
      //     name: '总资源大小',
      //     size: 80
      //   },
      //   {
      //     version: 'V3.3.1',
      //     name: '重复资源总大小',
      //     size: 20
      //   },
      //   {
      //     version: 'V3.3.2',
      //     name: '重复资源总大小',
      //     size: 22
      //   },
      //   {
      //     version: 'V3.3.3',
      //     name: '重复资源总大小',
      //     size: 35
      //   },
      //   {
      //     version: 'V3.3.4',
      //     name: '重复资源总大小',
      //     size: 25
      //   },
      //   {
      //     version: 'V3.3.1',
      //     name: '超大图片总大小',
      //     size: 34
      //   },
      //   {
      //     version: 'V3.3.2',
      //     name: '超大图片总大小',
      //     size: 23
      //   },
      //   {
      //     version: 'V3.3.3',
      //     name: '超大图片总大小',
      //     size: 10
      //   },
      //   {
      //     version: 'V3.3.4',
      //     name: '超大图片总大小',
      //     size: 30
      //   },
      //   {
      //     version: 'V3.3.1',
      //     name: '无用资源总大小',
      //     size: 2
      //   },
      //   {
      //     version: 'V3.3.2',
      //     name: '无用资源总大小',
      //     size: 20
      //   },
      //   {
      //     version: 'V3.3.3',
      //     name: '无用资源总大小',
      //     size: 12
      //   },
      //   {
      //     version: 'V3.3.4',
      //     name: '无用资源总大小',
      //     size: 8
      //   }
      // ],
      chartData: [],
      modalVisible: false,
      columns: [
        {
          title: '资源名称',
          dataIndex: 'resourcePath',
          key: 'resourcePath',
          width: '50%',
          render: (text) => <p style={{wordBreak: 'break-all', marginBottom: 0}}>{text}</p>
        },
        {
          title: '大小(KB)',
          dataIndex: 'resourceSize',
          key: 'resourceSize',
          width: '10%'
        },
        {
          title: '次数',
          dataIndex: 'quantity',
          key: 'quantity',
          width: '10%'
        },
        {
          title: '标记',
          dataIndex: 'status',
          key: 'status',
          width: '10%',
          render: (text, record, index) => <Checkbox checked={text} onChange={(e) => {
            this.onMarkChanged(e.target.checked, record, index)
          }}/>
        },
        {
          title: '标记时间',
          dataIndex: 'markTime',
          key: 'markTime',
          width: '20%'
        }
      ],
      resourceList: [],
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: null
      },
      packageList: [],
      keyName: {
        totalSize: '包大小',
        reinforceSize: '加固包大小',
        resourceSize: '总资源大小',
        resourceRatio: '资源总占比',
        repeatResourceSize: '重复资源总大小',
        repeatResourceRatio: '重复资源占比',
        repeatResourcesQuantity: '重复资源个数',
        repeatResourcesMark: '重复资源已标注',
        imageSize: '超大图片总大小',
        imageRatio: '超大图片占比',
        imageResourcesQuantity: '超大图片个数',
        imageResourcesMark: '超大图片已标注',
        uselessResourceSize: '无用资源总大小',
        uselessResourceRatio: '无用资源占比',
        uselessResourcesQuantity: '无用资源个数',
        uselessResourcesMark: '无用资源已标注'
      },
      currentData: null,
      //列表分页参数
      currentPage: 1,
      totalPage: 1,
      moreLoading: false,
      //资源列表参数
      resourceParams: {
        limit: 10,
        page: 1,
        //资源文件类型：1-重复资源；2-超大图片资源；3-无用资源
        resourceType: 1,
        packageId: ''
      },
      confirmLoading: false,
      markChangedList: [],
      modalTitle: '',
      modalTitleList: ['重复资源列表', '超大图片列表', '无用资源列表']
    }
  }

  componentWillMount() {
    this.getChartData()
    this.getPackageList()
  }

  /**
   * @desc 包体监控 / 包体监测-各版本最后一次数据对比(图表数据)
   */
  getChartData = () => {
    reqGet('/packageBody/lastReport', {projectId: this.props.projectId}).then(res => {
      if (res.code === 0) {
        this.dealChartData(res.data.reportContrastDtos)
        this.setState({currentData: res.data.bodyMonitorDtos})
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 处理图表数据
   */
  dealChartData = (data) => {
    let chartData = []
    data.map(item => {
      let version = item.versionName
      for (let index in item) {
        if (index === 'versionName') {
          continue
        }
        let obj = {}
        obj.version = version
        switch (index) {
          case 'totalSize':
            obj.name = '包大小'
            break
          case 'reinforceSize':
            obj.name = '加固包大小'
            break
          case 'resourceSize':
            obj.name = '资源总大小'
            break
          case 'repeatResourceSize':
            obj.name = '重复资源大小'
            break
          case 'imageSize':
            obj.name = '超大图片总大小'
            break
          case 'uselessResourceSize':
            obj.name = '无用资源大小'
            break
          default:
            break
        }
        obj.size = item[index]
        chartData.push(obj)
      }
      return item
    })
    this.setState({chartData})
  }

  /**
   * @desc 获取包体列表
   */
  getPackageList = () => {
    let {packageList} = this.state
    reqGet('/packageBody/listByPage', {
      limit: 5,
      page: this.state.currentPage,
      projectId: this.props.projectId
    }).then(res => {
      if (res.code === 0 && res.data) {
        packageList = [...packageList, ...res.data.list]
        this.setState({
          totalPage: res.data.totalPage,
          packageList,
          moreLoading: false
        })
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 包体监控/资源文件分页列表查询
   */
  getResourceList = () => {
    reqGet('/packageBody/listByResourcePage', this.state.resourceParams).then(res => {
      if (res.code === 0) {
        const pagination = {...this.state.pagination};
        const resourceParams = {...this.state.resourceParams};
        pagination.total = res.data.totalCount;
        pagination.current = res.data.currPage;
        pagination.showTotal = () => {
          return '共 ' + res.data.totalCount + ' 条';
        };
        this.setState({
          pagination,
          resourceParams
        }, () => {
          this.dealResourceList(res.data.list)
        })
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 处理资源列表数据
   */
  dealResourceList = (data) => {
    data.map(item => {
      let markChangedList = this.state.markChangedList
      markChangedList.map(item1 => {
        if (item1.id === item.id) {
          item.status = item1.status
        }
        return item1
      })
      return item
    })
    this.setState({
      resourceList: data,
      confirmLoading: false
    })
  }

  /**
   * @desc 显示资源modal事件
   */
  showResourceList = (type, id) => {
    let resourceParams = this.state.resourceParams
    resourceParams.resourceType = type
    resourceParams.packageId = id
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

  /**
   * @desc 标记改变事件
   */
  onMarkChanged = (e, record, index) => {
    let {markChangedList, resourceList} = this.state
    resourceList[index].status = e ? 1 : 0
    let exist = false
    markChangedList.map(item => {
      if (item.id === record.id) {
        item.status = e ? 1 : 0
        exist = true
      }
      return item
    })
    if (!exist) {
      let obj = {
        projectId: this.props.projectId,
        status: e ? 1 : 0,
        id: record.id
      }
      markChangedList.push(obj)
    }
    this.setState({markChangedList, resourceList})
  }

  /**
   * @desc 提交标记数据
   */
  updateMarkStatus = () => {
    this.setState({confirmLoading: true}, () => {
      reqPost('/packageBody/updateMarkStatus', this.state.markChangedList).then(res => {
        if (res.code === 0) {
          message.success('标记成功');
          this.setState({modalVisible: false})
        } else {
          message.error(res.msg);
        }
      })
    })
  }
  /**
   * @desc 加载更多
   */
  loadMorePackage = () => {
    this.setState({
      currentPage: this.state.currentPage + 1,
      moreLoading: true
    }, () => {
      this.getPackageList()
    })
  }

  render() {
    const {
      chartData,
      modalVisible,
      columns,
      resourceList,
      pagination,
      currentData,
      keyName,
      currentPage,
      totalPage,
      moreLoading,
      packageList,
      confirmLoading,
      modalTitle
    } = this.state
    let dataList = (data) => {
      let list = [[], [], [], []], color = ['red', 'yellow', 'green', 'blue']
      for (let i in keyName) {
        let index = 0,
          isClick = (keyName[i].indexOf("个数") > -1 || keyName[i].indexOf("已标注") > -1),
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
          if (index !== 0 && isClick) {
            list[index].push(
              <Col span={6} key={i}>
                <div className={`data-item-${color[index]} can-click`} onClick={() => {
                  this.showResourceList(index, data.id)
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
    let lastCheckTitle = () => {
      if (currentData) {
        return `最近一次监测（${currentData.taskName}、v${currentData.versionName}、${currentData.branchName}）`
      }
      return '最近一次监测'
    }
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>安装包</BreadcrumbItem>
          <BreadcrumbItem>包体监测</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <Card
            title={lastCheckTitle()}
            className="gray-feature"
            extra={
              <div>
                <Popover content={<p style={{width: 180, marginBottom: 0}}>【资源】：此处资源，仅表示图片，包括png、jpg</p>}
                         trigger="hover">
                  <Button type="primary" ghost={true} shape="circle" icon="question"
                          style={{fontSize: 12, marginRight: 24, width: 20, height: 20}}/>
                </Popover>
                <Button type="primary"><Link to="/packageSelfCheck">包体自检</Link></Button>
              </div>
            }>
            {currentData && dataList(currentData)}
          </Card>
          {chartData.length > 0 &&
          <Card
            title="各版本最后一次数据对比"
            style={{marginTop: 24}}>
            <Chart data={chartData}/>
          </Card>
          }
          {packageList.length > 0 && packageList.map((item, index) =>
            <Collapse
              key={index}
              className='panel-container'>
              <Panel
                header={`${item.taskTime}  （${item.taskName || ''}、v${item.versionName || ''}、${item.branchName || ''}）`}
                key="1">
                {dataList(item)}
              </Panel>
            </Collapse>
          )}
          {(currentPage < totalPage) && !moreLoading &&
          <Divider><Button type="primary" style={{margin: '24px auto'}} onClick={() => {
            this.loadMorePackage()
          }}>加载更多</Button></Divider>
          }
          {(currentPage >= totalPage) && !moreLoading && totalPage!==0&&
          <Divider><p style={{margin: '24px 0px',color:'#ccc'}}>我是有底线的~</p></Divider>
          }
          {moreLoading &&
          <Divider style={{margin: '24px 0px'}}><Icon type="loading-3-quarters" spin/></Divider>
          }
        </div>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          width={1000}
          onOk={() => {
            this.updateMarkStatus()
          }}
          onCancel={() => {
            this.setState({modalVisible: false, markChangedList: []})
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

PackageMonitor = connect((state) => {
  return {
    projectId: state.project.projectId
  }
})(PackageMonitor)

export default PackageMonitor

