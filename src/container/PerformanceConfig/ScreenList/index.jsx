// 场景列表
import React, {Component} from 'react'
import "./index.scss"
import {Icon, message} from 'antd'
import DeleteModal from '@/components/DeleteModal'
import {deleteScreen} from '@/api/performance/screen'

class ScreenList extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      deleteSceneId: '',  // 删除的场景id
      deleteIndex: ''     // 当前删除item在数组的下标
    }
  }

  async _deleteScreen() {
    let {deleteSceneId} = this.state
    if (!deleteSceneId) {
      return;
    }
    let response = await deleteScreen({deleteSceneId});
    if (parseInt(response.data.code,10) === 0) {
      message.success('删除成功');
      // 删除成功 通知父组件对列表数据进行处理 移除该删除的item
      this.props.handleDeleteOk(this.state.deleteIndex);
      this.setState({
        deleteIndex: '',
        visible: false
      })
    }
  }

  render() {
    let {screenList, platformId} = this.props;
    return (
      <div className="situation-container">
        <header>
          <span>场景列表：</span>
          {
            platformId
              ? <Icon
                className="icon-add"
                type="plus-circle-o"
                onClick={this.props.handleAddScreen}
              />
              : null
          }

        </header>
        <article className="situation-lists">
          {
            screenList.map((item, index) => (
              <section key={index}>
                <span className="situation-name">{item.name}</span>
                <span className="situation-jenkins">{item.jenkinsParam}</span>
                <Icon
                  className="icon-delete"
                  type="delete"
                  onClick={
                    () => {
                      this.setState({visible: true, deleteSceneId: item.id, deleteIndex: index})
                    }}
                />
              </section>
            ))
          }

        </article>
        <DeleteModal
          visible={this.state.visible}
          onOk={() => {
            this._deleteScreen();
          }}
          onCancel={() => {
            this.setState({visible: false})
          }}
        />
        {/* 删除环境提示*/}
      </div>
    )
  }
}

export default ScreenList;
