
import React, { Component } from 'react';
import { Input, Popconfirm, Button } from 'antd';

export default class Edit extends Component{
  constructor(){
    super();
    this.state = {
      editing: false,
      newValue:''
    }
  }

    render(){
        const { defaultValue, handleConfirm, panelIndex, name} = this.props;
        const {editing, newValue} = this.state
        return(
            <span>
                {
                    editing ? (
                        <span>
                            <Input className="config-project-input" defaultValue={defaultValue} onChange={(e)=>{this.setState({newValue:e.target.value})}} />
                            <Popconfirm title="确定修改吗？" okText="确定" cancelText="取消" onConfirm={()=>{this.setState({editing: false});handleConfirm(newValue,panelIndex,name)}}>
                                <a>保存</a>
                            </Popconfirm>
                            <Popconfirm title="确定取消修改吗？" okText="确定" cancelText="取消" onConfirm={()=>{this.setState({editing: false})}}>
                                <a>取消</a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <span>
                            <span style={{width: 300}}>{defaultValue}</span>
                            <Button icon="edit" type="primary" onClick={()=>{this.setState({editing: true})}}></Button>
                        </span>
                    )
                }
            </span>
        )
    }
}