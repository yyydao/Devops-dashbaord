import React, {Component} from 'react'
import {Modal, Alert} from 'antd'

class DeleteModal extends Component {
  render() {
    return (
      <div id="delete-modal">
        <Modal
          title="确认删除"
          visible={this.props.visible}
          onOk={this.props.onOk}
          onCancel={this.props.onCancel}
        >
          <Alert message="该配置环境可能已存在安装包，是否继续删除？" type="warning" showIcon/>
        </Modal>
      </div>
    )
  }
}

export default DeleteModal;