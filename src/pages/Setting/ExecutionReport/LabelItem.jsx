
import React, { Component } from 'react';
import { Input, Popconfirm, Button } from 'antd';

export default class Edit extends Component{
  constructor(){
    super();
  }

  render(){
    const {label,children} = this.props
    return(
        <div style={{display:'flex'}}>
          <p style={{width:120}}>{label}</p>
          <p style={{flex:1,wordBreak:'break-all',display:'inline-block'}}>{children}</p>
        </div>
    )
  }
}
