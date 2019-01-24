import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb, Input, Button, Table, Select, message, Modal } from 'antd';

import { reqPost, checkPermission } from '@/api/api';

const BreadcrumbItem = Breadcrumb.Item;
const Search = Input.Search;
const Option = Select.Option;
const confirm = Modal.confirm;

class Branch extends Component{
    constructor(){
        super();
        this.columns = [
            {
                title: '分支名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '创建人',
                dataIndex: 'creator',
                key: 'creator'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime'
            },
            {
                title: '包管理默认分支',
                dataIndex: 'isPackageDefault',
                key: 'isPackageDefault',
                render: (text, record) => {
                    return (
                        <Select value={text} onChange={(value) => this.handlePackageChange(value, record)}>
                            <Option value={0}>否</Option>
                            <Option value={1}>是</Option>
                        </Select>
                    )
                }
            },
            {
                title: '性能测试默认分支',
                dataIndex: 'isTestingDefault',
                key: 'isTestingDefault',
                render: (text, record) => {
                    return (
                        <Select value={text} onChange={(value) => this.handleTestChange(value, record)}>
                            <Option value={0}>否</Option>
                            <Option value={1}>是</Option>
                        </Select>
                    )
                }
            }
        ];
        this.state = {
            loading: false,
            data: [],
            pagination: {
                pageSize: 8,
                total: 0,
                showTotal: null
            },
            params: {
                branchName: '',
                pageSize: 8,
                pageNum: 1
            },
            hasRefreshBtn: false,
            disabled: false
        }
    }

    componentWillMount(){
        this.getBranchList();
        this.getPermission();
    }

    async getPermission(){
        const hasRefreshBtn = await checkPermission('/branch/refresh');
        this.setState({ hasRefreshBtn });
    }

    handlePackageChange = (value, record) => {
        confirm({
            title: '提示',
            content: '确认更新包管理默认分支吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                reqPost('/branch/update', {
                    projectId: record.projectId,
                    branchId: record.id,
                    packageDefault: value,
                    testDefault: record.isTestingDefault
                }).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        message.success('包管理默认分支更新成功！');
                        this.getBranchList();
                    }else{
                        message.error(res.msg);
                    }
                })
            }
        })
    }

    handleTestChange = (value, record) => {
        confirm({
            title: '提示',
            content: '确认更新性能测试默认分支吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                reqPost('/branch/update', {
                    projectId: record.projectId,
                    branchId: record.id,
                    packageDefault: record.isPackageDefault,
                    testDefault: value
                }).then(res => {
                    if(parseInt(res.code, 0) === 0){
                        message.success('性能测试默认分支更新成功！');
                        this.getBranchList();
                    }else{
                        message.error(res.msg);
                    }
                })
            }
        })
    }

    getBranchList = () => {
        const { projectId } = this.props;
        this.setState({
            loading: true,
            disabled: true
        });
        setTimeout(() => {
            reqPost('/branch/pages', {
                projectId,
                ...this.state.params
            }).then(res => {
                if(parseInt(res.code, 0) === 0){
                    const pagination = { ...this.state.pagination };
                    pagination.total = res.count;
                    pagination.showTotal = () => {
                        return '共 ' + res.count + ' 条';
                    };
                    this.setState({
                        loading: false,
                        disabled: false,
                        data: res.data,
                        pagination
                    })
                }else{
                    this.setState({ loading: false, disabled: false });
                    message.error(res.msg);
                }
            })
        }, 500)
    }

    handleTableChange = (pagination, filters, sorter) => {
        const params = { ...this.state.params };
        params.pageNum = pagination.current;
        this.setState({ params }, this.getBranchList);
    }

    onSearch = (value) => {
        const params = { ...this.state.params };
        params.branchName = value;
        params.pageNum = 1;
        this.setState({ params }, this.getBranchList);
    }

    refreshBranch = () => {
        reqPost('/branch/refresh', { projectId: this.props.projectId }).then(res => {
            if(parseInt(res.code, 0) === 0){
                message.success('分支拉取成功！');
                this.getBranchList();
            }else{
                message.error(res.msg);
            }
        })
    }

    render(){
        const { hasRefreshBtn, data, loading, pagination, disabled } = this.state;

        return(
            <div>
                <Breadcrumb className="devops-breadcrumb">
                    <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
                    <BreadcrumbItem>分支列表</BreadcrumbItem>
                </Breadcrumb>
              <div className="content-container">
                <div style={{backgroundColor:"#fff",padding:"40px 32px"}}>
                  <div className="mb10 clear">
                    <p className="fl" style={{marginBottom:40}}>项目远程分支：<Search onSearch={this.onSearch} placeholder="输入并按回车搜索" style={{width: 180}} /></p>
                    {
                      hasRefreshBtn && <Button type="primary" disabled={disabled} className="fr" icon="reload" onClick={this.refreshBranch}>拉取分支</Button>
                    }
                  </div>
                  <Table columns={this.columns} dataSource={data} loading={loading} pagination={pagination} rowKey={record => record.id} onChange={this.handleTableChange}></Table>
                </div>
              </div>
            </div>
        )
    }
}

export default connect(state => {
    return {
      projectId: state.project.projectId
    }
}, {})(Branch);
