import React, {Component} from 'react';
import {Col, Row, Checkbox} from 'antd';
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import './index.scss'
class CustomTree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      senceList: props.senceList,
      selectedChildren:props.selectedChildren,
      currentParentsIndex: 0,
      checkAllSceneIndeterminate: false,
      sceneCheckAll: false,
      currentParentsScene: [],
      currentChildScene: [],
      currentChildrenSceneList: []
    }
  }

  propTypes: {
    senceList: PropTypes.array.isRequired,
    selectedChildren: PropTypes.array.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      senceList: nextProps.senceList,
      selectedChildren: nextProps.selectedChildren
    }, () => this.initData())
  }

  componentWillMount() {
    this.initData()
  }

  /**
   * @desc 初始化数据
   */
  initData = () => {
    let {senceList,selectedChildren} = this.state
    let currentParentsScene=[]
    if (senceList.length > 0) {
      senceList.map(item => {
        let existChecked=false,existUnchecked=false
        if (item.children.length > 0) {
          let children = item.children
          children.map(item1 => {
            if(selectedChildren.indexOf(item1.id)>-1){
              existChecked = true
            }else{
              existUnchecked=true
            }
            return item1
          })
        }
        item.indeterminate = existChecked&&existUnchecked
        item.checked = existChecked&&!existUnchecked
        item.active = false
        if(existChecked&&!existUnchecked){
          currentParentsScene.push(item.id)
        }
        return item
      })
    }
    this.setState({senceList,currentParentsScene},()=>{
      this.judgeAllChecked()
    })
  }

  /**
   * @desc label点击事件
   */
  onItemLabelClick = (index1, children) => {
    let {senceList} = this.state
    let currentChildScene = []
    senceList.map((item, index) => item.active = index === index1)

    children.map(item => {
      if (item.checked) {
        currentChildScene.push(item.id)
      }
      return item
    })
    this.setState({
      currentParentsIndex: index1,
      currentChildrenSceneList: children,
      senceList,
      currentChildScene
    },()=>{
      this.judgeAllChecked()
    })
  }

  /**
   * @desc 子场景改变事件
   */
  childSceneChangeScene = (currentChildScene) => {
    let {currentParentsIndex, senceList, currentParentsScene} = this.state
    senceList[currentParentsIndex].children.map(item => {
      if (currentChildScene.indexOf(item.id) > -1) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
    //判断父级半选
    if (currentChildScene.length === 0) {
      if (currentParentsScene.indexOf(senceList[currentParentsIndex].id) > -1) {
        currentParentsScene.splice(currentParentsScene.indexOf(senceList[currentParentsIndex].id), 1)
      }
      senceList[currentParentsIndex].indeterminate = false
      senceList[currentParentsIndex].checked = false
    }
    else if (currentChildScene.length !== 0 && currentChildScene.length < senceList[currentParentsIndex].children.length) {
      senceList[currentParentsIndex].indeterminate = true
      senceList[currentParentsIndex].checked = false
      if (currentParentsScene.indexOf(senceList[currentParentsIndex].id) > -1) {
        currentParentsScene.splice(currentParentsScene.indexOf(senceList[currentParentsIndex].id), 1)
      }
    } else {
      currentParentsScene.push(senceList[currentParentsIndex].id)
      senceList[currentParentsIndex].indeterminate = false
      senceList[currentParentsIndex].checked = true
    }
    this.setState({currentChildScene, senceList, currentParentsScene}, () =>{
      this.dataChange()
      this.judgeAllChecked()
    })
  }

  /**
   * @desc 判断是否选中全部
   */
  judgeAllChecked = () => {
    let {senceList, currentParentsScene, sceneCheckAll, checkAllSceneIndeterminate} = this.state
    //是否存在半选
    let isexistIndeterminate = false
    senceList.map(item => {
      if (item.indeterminate) {
        isexistIndeterminate = true
      }
      return item
    })
    if (senceList.length === currentParentsScene.length) {
      sceneCheckAll = true
      checkAllSceneIndeterminate = false
    }else if (senceList.length > currentParentsScene.length && currentParentsScene.length > 0) {
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

  /**
   * @desc 父场景改变事件
   */
  changeParentsScene = (changeParentsScene1) =>{
    let {senceList,currentParentsScene} = this.state
    let diff=this.differenceArray(changeParentsScene1,currentParentsScene)
    let checkedIndex=0,children=[]
    senceList.map((item,index)=>{
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
    this.setState({currentParentsScene:changeParentsScene1,senceList},()=>{
      this.onItemLabelClick(checkedIndex,children)
      this.dataChange()
    })
  }

  /**
   * @desc 对比两个数组的不同部分
   */
  differenceArray = (arr1, arr2) => {
    return arr1
      .filter(x => !arr2.includes(x))
      .concat(arr2.filter(x => !arr1.includes(x)))
  }

  /**
   * @desc 选择全部的事件
   */
  checkAllSceneChange = (checked) =>{
    let {senceList} = this.state
    let currentParentsScene=[]
    senceList.map(item=>{
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
      senceList[this.state.currentParentsIndex].children.map(item=>{
        currentChildScene.push(item.id)
        return item
      })
    }
    this.setState({
      sceneCheckAll:checked,
      senceList,
      checkAllSceneIndeterminate:false,
      currentParentsScene,
      currentChildScene
    },()=>{this.dataChange()})
  }

  /**
   * @desc 数据改变事件
   */
  dataChange = () => {
    let {senceList} = this.state
    let childrenKeys = [],parentKeys=[]
    senceList.map(item=>{
      if(item.children.length>0){
        item.children.map(item1=>{
          if(item1.checked){
            childrenKeys.push(item1.id)
          }
          return item1
        })
      }
      if(item.checked||item.indeterminate){
        parentKeys.push(item.id)
      }
      return item
    })
    this.props.onSceneChange(childrenKeys,parentKeys)
  }

  render() {
    const {senceList, checkAllSceneIndeterminate, sceneCheckAll, currentParentsScene, currentChildScene, currentChildrenSceneList} = this.state;
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
              senceList.map((item, index) => {
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
