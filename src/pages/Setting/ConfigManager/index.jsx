import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Card, message } from 'antd';

import { reqPost } from '@/api/api';
import './index.scss';

const BreadcrumbItem = Breadcrumb.Item;

class ConfigManager extends Component{
    constructor(){
        super();
        this.state = {
            configList: []
        }
    }

    componentWillMount(){
        this.getConfigList();
    }

    getConfigList(){
        reqPost('/config/list').then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({ configList: res.data });
            }else{
                message.error(res.msg);
            }
        })
    }

    render(){
        const { configList } = this.state;

        return(
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>配置管理</BreadcrumbItem>
                </Breadcrumb>
                <div className="config-card-list clear">
                    {
                        configList.map((item, index) => {
                            return(
                                <Link to={`${item.url}/${item.id}`} key={index}>
                                    <Card hoverable className="config-card">{item.name}</Card>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default ConfigManager;