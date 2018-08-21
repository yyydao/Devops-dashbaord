import React, {Component} from 'react'
import {Collapse, Button} from 'antd'
import './index.scss'

const Panel = Collapse.Panel;

class PackageItem extends Component {
  loadMoreBuild() {


  }
  // TODO
  seeDetail() {
  }
  // TODO
  packageDownload() {
  }

  _statusJudge(status){
    let {type} = this.props;
    if(!status){
      return type;
    }else{
      return status ===1 ? '等待构建':'正在构建'
    }
  }
  render() {
    let {item = {},} = this.props;
    return (
      <div id="package-item" className="item-left-part">
        <div onClick={this.seeDetail.bind(this, 0)}>
          <img className="item-img"
               src={require("../../assets/favicon.ico")}
               style={{cursor: 'pointer'}}
          />
        </div>
        <div className="package-detail" style={{cursor: "pointer"}}>
          <div onClick={this.seeDetail.bind(this, 0)}>
            <span style={{color: "#01aaed"}}>{this._statusJudge(item.status)}</span>
          </div>
          <div className="info">
            <span>buildId：{item.buildId}</span>
            <span>分支：{item.branchName}</span>
            <span>场景：{item.scene}</span>
            <span>时间：{item.timeStamp}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default PackageItem;