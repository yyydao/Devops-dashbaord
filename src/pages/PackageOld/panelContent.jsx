import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

class panelContent extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    propTypes: {
        list: PropTypes.string.isRequired
    }

    render() {
        return (
            this.props.list.map((item, index) => {
                // let status;
                // switch (item.status) {
                //     case 0:
                //         status = '成功';
                //         break;
                //     case 1:
                //         status = '失败';
                //         break;
                //     case 2:
                //         status = '部分成功';
                //         break;
                //     default:
                //         status = '';
                // }

                return  <div className="package-item" key={index}>
                            <img src={require('@/assets/favicon.ico')} />
                            <h2>{item.fileName}</h2>
                            <p>
                                <span title={item.id}><i>buildId:</i>{item.id}</span>
                                <span><i>状态:</i>{item.status === 0 ? '构建成功' : '构建失败'}</span>
                                <span><i>时间:</i>{item.buildTime}</span>
                                <span title={item.content}><i>提测概要:</i>{item.content}</span>
                            </p>
                            <div className="package-item-ctrl">
                                <Button type="primary"><a href={`/package/download?buildId=${item.id}&token=${this.props.token ? this.props.token : ''}`}>下载</a></Button>
                                <Button type="primary"><Link to={{
                                  pathname: `/package/detail/${item.id}`,
                                  state:{passwdBuild:this.props.passwdBuild}
                                }}>查看</Link></Button>
                            </div>
                        </div>
            })
        )
    }
}

panelContent = connect((state) => {
    return {
        token: state.token
    }
})(panelContent)

export default panelContent;
