import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reqPost, reqGet } from '@/api/api' ;

import { Breadcrumb, Card } from 'antd';
const BreadcrumbItem = Breadcrumb.Item;

class Package extends Component {
    constructor(props) {
        super(props);

        this.state = {
            envList: []
        }
    }

    getEnvList = () => {
        reqGet('/env/list', {
            projectId: this.props.projectId,
            categoryId: 0
        }).then((res) => {
            if (res.code === 0) {
                this.setState({
                    envList: res.data
                })

                const envList = res.data.map((item, index) => {
                    return {
                        id: item.id,
                        name: item.name,
                        passwdBuild: item.passwdBuild
                    }
                })

                window.localStorage.setItem('envList', JSON.stringify(envList));
            }
        })
    }

    componentWillMount() {
        window.localStorage.setItem('oldProjectId', this.props.projectId);
    }

    componentDidMount() {
        this.getEnvList()
    }

    render() {
        const { envList } = this.state;

        return (
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>安装包</BreadcrumbItem>
                </Breadcrumb>
                
                <div className="config-card-list clear">
                {
                    envList.map((item, index) => {
                        return  <Link to={{
                                    pathname: `/package/${item.id}`,
                                    state: {
                                        envId: item.id,
                                        envName: item.name,
                                        passwdBuild: item.passwdBuild
                                    }
                                }} key={index}>
                                    <Card hoverable className="config-card">{item.name}</Card>
                                </Link>
                                
                    })
                }
                </div>
            </div>
        )
    }
}

Package = connect((state) => {
    return {
        projectId: state.projectId
    }
})(Package);

export default Package;