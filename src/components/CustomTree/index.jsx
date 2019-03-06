import React, {Component} from 'react';
import {Col, Row, Checkbox} from 'antd';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import './index.scss'
class CustomTree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      currentParentsIndex: 0,
      checkAllSceneIndeterminate: false,
      sceneCheckAll: false,
      currentParentsScene: [],
      currentChildScene: [],
      currentChildrenSceneList: []
    }
  }

  propTypes: {
    data: PropTypes.array.isRequired
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    }, () => this.initData())
  }

  componentWillMount() {
    this.initData()
  }

  initData = () => {
    let {data} = this.state
    if (data.length > 0) {
      data.map(item => {
        item.indeterminate = false
        item.checked = false
        item.active = false
        if (item.children.length > 0) {
          let children = item.children
          children.map(item1 => item1.checked = false)
        }
        return item
      })
    }
    this.setState({data})
  }

  onItemLabelClick = (index1, children) => {
    let {data} = this.state
    let currentChildScene = []
    data.map((item, index) => item.active = index === index1)

    children.map(item => {
      if (item.checked) {
        currentChildScene.push(item.id)
      }
      return item
    })
    this.setState({
      currentParentsIndex: index1,
      currentChildrenSceneList: children,
      data,
      currentChildScene
    },()=>{
      this.judgeAllChecked()
    })
  }

  childSceneChangeScene = (currentChildScene) => {
    let {currentParentsIndex, data, currentParentsScene} = this.state
    data[currentParentsIndex].children.map(item => {
      if (currentChildScene.indexOf(item.id) > -1) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
    //判断父级半选
    if (currentChildScene.length === 0) {
      if (currentParentsScene.indexOf(data[currentParentsIndex].id) > -1) {
        currentParentsScene.splice(currentParentsScene.indexOf(data[currentParentsIndex].id), 1)
      }
      data[currentParentsIndex].indeterminate = false
      data[currentParentsIndex].checked = false
    }
    else if (currentChildScene.length !== 0 && currentChildScene.length < data[currentParentsIndex].children.length) {
      data[currentParentsIndex].indeterminate = true
      data[currentParentsIndex].checked = false
      if (currentParentsScene.indexOf(data[currentParentsIndex].id) > -1) {
        currentParentsScene.splice(currentParentsScene.indexOf(data[currentParentsIndex].id), 1)
      }
    } else {
      currentParentsScene.push(data[currentParentsIndex].id)
      data[currentParentsIndex].indeterminate = false
      data[currentParentsIndex].checked = true
    }
    this.setState({currentChildScene, data, currentParentsScene}, () =>{
      this.dataChange()
      this.judgeAllChecked()
    })
  }

  judgeAllChecked = () => {
    let {data, currentParentsScene, sceneCheckAll, checkAllSceneIndeterminate} = this.state
    //是否存在半选
    let isexistIndeterminate = false
    data.map(item => {
      if (item.indeterminate) {
        isexistIndeterminate = true
      }
      return item
    })
    if (data.length === currentParentsScene.length) {
      sceneCheckAll = true
      checkAllSceneIndeterminate = false
    }else if (data.length > currentParentsScene.length && currentParentsScene.length > 0) {
      checkAllSceneIndeterminate = true
      sceneCheckAll = false
    }else if (currentParentsScene.length === 0 && !isexistIndeterminate) {
      checkAllSceneIndeterminate = false
      sceneCheckAll = false
    } else {
      checkAllSceneIndeterminate = true
      sceneCheckAll = false
    }
    this.setState({sceneCheckAll, checkAllSceneIndeterminate})
  }

  changeParentsScene = (changeParentsScene1) =>{
    let {data,currentParentsScene} = this.state
    let diff=this.differenceArray(changeParentsScene1,currentParentsScene)
    let checkedIndex=0,children=[]
    data.map((item,index)=>{
      if(item.id===diff[0]){
        if(item.checked){
          item.checked=false
          item.indeterminate=false
          item.children.map(item1=>item1.checked=false)
        }else{
          item.checked=true
          item.indeterminate=false
          item.children.map(item1=>item1.checked=true)
        }
        checkedIndex=index
        children=item.children
      }
      return item
    })
    this.setState({currentParentsScene:changeParentsScene1,data},()=>{
      this.onItemLabelClick(checkedIndex,children)
      this.dataChange()
    })
  }

  differenceArray = (arr1, arr2) => {
    return arr1
      .filter(x => !arr2.includes(x))
      .concat(arr2.filter(x => !arr1.includes(x)))
    // return  arr1.filter(x => !arr2.includes(x));
  }

  checkAllSceneChange = (checked) =>{
    let {data} = this.state
    let currentParentsScene=[]
    data.map(item=>{
      if(checked){
        currentParentsScene.push(item.id)
      }
      item.checked=checked
      item.indeterminate=false
      if(item.children.length>0){
        item.children.map(item1=>item1.checked=checked)
      }
      return item
    })

    //处理子集
    let currentChildScene=[]
    if(checked){
      data[this.state.currentParentsIndex].children.map(item=>{
        currentChildScene.push(item.id)
        return item
      })
    }
    this.setState({
      sceneCheckAll:checked,
      data,
      checkAllSceneIndeterminate:false,
      currentParentsScene,
      currentChildScene
    },()=>{this.dataChange()})
  }

  dataChange = () => {
    let {data} = this.state
    let selectedKeys = []
    data.map(item=>{
      if(item.children.length>0){
        item.children.map(item1=>{
          if(item1.checked){
            selectedKeys.push(item1.id)
          }
          return item1
        })
      }
      return item
    })
    this.props.onSceneChange(selectedKeys)
  }

  render() {
    const {data, checkAllSceneIndeterminate, sceneCheckAll, currentParentsScene, currentChildScene, currentChildrenSceneList} = this.state;
    return (
      <div className="ctree">
        <Checkbox
          indeterminate={checkAllSceneIndeterminate}
          onChange={(e)=>this.checkAllSceneChange(e.target.checked)}
          checked={sceneCheckAll}
          style={{paddingBottom:8}}
        >
          全部
        </Checkbox>
        <Checkbox.Group
          // options={parentsSceneList}
          style={{width: '100%'}}
          value={currentParentsScene}
          onChange={this.changeParentsScene}>

          <Row>
            {
              data.map((item, index) => {
                return <Col key={index} span={8} style={{paddingBottom:8}}>
                  <Checkbox
                    indeterminate={item.indeterminate}
                    key={index}
                    value={item.id}
                    checked={item.checked}
                  />
                  <span
                    style={{cursor: 'pointer'}}
                    className={item.active ? 'label-active' : ''}
                    onClick={() => {
                      this.onItemLabelClick(index, item.children)
                    }}>{item.name}</span>
                </Col>
              })
            }
          </Row>
        </Checkbox.Group>
        <Checkbox.Group
          style={{width: '100%', background: '#eee'}}
          value={currentChildScene}
          onChange={this.childSceneChangeScene}
        >{
          currentChildrenSceneList.length > 0 &&
          <Row style={{paddingBottom: 16}}>
            {
              currentChildrenSceneList.map((item, index) => {
                return <Col style={{paddingTop: 16, paddingLeft: 8, paddingRight: 8}}
                            key={index}
                            span={8}><Checkbox
                  value={item.id} checked={item.checked}
                >
                  {item.name}</Checkbox></Col>
              })
            }
          </Row>
        }
        </Checkbox.Group>
      </div>
    )
  }
}

export default connect(state => {
  return {
    projectId: state.project.projectId
  }
}, {})(CustomTree)
