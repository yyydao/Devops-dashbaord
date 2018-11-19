import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Icon, Select, message } from 'antd';

import { reqPost } from '@/api/api';
import { setPermissionList, setProjectId } from '@/store/action';
import './index.scss';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const Option = Select.Option;

class SideBar extends Component{
    constructor(){
        super();
        this.state = {
            menuList: [],
            projectList: [],
            currentMenu: '',
            defaultCurrentMenu: [],
            menuOpenKeys: []
        }
    }

    componentWillMount(){
        this.getPermissionList();
        this.getProjectList();

        const currentMenu = sessionStorage.getItem('currentMenu');
        const defaultCurrentMenu = sessionStorage.getItem('defaultCurrentMenu');
        const menuOpenKeys = JSON.parse(sessionStorage.getItem('menuOpenKeys'));
        const { pathName } = this.props;
        if(currentMenu && pathName.indexOf('welcome') === -1){
            this.setState({ currentMenu });
        }
        if(menuOpenKeys && pathName.indexOf('welcome') === -1){
            this.setState({ menuOpenKeys });
        }
        if(defaultCurrentMenu && pathName.indexOf('welcome') === -1){
            this.setState({ defaultCurrentMenu });
        }
    }

    componentWillUnmount() {
        this.props.setProjectId(null);
        this.setState({
            defaultCurrentMenu:[],
            currentMenu: '',
            menuOpenKeys: []
        })
    }

    selectChange = (value) => {
        console.log('change select type')
        sessionStorage.clear()
        this.props.setProjectId(value);
        this.props.projectIdChange(value);
        const currentMenu = sessionStorage.getItem('currentMenu');
        const menuOpenKeys = JSON.parse(sessionStorage.getItem('menuOpenKeys'));
        this.setState({currentMenu})
        this.setState({ menuOpenKeys });
        this.getPermissionList()
    }

    menuClick = (e) => {
        let key = e.key
        sessionStorage.setItem('currentMenu', e.key);
        this.setState({currentMenu:e.key})
    }

    menuOpenChange = (openKeys) => {
        sessionStorage.setItem('menuOpenKeys', JSON.stringify(openKeys));
    }

    getPermissionList(){
        let { setPermissionList } = this.props;

        reqPost('/permission/list').then(res => {
            if(parseInt(res.code, 0) === 0){

                setPermissionList(res.data.permissionList);
                const menuList = this.getMenuList(res.data.menuList);
                this.setState({ menuList });
            }else{
                message.error(res.msg);
            }
        })
    }

    getMenuList(menuObj){
        let menuList = [];
         console.log(menuObj)
        for(let item of menuObj){
            let list = [];
            if(item.children){
                list.push(this.getMenuList(item.children));
                menuList.push(
                    <SubMenu key={`sub${item.id}`} title={<span><Icon type="setting" /><span>{item.name}</span></span>}>
                        { list }
                    </SubMenu>
                )
            }else{
                menuList.push(
                    <MenuItem key={item.id}>
                        <Link to={item.urls}><Icon type="code" />{item.name}</Link>
                    </MenuItem>
                )
            }
        }

        return menuList;
    }

    getProjectList(){
        reqPost('/project/listProjectByUser', {
            pageSize: 1024,
            pageNum: 1,
            projectName: ''
        }).then(res => {
            if(parseInt(res.code, 0) === 0){
                let list = [];
                for(let item of res.data){
                    list.push({
                        id: item.id,
                        name: item.name
                    })
                }
                this.setState({ projectList: list });
            }
        })
    }

    render(){
        const { menuList, projectList, currentMenu, menuOpenKeys,defaultCurrentMenu } = this.state;
        const { projectId } = this.props;

        return(
            <div className="menu-side-bar">
                <div className="dropdown-link">
                    <p className="logo-img"><img src={require('@/assets/favicon.ico')} width={40} height={40} alt="Devops平台" /></p>
                    {
                        projectId && <Select defaultValue={projectId} className="dropdown-select" onChange={this.selectChange}>
                            {
                                projectList.map((item) => {
                                    return <Option key={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    }
                </div>
                <Menu mode="inline" selectedKeys={[currentMenu]} theme="dark" onClick={this.menuClick} onOpenChange={this.menuOpenChange}
                      defaultSelectedKeys={defaultCurrentMenu} defaultOpenKeys={menuOpenKeys}>
                    { menuList }
                </Menu>
            </div>
        )
    }
}

export default connect(state => {
    return{
        projectId: state.projectId
    }
}, { setPermissionList, setProjectId })(SideBar);
