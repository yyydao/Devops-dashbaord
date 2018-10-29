import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { reqPost, reqGet } from '@/api/api' ;
import PanelContent from './panelContent';

import { Collapse, Icon } from 'antd';
const Panel = Collapse.Panel;

class versionPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            total: 0,
            page:1,
            count: 3,
            list: []
        }
    }

    propTypes: {
        version: PropTypes.string.isRequired,
        envId: PropTypes.string.isRequired,
        passwdBuild: PropTypes.string.isRequired
    }

    getList = (loadMore=0) => {
        const { envId, version } = this.props,
              { total, page, count } = this.state;
        if (loadMore !== 0 && page > total) return;

        this.setState({
            loading: true
        })

        reqGet('/package/build/more', {
            envId,
            version,
            page,
            count
        }).then((res) => {
            if (res.code === 0) {
                this.setState({
                    loading: false,
                    total: res.total,
                    page: page + 1,
                    list: loadMore === 0 ? res.data : this.state.list.concat(res.data)
                })
            }
        })
    }

    componentWillMount() {
        this.getList()
    }

    render() {
        const { loading } = this.state;
        const { passwdBuild } = this.props

        return (
            <Collapse defaultActiveKey={['0']}>
                <Panel header={this.props.version} key="0" className="package-container">
                    <div className={`package-container-load ${loading ? 'act' : ''}`} onClick={
                        () => {
                            this.getList(1)
                        }
                    }>{loading && <Icon type="loading" theme="outlined" />} 加载更多</div>

                    {<PanelContent list={this.state.list} passwdBuild={passwdBuild} />}
                </Panel>
            </Collapse>
        )
    }
}

export default versionPanel;