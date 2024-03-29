import React, { Component } from 'react';
import { Card, Tree, Switch, Button} from 'antd';
import Edit from '@/pages/Setting/ConfigManager/Edit';
const TreeNode = Tree.TreeNode;

export default class ConfigPanel extends Component{

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.childrens && item.childrens.length>0) {
        return (
            <TreeNode title={item.name} key={item.scenario} dataRef={item}>
              {this.renderTreeNodes(item.childrens)}
            </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.scenario} dataRef={item}/>;
    });
  }

  render(){
    const { envData, treeCheck, treeSelect, changeSwitch, changeEdit, panelIndex,onButtonClick,onImportJson, onImportydScan} = this.props;
    return(
        <div>
          <Card title="提测配置">
            <div className="config-project-item">
              <span className="name">Job名称：</span>
              <Edit
                  name='jenckinJob'
                  panelIndex={panelIndex}
                  defaultValue={envData.jenckinJob}
                  handleConfirm={changeEdit}/>
            </div>
            <div className="config-project-item">
              <span className="name">性能测试：</span>
              <Switch checked={envData.openTesting === 0 ? false : true} onChange={(e)=>{changeSwitch(e,panelIndex,'openTesting')}}/>
            </div>
            <div className="config-project-item">
              <span className="name">是否需要密码：</span>
              <Switch checked={envData.passwdBuild === 0 ? false : true} onChange={(e)=>{changeSwitch(e,panelIndex,'passwdBuild')}}/>
            </div>
          </Card>
          <Card title="性能测试配置" style={{marginTop:24}}>
            <div className="config-project-item">
              <span className="name">常规任务Job名称：</span>
              <Edit name='routineTaskName' panelIndex={panelIndex} defaultValue={envData.routineTaskName} handleConfirm={changeEdit}/>
            </div>
            <div className="config-project-item">
              <span className="name">定时任务Job名称：</span>
              <Edit name='timedTaskName' panelIndex={panelIndex} defaultValue={envData.timedTaskName} handleConfirm={changeEdit}/>
            </div>
            <div className="config-project-item">
              <span className="name">提测包任务Job名称：</span>
              <Edit name='submitTestTaskName' panelIndex={panelIndex} defaultValue={envData.submitTestTaskName} handleConfirm={changeEdit}/>
            </div>
          </Card>
          <Card title="场景管理"
                className="jsonInput"
                extra={<div><Button style={{marginRight:8}} onClick={()=>{onImportydScan(panelIndex)}}>云盾场景导入</Button><Button type="primary" onClick={()=>{onImportJson(panelIndex)}}>JSON导入</Button></div>}>
            <Tree
                checkable
                onCheck={(checkedKeys)=>{treeCheck(checkedKeys,panelIndex)}}
                onSelect={(selectedKeys, info)=>{treeSelect(selectedKeys, info,panelIndex)}}
                checkedKeys={envData.checkedScenes}
                defaultExpandAll={true}
            >
              {this.renderTreeNodes(envData.scenes)}
            </Tree>
          </Card>
          <Button type="primary" style={{marginTop:15,paddingLeft:24,paddingRight:24,cssFloat:'right'}} onClick={()=>{onButtonClick(panelIndex)}}>保存</Button>
        </div>
    )
  }
}
