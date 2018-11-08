import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Col, Switch, message, Tabs, Form,} from 'antd';

import { reqPost, reqGet } from '@/api/api';
import './index.scss';
import ConfigPanel from '@/pages/Setting/ConfigManager/ConfigPanel';

const BreadcrumbItem = Breadcrumb.Item;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class ConfigManager extends Component{
    constructor(){
        super();
        this.state = {
          envList: [],
          envData: []
        }
    }

    componentWillMount(){
        this.getEnvList();
    }
  /**
   * @desc 获取环境列表
   */
    getEnvList = () => {
      const { projectId } = this.props;
      console.log(this.props)
      reqGet('/env/list',{projectId}).then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({ envList: res.data });
                res.data.map(item=>{
                  this.getEnvDetail(item.id)
                })
            }else{
                message.error(res.msg);
            }
        })
    }

  /**
   * @desc 获取环境详情
   * @param envId 环境ID
   */
    getEnvDetail = (envId) => {
      reqGet('/env/envDetails',{
        envId:envId
      }).then(res => {
        if(parseInt(res.code, 0) === 0){
           let envData =this.state.envData
          res.data.envId = envId
          envData.push(res.data)
          this.setState({envData});
        }else{
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
      this.setState({envData})
    }

  /**
   * @desc 场景点击事件
   * @param selectedKeys array 点中的场景id集合
   * @param info obj 点中的场景信息
   * @param index num 环境下标
   */
    onSelect = (selectedKeys, info, index) => {
      console.log('onSelect',selectedKeys, info, index);
    }

  /**
   * @desc 文本编辑事件
   * @param value string 文本编辑内容
   * @param key string 文本编辑字段
   * @param index num 环境下标
   */
    changeEdit = (value, key, index) =>{
      let envData=this.state.envData
      envData[index][key]=value
      this.setState({envData})
    }

  /**
   * @desc switch事件
   * @param value boolean switch事件的值
   * @param type string switch事件字段
   * @param index num 环境下标
   */
    changeSwitch = (value, type, index) =>{
      let envData=this.state.envData
      envData[index][type]=value?1:0
      this.setState({envData})
    }

  /**
   * @desc 保存按钮事件
   * @param index num 环境下标
   */
    onButtonClick = (index) => {
      let envData = JSON.parse(JSON.stringify(this.state.envData[index]))
      let scenes = envData.checkedScenes.map(item=>{
        let obj = {}
        obj.envId = envData.envId
        obj.sceneId = item
        return obj
      })
      envData.scenes = scenes
      reqPost('/env/updateEnv',envData).then(res => {
        if(parseInt(res.code, 0) === 0){
          message.success(res.msg);
        }else{
          message.error(res.msg);
        }
      })
    }

    render(){
        const { envData} = this.state;
        return(
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>配置管理</BreadcrumbItem>
                </Breadcrumb>
              <Tabs type="card">
                {envData&&
                    envData.map((item,index) =>
                      <TabPane tab={item.name} key={index} style={{padding:16}}>
                        <ConfigPanel
                            envData={item}
                            panelIndex={index}
                            treeCheck={this.onCheck}
                            treeSelect={this.onSelect}
                            changeEdit={this.changeEdit}
                            changeSwitch={this.changeSwitch}
                            onButtonClick={this.onButtonClick}
                        >
                        </ConfigPanel>
                      </TabPane>
                    )
                }
              </Tabs>
            </div>
        )
    }
}
export default connect(state => {
  return {
    projectId: state.projectId
  }
}, {})(ConfigManager);