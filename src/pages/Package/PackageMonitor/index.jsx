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
  Popover
} from 'antd'
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const Panel = Collapse.Panel;

class PackageMonitor extends Component {
  constructor() {
    super();
    this.state = {
      chartData: [
        {
          version: 'V3.3.1',
          name: '包大小',
          size: 20
        },
        {
          version: 'V3.3.2',
          name: '包大小',
          size: 10
        },
        {
          version: 'V3.3.3',
          name: '包大小',
          size: 15
        },
        {
          version: 'V3.3.4',
          name: '包大小',
          size: 25
        },
        {
          version: 'V3.3.1',
          name: '加固包大小',
          size: 5
        },
        {
          version: 'V3.3.2',
          name: '加固包大小',
          size: 13
        },
        {
          version: 'V3.3.3',
          name: '加固包大小',
          size: 10
        },
        {
          version: 'V3.3.4',
          name: '加固包大小',
          size: 8
        },
        {
          version: 'V3.3.1',
          name: '总资源大小',
          size: 50
        },
        {
          version: 'V3.3.2',
          name: '总资源大小',
          size: 30
        },
        {
          version: 'V3.3.3',
          name: '总资源大小',
          size: 40
        },
        {
          version: 'V3.3.4',
          name: '总资源大小',
          size: 80
        },
        {
          version: 'V3.3.1',
          name: '重复资源总大小',
          size: 20
        },
        {
          version: 'V3.3.2',
          name: '重复资源总大小',
          size: 22
        },
        {
          version: 'V3.3.3',
          name: '重复资源总大小',
          size: 35
        },
        {
          version: 'V3.3.4',
          name: '重复资源总大小',
          size: 25
        },
        {
          version: 'V3.3.1',
          name: '超大图片总大小',
          size: 34
        },
        {
          version: 'V3.3.2',
          name: '超大图片总大小',
          size: 23
        },
        {
          version: 'V3.3.3',
          name: '超大图片总大小',
          size: 10
        },
        {
          version: 'V3.3.4',
          name: '超大图片总大小',
          size: 30
        },
        {
          version: 'V3.3.1',
          name: '无用资源总大小',
          size: 2
        },
        {
          version: 'V3.3.2',
          name: '无用资源总大小',
          size: 20
        },
        {
          version: 'V3.3.3',
          name: '无用资源总大小',
          size: 12
        },
        {
          version: 'V3.3.4',
          name: '无用资源总大小',
          size: 8
        }
      ],
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
      }
    }
  }

  componentWillMount() {
  }

  render() {
    const {chartData, modalVisible, columns, tableData, pagination, currentData, keyName} = this.state
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
          <BreadcrumbItem>包体监测</BreadcrumbItem>
        </Breadcrumb>
        <div className="content-container">
          <Card
            title="最近一次监测（Merge-Request流水线、v5.4.6、origin/develop_td）"
            className="gray-feature"
            extra={
              <div>
                <Popover content={<p style={{width: 180, marginBottom: 0}}>【资源】：此处资源，仅表示图片，包括png、jpg</p>}
                         trigger="hover">
                  <Button type="primary" ghost={true} shape="circle" icon="question"
                          style={{fontSize: 12, marginRight: 24,width:20,height:20}}/>
                </Popover>
                <Button type="primary"><Link to="/packageSelfCheck">包体自检</Link></Button>
              </div>
            }>
            {dataList(currentData)}
          </Card>
          <Card
            title="各版本最后一次数据对比"
            style={{marginTop: 24}}>
            <Chart data={chartData}/>
          </Card>
          <Collapse
            defaultActiveKey={['1']}
            className='panel-container'>
            <Panel header="This is panel header 1" key="1">
              {dataList(currentData)}
            </Panel>
          </Collapse>
          <Collapse
            className='panel-container'>
            <Panel header="This is panel header 1" key="1">
              {dataList(currentData)}
            </Panel>
          </Collapse>
          <Collapse
            className='panel-container'>
            <Panel header="This is panel header 1" key="1">
              {dataList(currentData)}
            </Panel>
          </Collapse>
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

PackageMonitor = connect((state) => {
  return {
    projectId: state.project.projectId
  }
})(PackageMonitor)

export default PackageMonitor

