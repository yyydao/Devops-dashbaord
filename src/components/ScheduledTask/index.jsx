import React, {Component} from 'react'
import {Modal, Button} from 'antd';
import './index.scss'

class ScheduledTask extends Component {
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    let {show, taskList} = this.props;
    return (
      <div id="scheduled-task">
        <Modal
          className="scheduled-task-modal"
          title="定时任务列表"
          visible={show}
          onOk={this.handleOk}
          onCancel={this.props.handleCancel}
          footer={null}
          width={750}
        >
          <ul className="list-container">
            {
              taskList.map((item, index) => (
                <li key={index}>
                  <div className="left-part">
                    <img src={require('../../assets/favicon.ico')} alt="" />
                    <span>分支：{item.branchName}</span>
                    <span>定时时间：{item.fixTime}</span>
                    <span className="screen">场景：{item.scene}</span>
                  </div>
                  <div className="btn-delete">
                    <Button type="danger" onClick={() => {
                      this.props.handleDelete(item.id,index)
                    }}>删除
                    </Button>
                  </div>
                </li>
              ))
            }
          </ul>
        </Modal>
      </div>
    );
  }
}
export default ScheduledTask;