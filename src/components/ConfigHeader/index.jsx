import React, {Component} from 'react'
import {Icon, Radio} from 'antd'
import './index.scss'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ConfigHeader extends Component {
  render() {
    let {platformList, id} = this.props;
    return (
      <div id="config-header">
        <header>
          {/*平台列表*/}
          <ul className="platform-container">
            <div style={{display: 'inline-block'}}>
              <RadioGroup onChange={(e) => {
                let target = e.target;
                this.props.platformChange(target.value, target['data-index'])
              }} value={parseInt(id)}>
                {
                  platformList.map((item, index) => (
                    <RadioButton data-index={index} key={index} value={item.id}>{item.name}</RadioButton>
                  ))
                }
              </RadioGroup>
            </div>
            {/*新增平台*/}
            <Icon
              className="icon-add"
              type="plus-circle-o"
              onClick={() => {
                this.props.handleAdd()
              }}
            />
            {/* 删除平台 */}
            {
              platformList.length ?
                <Icon
                  className="platform-delete-icon"
                  type="delete"
                  onClick={() => {
                    this.props.handleDelete()
                  }
                  }
                /> : ''
            }
          </ul>
        </header>
      </div>
    )
  }
}

export default ConfigHeader;