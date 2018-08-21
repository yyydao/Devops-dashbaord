import React, {Component} from 'react'
import {Icon} from 'antd'
import './index.scss'

class Edit extends Component {

  constructor() {
    super();
    this.state = {
      edit: false,
      value: '',
      tempValue: ''
    }
  }

  // 修改文字
  handleChange(e) {
    this.setState({
      value: e.target.value || ''
    })
  }

  /*
   * 暂存value
   * 1.用于当输入内容为空的时候 不提交修改 恢复原value
   * 2.用于判断value是否修改，如果没有修改 不必发送请求接口
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      tempValue: nextProps.value
    })
  }


  // 输入框失去焦点
  handleBlur() {
    let {value, tempValue} = this.state;
    // 如果内容为空  恢复原value
    if (!value) {
      this.setState({
        value: tempValue
      })
    } else if (tempValue !== value) {
      this.props.handleOk(value)
    }
    this.setState({
      edit: false
    })
  }

  // 回车
  handleKeyPress(e) {
    if (e.which === 13) {
      this.handleBlur();
    }
  }


  render() {
    let {value, edit} = this.state;
    let {label} = this.props;
    return (
      <div id="edit">
        <span>{label}：</span>
        <div className="edit-container">
          <input
            className="edit-input"
            ref="input"
            type="text"
            value={value || ""}
            onChange={this.handleChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{display: edit ? 'inline' : 'none'}}
          />
          {
            !edit
              ? <div style={{display: 'inline-block'}}>
                <span>{value || '-----'}</span>
                {
                  value
                    ? <Icon
                      className="icon-edit"
                      type="edit"
                      onClick={
                        () => {
                          this.setState({edit: true})
                          setTimeout(() => {
                            this.refs['input'].focus();
                          }, 20)
                        }}
                    />
                    : ''
                }

              </div>
              : ''
          }
        </div>
      </div>
    )
  }
}

export default Edit;