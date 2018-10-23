import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import './index.scss';

const MenuItem = Menu.Item;

class Header extends Component{

    render(){
        let { userInfo } = this.props;
        const menu = <Menu>
                        <MenuItem key="account"><Link to="/personal"><Icon type="user" style={{minWidth: 12, marginRight: 8}} />账户信息</Link></MenuItem>
                        <MenuItem key="logot"><a href="/uas/logout"><Icon type="logout" style={{minWidth: 12, marginRight: 8}} />退出</a></MenuItem>
                    </Menu>;

        return(
            <div className="devops-header">
                <p className="platform-name">
                    <Link to="/home">
                        <img src={require('@/assets/favicon.ico')} width={40} height={40} alt="DevOps平台" />
                        <span>DevOps平台</span>
                    </Link>
                </p>
                <p className="userinfo">
                    {
                        userInfo && <span>{userInfo.name}</span>
                    }
                    <Dropdown overlay={menu}>
                        <Icon type="bars" style={{fontSize: 18}} />
                    </Dropdown>
                </p>
            </div>
        )
    }
}

export default Header;