import React, {Component} from 'react'
import {Icon} from 'antd'
import './index.scss'

class BranchList extends Component {

  render() {
    let {branchList} = this.props;
    return (
      <div id="branch-list">
        <ul>
          {
            branchList.map((item, index) => (
              <li key={index}>
                <span className="branch-name">{item.name}</span>
                {
                  item.isDefaultBranch
                    ? <div style={{display: 'inline-block', marginLeft: 10}}>
                      <span className="ant-radio ant-radio-checked">
                        <input type="radio" className="ant-radio-input" value="1"/>
                        <span className="ant-radio-inner"/>
                      </span>
                    </div>
                    : <div style={{display: 'inline-block', marginLeft: 10}}
                           onClick={
                             () => {
                               this.props.defaultBranch(item.id)
                             }
                           }>
                      < span className="ant-radio">
                        <input type="radio" className="ant-radio-input" value="2"/>
                        <span className="ant-radio-inner"/>
                      </span>
                    </div>

                }
                <Icon
                  type="delete"
                  className="icon-delete"
                  onClick={() => {
                    this.props.handleDelete(item.id, index)
                  }}
                />
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default BranchList;