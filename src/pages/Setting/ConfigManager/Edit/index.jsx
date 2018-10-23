
import React, { Component } from 'react';
import { Input, Popconfirm, Button } from 'antd';

export default class Edit extends Component{

    render(){
        const { editing, defaultValue, handleChange, handleConfirm, handleCancel, isEditing } = this.props;
        return(
            <span>
                {
                    editing ? (
                        <span>
                            <Input className="config-project-input" defaultValue={defaultValue} onChange={handleChange} />
                            <Popconfirm title="确定修改吗？" okText="确定" cancelText="取消" onConfirm={handleConfirm}>
                                <a>保存</a>
                            </Popconfirm>
                            <Popconfirm title="确定取消修改吗？" okText="确定" cancelText="取消" onConfirm={handleCancel}>
                                <a>取消</a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <span>
                            <span style={{width: 300}}>{defaultValue}</span>
                            <Button icon="edit" type="primary" onClick={isEditing}></Button>
                        </span>
                    )
                }
            </span>
        )
    }
}