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
          envData: [],
          testEnv: {
            "id": 88,
            "projectId": 62,
            "category": 0,
            "name": "111",
            "jenckinJob": "pTest0919",
            "passwdBuild": 0,
            "openTesting": 0,
            "routineTaskName": "pTest0919",
            "timedTaskName": "pTest0919",
            "submitTestTaskName": "pTest0919",
            "scenes": [
              {
                "sceneId": 69,
                "envId": 88,
                "projectId": 62,
                "name": "退出登录",
                "parentId": 1,
                "childrens": [
                  {
                    "sceneId": 115,
                    "envId": 88,
                    "projectId": 62,
                    "name": "zcq测试场景02",
                    "parentId": 69,
                    "childrens": []
                  },
                  {
                    "sceneId": 105,
                    "envId": 88,
                    "projectId": 62,
                    "name": "zcq测试场景03",
                    "parentId": 69,
                    "childrens": [{
                      "sceneId": 205,
                      "envId": 88,
                      "projectId": 62,
                      "name": "zcq测试场景04",
                      "parentId": 105,
                      "childrens": []
                    }]
                  }
                ]
              }
            ],
            "checkedScenes":[69, 115, 205, 105]
          }
        }
    }

    componentWillMount(){
        this.getEnvList();
    }

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
  onCheck = (checkedScenes,index) => {
    let envData=this.state.envData
    envData[index].checkedScenes=checkedScenes
    this.setState({envData})
  }
  onSelect = (selectedKeys, info, index) => {
    console.log('onSelect',selectedKeys, info, index);
  }
  changeEdit = (value,index,key) =>{
    let envData=this.state.envData
    envData[index][key]=value
    this.setState({envData})
  }
  changeSwitch = (value,index,type) =>{
    let envData=this.state.envData
    envData[index][type]=value?1:0
    this.setState({envData})
  }
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