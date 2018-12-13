import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { message } from 'antd';

import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import Routers from '@/router/routerMap';
import { reqPost } from '@/api/api';
import { setToken, setUserInfo } from '@/store/action';
import { getQueryString } from '@/utils/utils';

class Layout extends Component{
    constructor(){
        super();
        this.state = {
            token: null,
            excludeSideBar: [],
            routeList: null,
            userInfo: null,
            isRender: true
        }
    }

    componentWillMount(){
        let { setToken } = this.props;
        const token = getQueryString('token');
        this.setState({ token: token });
        setToken(token);

        this.getRouteList();
        this.getExcludeSideBarPath();
        this.getUserInfo();
    }

    projectIdChange = (value) => {
        this.setState({ isRender: false }, () => {
            this.setState({ isRender: true })
            this.props.history.replace(`/dashboard/${value}`)
        })
    }

    getExcludeSideBarPath = () => {
        const excludeSideBar = [];

        Routers.forEach((item) => {
            if (item.hideSideBar) {
                excludeSideBar.push(item.path)
            }
        })

        this.setState({ excludeSideBar })
    }

    getRouteList = () => {
        this.setState({
            routeList: Routers.map((item, index) => {
                        return <Route exact key={index} path={item.path} component={item.component} />
                    })
        })
    }

    getUserInfo = () => {
        let { setUserInfo } = this.props;

        reqPost('/user/getUserInfo').then(res => {
            if(parseInt(res.code, 0) === 0){
                this.setState({ userInfo: res.data });
                setUserInfo(res.data);
            }else{
                message.error(res.msg);
            }
        })
    }

    render(){
        if(!this.state.token){
            // window.location.href = 'http://uas.tuandai888.com';
        }

        const sideBarShow = !this.state.excludeSideBar.includes(this.props.location.pathname);

        return(
            <div className="layout">
                <Header userInfo={this.state.userInfo} showSideBar={sideBarShow} />

                { sideBarShow && <SideBar projectIdChange={this.projectIdChange} pathName={this.props.location.pathname} /> }

                {
                    this.state.isRender && <div className={sideBarShow ? 'main-container' : 'index-container'}>
                                                <Switch>
                                                    { this.state.routeList }
                                                </Switch>
                                            </div>
                }
            </div>
        )
    }
}

export default connect(state => {
    return {
        projectId: state.projectId
    }
}, { setToken, setUserInfo })(Layout);
