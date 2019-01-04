import React, { Component } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'

class STFControl extends Component {

  constructor () {
    super()
    this.state = {
      iFrameHeight: '0px',
      url: ''
    }
  }

  componentWillMount () {
    const serial = this.props.match.params.deviceID
    console.log(serial)
    this.setState({
      serial,
      url: `http://10.100.12.52/#!/control/${serial}`
    })
  }

  render () {
    const { url } = this.state
    return (
      <div style={{ height: '100%' }}>
        <iframe
          // onLoad={() => {
          //   const obj = ReactDOM.findDOMNode(this)
          //   this.setState({
          //     'iFrameHeight': obj.contentWindow.document.body.scrollHeight + 'px'
          //   })
          // }}
          ref="iframe"
          src={url}
          width="100%"
          height="100%"
          scrolling="yes"
          frameBorder="0"
        />
      </div>)
  }
}

STFControl = connect((state) => {
  return {
    projectId: state.projectId
  }
})(STFControl)

export default STFControl


