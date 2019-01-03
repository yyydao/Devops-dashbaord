import React,{ Component } from 'react'
import { connect } from 'react-redux'

class STFControl extends Component {

  constructor () {
    super()
    this.state = {
      iFrameHeight: '0px'
    }
  }

  render () {
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
          src="http://10.100.12.52:7100"
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


