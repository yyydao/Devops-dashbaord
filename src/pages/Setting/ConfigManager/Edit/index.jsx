
import React, { Component } from 'react';
import { Input, Icon } from 'antd';

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
                            <a onClick={()=>{this.setState({editing: false});handleConfirm(newValue,panelIndex,name)}}>保存</a>
                            <a onClick={()=>{this.setState({editing: false})}}>取消</a>
                        </span>
                    ) : (
                        <span>
                            <span style={{paddingRight: 24}}>{defaultValue}</span>
                            <Icon type="form" style={{fontSize:14,color:"#1890ff",cursor:"pointer",padding:8}} onClick={()=>{this.setState({editing: true})}}/>
                        </span>
                    )
                }
            </span>
        )
    }
}
