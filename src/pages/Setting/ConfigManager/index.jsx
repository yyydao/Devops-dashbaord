import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Breadcrumb, Modal, message, Tabs, Input} from 'antd';

import {reqPost, reqGet} from '@/api/api';
import './index.scss';
import ConfigPanel from '@/pages/Setting/ConfigManager/ConfigPanel';

const BreadcrumbItem = Breadcrumb.Item;
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea

class ConfigManager extends Component {
  constructor() {
    super();
    this.state = {
      envList: [],
      envData: [],
      visible: false,
      importJson: '',
      importIndex: 0
    }
  }

  componentWillMount() {
    this.getEnvList();
  }

  /**
   * @desc 获取环境列表
   */
  getEnvList = () => {
    const {projectId} = this.props;
    reqGet('/env/list', {projectId}).then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.setState({envList: res.data});
        res.data.map((item, index) => this.getEnvDetail(item.id, index))
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 获取环境详情
   * @param envId 环境ID
   */
  getEnvDetail = (envId, index) => {
    reqGet('/env/envDetails', {
      envId: envId
    }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        let envData = this.state.envData
        res.data.envId = envId

        /**由于后台不给加全选字段，只能自己添加一个全选**/
        if(res.data.scenes.length>0){
          let obj = {}, arr = [];
          obj.name = "全选";
          obj.scenario = "all"
          obj.childrens = res.data.scenes
          arr.push(obj)
          res.data.scenes = arr
          /**数据处理结束**/
        }
        envData.push(res.data)
        this.setState({envData})
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 场景选中事件
   * @param checkedScenes array 选中的场景id集合
   */
  onCheck = (checkedScenes, index) => {
    let envData=this.state.envData
    envData[index].checkedScenes=checkedScenes
    this.setCheckedSenses(this.state.envData[index].scenes, checkedScenes)
    this.setState({envData})
  }

  /**
   * @desc 场景点击事件
   * @param selectedKeys array 点中的场景id集合
   * @param info obj 点中的场景信息
   * @param index num 环境下标
   */
  onSelect = (selectedKeys, info, index) => {
    console.log('onSelect', selectedKeys, info, index);
  }

  /**
   * @desc 文本编辑事件
   * @param value string 文本编辑内容
   * @param key string 文本编辑字段
   * @param index num 环境下标
   */
  changeEdit = (value, index, key) => {
    let envData = this.state.envData
    envData[index][key] = value
    this.setState({envData})
  }

  /**
   * @desc switch事件
   * @param value boolean switch事件的值
   * @param type string switch事件字段
   * @param index num 环境下标
   */
  changeSwitch = (value, index, type) => {
    let envData = this.state.envData
    envData[index][type] = value ? 1 : 0
    this.setState({envData})
  }

  /**
   * @desc 保存按钮事件
   * @param index num 环境下标
   */
  onButtonClick = (index) => {
    let envData = JSON.parse(JSON.stringify(this.state.envData[index]))
    let arr=[]
    if(envData.scenes.length>0){
      envData.scenes=envData.scenes[0].childrens
      delete envData.checkedScenes
    }
    arr.push(envData)
    reqPost('/env/updateEnv', arr).then(res => {
      if (parseInt(res.code, 0) === 0) {
        message.success("保存成功");
      } else {
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 导入JSON
   */
  onImportJson = (importIndex) => {
    this.setState({
      visible: true,
      importIndex: importIndex
    })
  }

  /**
   * @desc 导入JSON确定按钮
   */
  handleOk = () => {
    if (this.isJSON(this.state.importJson)) {
      let obj = JSON.parse(this.state.importJson)

      /**由于后台不给加全选字段，只能自己添加一个全选**/
      let object = {}, arr = [];
      object.name = "全选";
      object.scenario = "all"
      object.childrens = obj
      arr.push(object)
      obj = arr
      /**数据处理结束**/

      let envData = JSON.parse(JSON.stringify(this.state.envData))
      envData[this.state.importIndex].scenes = obj
      envData[this.state.importIndex].checkedScenes= []
      this.setState({
        envData: envData,
        visible: false
      })
    } else {
      message.error("您输入的不是JSON格式，请检查")
    }
  }
  /**
   * @desc 判断字符串是不是JSON格式
   * @param str 被判断的字符串
   */
  isJSON = (str) => {
    if (typeof str === 'string') {
      try {
        let obj = JSON.parse(str)
        if (typeof obj === 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    }
  }

  /**
   * @desc 给被check的场景的checked属性赋值
   */
  setCheckedSenses = (data, checkedKey) => {
    data.map(item => {
      if (checkedKey.indexOf(item.scenario) > -1) {
        item.checked = true
      } else {
        item.checked = false
      }
      if (item.childrens) {
        this.setCheckedSenses(item.childrens, checkedKey)
      }
      return item
    })
  }

  render() {
    const {envData, visible, importJson } = this.state;
    return (
        <div>
          <Breadcrumb className="devops-breadcrumb">
            <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
            <BreadcrumbItem>配置管理</BreadcrumbItem>
          </Breadcrumb>
          <div className="content-container">
            <Tabs style={{backgroundColor:"#fff"}}>
              {envData &&
              envData.map((item, index) =>
                <TabPane tab={item.name} key={index} style={{padding: 16}}>
                  <ConfigPanel
                    isCheckAll={''}
                    envData={item}
                    panelIndex={index}
                    treeCheck={this.onCheck}
                    treeSelect={this.onSelect}
                    changeEdit={this.changeEdit}
                    changeSwitch={this.changeSwitch}
                    onButtonClick={this.onButtonClick}
                    onImportJson={this.onImportJson}
                  >
                  </ConfigPanel>
                </TabPane>
              )
              }
            </Tabs>
          </div>
          <Modal
              title="请输入JSON"
              visible={visible}
              onOk={this.handleOk}
              onCancel={() => {
                this.setState({importJson: '', visible: false})
              }}>
            <TextArea autosize value={importJson} onChange={(e) => {
              this.setState({importJson: e.target.value})
            }}></TextArea>
          </Modal>
        </div>
    )
  }
}

export default connect(state => {
  return {
    projectId: state.projectId
  }
}, {})(ConfigManager);
