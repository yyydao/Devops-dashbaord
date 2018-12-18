import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.scss'
import { reqGet, reqPost } from '@/api/api'

import { differenceArray, removeItemsByValue } from './arrayUtils'

import {
  Breadcrumb,
  Icon,
  Button,
  Radio,
  Collapse,
  Modal,
  Select,
  Checkbox,
  message,
  TimePicker,
  Row,
  Col,
  Pagination,
  Popconfirm, Tabs
} from 'antd'
import PanelContent from './panelContent'

const BreadcrumbItem = Breadcrumb.Item
const Panel = Collapse.Panel
const Option = Select.Option
const TabPane = Tabs.TabPane

class Performance extends Component {
  constructor (props) {
    super(props)

    this.state = {
      addVisible: false,
      addConfirmLoading: false,
      branchList: [],

      //场景选择-变化选择框
      changeParentSceneItem: [],
      //场景选择-全体一级Option
      parentsSceneList: [],
      //场景选择-当前二级Option
      currentChildrenSceneList: [],
      // 场景选择-全选Indeterminate状态
      checkAllSceneIndeterminate: false,
      // 全选
      sceneCheckAll: false,
      // 场景选择-当前一级id数组
      currentParentsScene: [],
      //  场景选择-当前二级id数组
      currentChildScene: [],
      // 所有选中子ID
      chooseSceneID: [],

      formDataBranch: null,
      formDataTime: '',

      taskListVisible: false,
      taskListTotalCount: 1,
      taskListPage: 1,
      taskList: [],

      typeValue: 1,
      typeList: [
        {
          name: '分支测试',
          value: 1
        },
        {
          name: '定时测试',
          value: 2
        },
        {
          name: '提测包测试',
          value: 3
        }
      ],

      timer: null,
      timerStart: null,
      buildingOldSize: 0,
      buildingList: {
        title: '正在构建',
        url: '/task/building/list',
        loading: false,
        page: 1,
        list: []
      },

      successList: {
        title: '构建成功',
        url: '/task/success/list',
        loading: false,
        page: 1,
        list: []
      },

      failureList: {
        title: '构建失败',
        url: '/task/failure/list',
        loading: false,
        page: 1,
        list: []
      }
    }
  }

  //新建构建任务
  addItem = () => {
    const { typeValue, formDataBranch, chooseSceneID, formDataTime } = this.state
    console.log(chooseSceneID)
    if (!formDataBranch) {
      message.error('请选择“开发分支”')
      return
    } else if (chooseSceneID.length < 1) {
      message.error('请选择“执行场景”')
      return
    } else if (this.state.typeValue === 2 && !formDataTime) {
      message.error('请选择“定时时间”')
      return
    }

    this.setState({
      addConfirmLoading: true
    })

    reqPost('/task/addSubmit', {
      projectId: Number(this.props.projectId),
      buildType: typeValue,
      branchName: formDataBranch,
      sceneId: chooseSceneID.join(','),
      fixTime: formDataTime
    }).then(res => {
      this.hideModal()

      if (res.code === 0) {
        this.getList('buildingList')
      } else {
        Modal.info({
          title: '提示',
          content: (
            <p>{res.msg}</p>
          ),
          onOk () {}
        })
      }

    })
  }

  //显示新建窗口
  showModal = () => {
    this.getBranchList()
    this.getSceneList()

    this.setState({
      addVisible: true
    })
  }

  //隐藏新建窗口
  hideModal = () => {
    this.setState({
      addVisible: false,
      addConfirmLoading: false,
      checkAllSceneIndeterminate: false,
      sceneCheckAll: false,
      formDataBranch: null,
      currentParentsScene: [],
      formDataTime: ''
    })
  }

  //获取分支列表
  getBranchList = (value = '') => {
    reqPost('/branch/selectBranch', {
      projectId: this.props.projectId,
      branchName: value,
      pageSize: 100,
      pageNum: 1,
      type: 2,
      search: value ? 1 : ''
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          branchList: res.data
        })
      }
    })
  }

  //修改选中分支
  changeBranch = (formDataBranch) => {
    this.setState({
      formDataBranch
    })
  }

  //显示定时任务列表
  showTaskList = () => {
    this.setState({
      taskListVisible: true
    })

    this.getTimerList()
  }

  //隐藏定时任务列表
  hideTaskList = (res) => {
    this.setState({
      taskListVisible: false
    })
  }

  //获取场景列表
  getSceneList = () => {
    reqGet('/testScene/list/' + this.props.projectId).then(res => {
      if (res.code === 0) {
        this.setState({
          parentsSceneList: res.data.map(item => {
            return {
              name: item.name,
              id: item.id,
              indeterminate: false,
              checked: false
            }
          }),
          sceneData: res.data
        }, () => {
          console.log(this.state.parentsSceneList)
        })
      }
    })
  }

  getSceneByCheckAll = () => {
    let tempArray = []
    const sceneData = this.state.sceneData
    for (let i = 0; i < sceneData.length; i++) {
      const mockDatum = sceneData[i].children
      for (let j = 0; j < mockDatum.length; j++) {
        const mockDatumElement = mockDatum[j]
        tempArray.push(mockDatumElement['id'])
      }
    }
    return tempArray
  }

  //全选场景
  checkAllSceneChange = (e) => {
    console.log('choose all')
    const oldList = this.state.parentsSceneList
    const checked = e.target.checked
    let resetParentIndeterminateList
    let chosen

    resetParentIndeterminateList = oldList && oldList.length > 0 && oldList.map(item => {
      item.indeterminate = false
      return item
    })
    if (checked) {
      chosen = this.getSceneByCheckAll()
      resetParentIndeterminateList.map(item => {
        item.checked = true
        return item
      })
    } else {
      resetParentIndeterminateList.map(item => {
        item.checked = false
        return item
      })
      chosen = []
    }

    this.setState({ currentChildrenSceneList: [] })

    this.setState({
      currentParentsScene: checked ? this.state.parentsSceneList.map(item => {
        return item.id
      }) : [],
      checkAllSceneIndeterminate: false,
      sceneCheckAll: e.target.checked,
      parentsSceneList: resetParentIndeterminateList,
      chooseSceneID: chosen
    }, () => {
      console.log(this.state.currentParentsScene)
    })

  }

  //@todo:修复选择父级重置
  //修改选父类中场景
  changeParentsScene = (currentCheckedItem) => {
    console.group('changeParentsScene')
    const sceneData = this.state.sceneData
    // console.log('choose parents')
    // console.log(`currentCheckedItem ${currentCheckedItem}`)
    const previousParentsScene = this.state.currentParentsScene
    // console.log(`previousParentsScene ${previousParentsScene}`)
    const previousParentsSceneList = this.state.parentsSceneList
    const diff = differenceArray(currentCheckedItem, this.state.currentParentsScene)
    // console.log(`diff ${diff}`)
    // console.log(`previousParentsSceneList ${JSON.stringify(previousParentsSceneList)}`)
    let previousChosen = this.state.chooseSceneID || []
    console.log(`previousChosen ${previousChosen}`)

    let childrenList = sceneData.find(x => x.id + '' === diff.toString())['children']
    let previousIndeterminate = previousParentsSceneList.find(x => x.id + '' === diff.toString())['indeterminate']
    // console.log(`previousIndeterminate ${previousIndeterminate}`)

    if (currentCheckedItem.length > previousParentsScene.length) {
      console.log('新增或子项目改变了父项的indeterminate')
      previousParentsSceneList.map(item => {
        if (item.id + '' === diff.toString()) {
          item.checked = true
          item.indeterminate = false
        }
        return item
      })
      const getChild = childrenList.map(item => item.id)
      // console.log(`after map previousParentsSceneList ${JSON.stringify(previousParentsSceneList)}`)
      let finalChosen = previousChosen.concat(getChild)
      this.setState({
        parentsSceneList: previousParentsSceneList,
        currentParentsScene: currentCheckedItem,
        currentChildScene: getChild,
        chooseSceneID: finalChosen
      }, () => {
        console.log(`chooseSceneID ${this.state.chooseSceneID}`)
      })
    } else {
      console.log('取消indeterminate或者更新checked')

      if (previousIndeterminate) {
        console.log(`处于子项indeterminate`)
        console.log(`重置回全选`)
        previousParentsSceneList.map(item => {
          console.log(item.indeterminate)
          if (item.id + '' === diff.toString() && item.indeterminate === true) {
            item.indeterminate = false
            item.checked = true
          }
          return item
        })
        const getChild = childrenList.map(item => item.id)
        let finalChosen = previousChosen.concat(getChild)
        console.log(finalChosen)
        let chosenSet = new Set(finalChosen)
        console.log('chosenSet')
        console.dir(chosenSet)
        this.setState({
          parentsSceneList: previousParentsSceneList,
          // 父场景无变化
          currentParentsScene: previousParentsScene,
          currentChildScene: getChild,
          chooseSceneID: [...chosenSet]
        }, () => {
          console.log(`chooseSceneID ${this.state.chooseSceneID}`)
        })
      } else {
        console.log('取消diff checked')
        console.log(`无indeterminate`)
        previousParentsSceneList.map(item => {
          if (item.id + '' === diff.toString() && item.indeterminate !== true) {
            item.checked = false
          }
          return item
        })
        const shouldRemoveChild = childrenList.map(item => item.id)
        console.log(shouldRemoveChild)
        console.log(previousChosen)
        const afterRemoveChoose = differenceArray(previousChosen, shouldRemoveChild)
        console.log(afterRemoveChoose)
        this.setState({
          parentsSceneList: previousParentsSceneList,
          currentParentsScene: currentCheckedItem,
          currentChildScene: [],
          chooseSceneID: afterRemoveChoose
        }, () => {
          console.log(`chooseSceneID ${this.state.chooseSceneID}`)
        })
      }

    }
    let indeterminateList = [], hasIndeterminate, checkAllIndeterminateStatus
    for (let i = 0; i < this.state.parentsSceneList.length; i++) {
      const parentsSceneElement = this.state.parentsSceneList[i]
      indeterminateList.push(parentsSceneElement.indeterminate)
    }
    // console.log(`indeterminateList ${indeterminateList}`)
    hasIndeterminate = indeterminateList.includes(true)
    if (currentCheckedItem.length === 0) {
      checkAllIndeterminateStatus = false
    } else {
      checkAllIndeterminateStatus = hasIndeterminate || currentCheckedItem.length < this.state.parentsSceneList.length
    }
    this.setState({

      checkAllSceneIndeterminate: checkAllIndeterminateStatus,
      sceneCheckAll: !hasIndeterminate && currentCheckedItem.length === this.state.parentsSceneList.length,
      changeParentSceneItem: diff,
      currentChildrenSceneList: childrenList,

    }, () => {

      console.dir(this.state.parentsSceneList)
      console.groupEnd()
    })
  }
  //修改选中子类场景
  childSceneChangeScene = (currentChildScene) => {
    console.group('childSceneChangeScene')
    console.log(`currentChildScene ${currentChildScene}`)
    // 改变的父项 []
    const changeParentSceneItem = this.state.changeParentSceneItem
    //
    const fullCurrentChildScene = this.state.currentChildrenSceneList.map(item => item.id)
    console.log(`fullCurrentChildScene ${fullCurrentChildScene}`)
    // 未选中子项
    let notChooseChildScene
    // 父项options
    let parentSceneList = this.state.parentsSceneList
    // 当前 Indeterminate
    let currentIndeterminate = currentChildScene.length > 0 && (currentChildScene.length < this.state.currentChildrenSceneList.length)
    // 旧选中子项ID
    let previousChosen = this.state.chooseSceneID || []
    let finalChangeChoose
    // 缓存改变后父场景
    let currentParentsScene = []
    let indeterminateList = [], //父级indeterminate 查找表
      parentsCheckList = [], // 父级 checked    查找表
      hasIndeterminate,     // 父级是否存在 Indeterminate
      parentsCheckListHasFalse // 父级是否存在 check 为false

    //改变相应父级
    parentSceneList.map(item => {
      if (item.id + '' === changeParentSceneItem.toString()) {
        item.indeterminate = currentIndeterminate
        item.checked = currentChildScene.length === this.state.currentChildrenSceneList.length
      }
      return item
    })

    notChooseChildScene = differenceArray(currentChildScene, fullCurrentChildScene)
    console.log(`未选中子项 ${notChooseChildScene}`)
    console.log(`原有全部子项 ${previousChosen}`)
    if (notChooseChildScene.length > 0) {
      console.log('移除了子项')
      if (previousChosen.length === 0) {
        console.log('原有全部子项为空')
        finalChangeChoose = currentChildScene
      } else {
        finalChangeChoose = removeItemsByValue(previousChosen, notChooseChildScene)
      }

    } else {
      console.log('新加了子项')
      let finalChosen = previousChosen.concat(currentChildScene)
      console.log(finalChosen)
      let chosenSet = new Set(finalChosen)
      console.log('chosenSet')
      console.dir(chosenSet)
      finalChangeChoose = [...chosenSet]
    }
    console.log(`修改后全部子项 ${finalChangeChoose}`)
    for (let i = 0; i < parentSceneList.length; i++) {
      const parentSceneListElement = parentSceneList[i]
      if (parentSceneListElement.checked || parentSceneListElement.indeterminate) {
        currentParentsScene.push(parentSceneListElement['id'])
      }
    }

    for (let i = 0; i < this.state.parentsSceneList.length; i++) {
      const parentsSceneElement = this.state.parentsSceneList[i]
      indeterminateList.push(parentsSceneElement.indeterminate)
      parentsCheckList.push(parentsSceneElement.checked)
    }
    // console.log(`indeterminateList ${indeterminateList}`)
    // console.log(`currentParentsScene ${currentParentsScene}`)
    hasIndeterminate = indeterminateList.includes(true)
    parentsCheckListHasFalse = parentsCheckList.includes(false)

    this.setState({
      checkAllSceneIndeterminate: hasIndeterminate || (currentParentsScene.length > 0 && currentParentsScene.length < this.state.parentsSceneList.length),
      currentParentsScene: currentParentsScene,
      parentsSceneList: parentSceneList,
      currentChildScene: currentChildScene,
      childSceneIndeterminate: !!currentChildScene && (currentChildScene.length < this.state.currentChildrenSceneList.length),
      sceneCheckAll: !parentsCheckListHasFalse,
      chooseSceneID: finalChangeChoose
    }, () => {
      console.log(`final chose ${this.state.chooseSceneID}`)
      console.dir(this.state.parentsSceneList)
      console.groupEnd()
    })

  }

  //修改新建定时时间
  changeTime = (moment) => {
    this.setState({
      formDataTime: moment.format('HH:mm:ss')
    })
  }

  //获取定时任务列表
  getTimerList = (page) => {
    console.log(page)
    reqPost('/task/timer/list', {
      projectId: Number(this.props.projectId),
      pageNum: page === undefined ? this.state.taskListPage : page,
      pageSize: 10
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          taskList: res.data,
          taskListTotalCount: res.total,
        })
      }
    })
  }

  //删除定时任务列表项
  deleteTask = (taskId) => {
    reqPost('/task/timer/delete', {
      taskId,
      projectId: this.props.projectId
    }).then(res => {
      if (res.code === 0) {
        this.getTimerList()
      }
    })
  }

  //修改类型
  changeType = (e) => {
    let typeValue = e * 1 + 1
    clearTimeout(this.state.timer)

    this.setState({
      typeValue: typeValue,
      buildingList: {
        ...this.state.buildingList,
        list: []
      },
      successList: {
        ...this.state.successList,
        list: []
      },
      failureList: {
        ...this.state.failureList,
        list: []
      },
      timer: null
    }, () => {
      this.getList('buildingList')
      this.getList('successList')
      this.getList('failureList')
    })
  }

  //获取主列表数据
  getList = (type, loadMore = 0) => {
    if (this.state[type].loading) {
      return
    }

    if (this.state.timer) {
      clearTimeout(this.state.timer)
      this.setState({
        timer: null
      })
    }

    const tabType = this.state.typeValue
    const newState = {}
    newState[type] = {
      ...this.state[type],
      loading: true
    }
    this.setState(newState)

    reqPost(this.state[type].url, {
      projectId: Number(this.props.projectId),
      type: this.state.typeValue,
      page: loadMore === 0 ? 1 : this.state[type].page + 1,
      count: type === 'buildingList' ? 20 : 3
    }).then(res => {
      if (res.code === 0) {
        const newState = {},
          dataSize = res.data.length,
          nextPage = dataSize > 0 ? this.state[type].page + 1 : this.state[type].page

        newState[type] = {
          ...this.state[type],
          list: loadMore === 0 ? res.data : this.state[type].list.concat(res.data),
          page: loadMore === 0 ? 1 : nextPage
        }

        if (type === 'buildingList') {
          if (this.state.buildingOldSize !== dataSize) {
            newState.buildingOldSize = dataSize

            if (this.state.buildingOldSize > dataSize) {
              this.getList('successList')
              this.getList('failureList')
            }
          }

          if (dataSize > 0 && tabType === this.state.typeValue && new Date().getTime() - this.state.timerStart < 3600000) {
            newState.timer = setTimeout(this.getList.bind(this, 'buildingList'), 10e3)
          }
        }

        this.setState(newState)
      }
    }).finally(() => {
      const newState = {}
      newState[type] = {
        ...this.state[type],
        loading: false
      }
      this.setState(newState)
    })
  }

  //取消正在构建任务
  cancelTask = (buildId) => {
    reqPost('/task/cancel', {
      buildId: buildId,
      type: this.state.typeValue
    }).then(res => {
      if (res.code === 0) {
        this.getList('buildingList')
      } else {
        Modal.info({
          title: '提示',
          content: (
            <p>{res.msg}</p>
          ),
          onOk () {}
        })
      }
    })
  }

  //转到包详情页
  toDetail = (buildId) => {
    reqPost('/task/getBuildId', {
      buildId
    }).then((res) => {
      if (res.code === 0) {
        this.props.history.push(`/package/detail/${res.data.id}`)
      }
    })
  }

  componentWillMount () {
    window.localStorage.setItem('detailBreadcrumbPath', JSON.stringify([{
      path: '/performanceConfig',
      name: '性能测试管理'
    }]))
  }

  componentDidMount () {
    this.getList('successList')
    this.getList('failureList')
    this.getList('buildingList')
    this.setState({
      timerStart: new Date().getTime()
    })
  }

  componentWillUnmount () {
    clearTimeout(this.state.timer)
  }

  render () {
    const {
      branchList,
      addVisible,
      addConfirmLoading,
      typeValue,
      checkAllSceneIndeterminate,
      sceneCheckAll,
      parentsSceneList,
      currentParentsScene,
      currentChildScene,
      taskListVisible,
      taskList,
      taskListTotalCount,
      typeList, buildingList, successList, failureList, formDataBranch
    } = this.state

    return (
      <div className="performance">
        <Modal title="新增提测性能测试"
               visible={addVisible}
               centered
               onOk={this.addItem}
               confirmLoading={addConfirmLoading}
               onCancel={this.hideModal}
               maskClosable={false}
               destroyOnClose={true}
               width={720}
        >
          <div className="performance-modal-item">
            <label className="performance-modal-item-label">开发分支：</label>
            <div className="performance-modal-item-content">
              <Select placeholder="开发分支"
                      style={{ width: 300 }}
                      showSearch
                      value={formDataBranch}
                      onSearch={this.getBranchList}
                      onChange={this.changeBranch}>
                {
                  branchList.map((item) => {
                    return <Option value={item.name} key={item.id}
                                   title={item.name}>{item.name}</Option>
                  })
                }
              </Select>
            </div>
          </div>

          {
            typeValue === 2 && <div className="performance-modal-item">
              <label className="performance-modal-item-label">定时时间：</label>
              <div className="performance-modal-item-content">
                {
                  addVisible && <TimePicker onChange={this.changeTime}/>
                }
              </div>
            </div>
          }

          <div className="performance-modal-item">
            <label className="performance-modal-item-label">执行场景：</label>
            <br/>
            <Checkbox
              indeterminate={checkAllSceneIndeterminate}
              onChange={this.checkAllSceneChange}
              checked={sceneCheckAll}
            >
              全部
            </Checkbox>
            <Checkbox.Group
              // options={parentsSceneList}
              style={{ width: '100%' }}
              value={currentParentsScene} onChange={this.changeParentsScene}>

              <Row>
                {
                  parentsSceneList.map((item, index) => {
                    return <Col key={index} span={8}> <Checkbox
                      indeterminate={item.indeterminate}
                      key={index}
                      value={item.id}
                    >
                      {item.name}</Checkbox></Col>
                  })
                }
              </Row>
            </Checkbox.Group>
            <Checkbox.Group
              style={{ width: '100%', background: '#eee' }}
              value={currentChildScene}
              onChange={this.childSceneChangeScene}
            >
              <Row>
                {
                  this.state.currentChildrenSceneList.map((item, index) => {
                    return <Col style={{ padding: '20px' }}
                                key={index}
                                span={8}><Checkbox
                      value={item.id}
                    >
                      {item.name}</Checkbox></Col>
                  })
                }
              </Row>
            </Checkbox.Group>
          </div>
        </Modal>

        <Modal title="新增提测性能测试"
               visible={false}
               onOk={this.addItem}
               confirmLoading={addConfirmLoading}
               onCancel={this.hideModal}
               maskClosable={false}
               destroyOnClose={true}
        >
          <div className="performance-modal-item">
            <label className="performance-modal-item-label">开发分支：</label>
            <div className="performance-modal-item-content">
              <Select placeholder="开发分支"
                      style={{ width: 300 }}
                      showSearch
                      value={formDataBranch}
                      onSearch={this.getBranchList}
                      onChange={this.changeBranch}>
                {
                  branchList.map((item) => {
                    return <Option value={item.name} key={item.id}
                                   title={item.name}>{item.name}</Option>
                  })
                }
              </Select>
            </div>
          </div>

          {
            typeValue === 2 && <div className="performance-modal-item">
              <label className="performance-modal-item-label">定时时间：</label>
              <div className="performance-modal-item-content">
                {
                  addVisible && <TimePicker onChange={this.changeTime}/>
                }
              </div>
            </div>
          }

          <div className="performance-modal-item">
            <label className="performance-modal-item-label">执行场景：</label>
            <div className="performance-modal-item-content performance-modal-checkbox-group">
              <Checkbox
                indeterminate={checkAllSceneIndeterminate}
                onChange={this.checkAllSceneChange}
                checked={sceneCheckAll}
              >
                全部
              </Checkbox>
              {/*<CheckboxGroup options={parentsSceneList} value={currentParentsScene}*/}
              {/*onChange={this.changeParentsScene}/>*/}
            </div>
          </div>
        </Modal>


        <Modal
          title="定时任务列表"
          visible={taskListVisible}
          onCancel={this.hideTaskList}
          wrapClassName="performance-task-list"
          width={740}
        >
          <div className="performance-task-list-container">
            {
              taskList.map((item, index) => {
                return <div className="performance-task-list-item" key={item.id}>
                  <img src={require('@/assets/favicon.ico')} alt={'icon'}/>
                  <p className="performance-task-list-item-content">
                    <span>分支:{item.branchName}</span>
                    <span>场景:{item.scene}</span>
                    <span>定时时间:{item.fixTime}</span>
                  </p>
                  <Popconfirm placement="top" title="确定删除该项吗？" onConfirm={() => {
                    this.deleteTask(item.id)
                  }} okText="Yes" cancelText="No">
                    <Button type="danger">删除</Button>
                  </Popconfirm>
                </div>
              })
            }
          </div>
          <div className="performance-task-list-pagination">
            <Pagination pageSize={10} defaultCurrent={1} total={taskListTotalCount}
                        onChange={this.getTimerList}/>
          </div>
        </Modal>


        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>性能测试管理</BreadcrumbItem>
        </Breadcrumb>


        {/*<div className="performance-menu">*/}
        {/*{typeValue < 3 && <Button type="primary" onClick={this.showModal}>新增测试</Button>}*/}
        {/*{typeValue === 2 && <Button type="primary" onClick={this.showTaskList}>定时任务列表</Button>}*/}

        {/*<Radio.Group value={typeValue} onChange={this.changeType} className="fr">*/}
        {/*{*/}
        {/*typeList.map((item, index) => {*/}
        {/*return <Radio.Button value={item.value} key={index}>{item.name}</Radio.Button>*/}
        {/*})*/}
        {/*}*/}
        {/*</Radio.Group>*/}
        {/*</div>*/}

        <div className="devops-main-wrapper">
          <Tabs className="package-tab" onChange={this.changeType} tabBarExtraContent={<div>{typeValue < 3 &&
          <Button type="primary" onClick={this.showModal}>新增测试</Button>}
            {typeValue === 2 && <Button type="primary" onClick={this.showTaskList}>定时任务列表</Button>}</div>}>
            {
              typeList.map((item, index) => {
                return <TabPane tab={item.name} key={index}></TabPane>
              })
            }

          </Tabs>
          <div className="performance-main">
            <Collapse defaultActiveKey={['0', '1', '2']}>

              {/*正在构建*/}
              <Panel header={buildingList.title} key="0" className="performance-container">

                <PanelContent list={buildingList.list} handlerTaskCancel={this.cancelTask}
                              handlerToDetail={this.toDetail} showDetail={typeValue === 3}/>
                <div className={`performance-container-load ${buildingList.loading ? 'act' : ''}`} onClick={
                  () => {
                    this.getList('buildingList', 1)
                  }
                }>{buildingList.loading ? <Icon type="loading" theme="outlined"/> : <Icon type="reload"
                                                                                          theme="outlined"/>} 加载更多
                </div>
              </Panel>
            </Collapse>
            <Collapse defaultActiveKey={['0', '1', '2']}>
              {/*构建成功*/}
              <Panel header={successList.title} key="1" className="performance-container">

                <PanelContent list={successList.list} handlerToDetail={this.toDetail}
                              showDetail={typeValue === 3}/>
                <div className={`performance-container-load ${successList.loading ? 'act' : ''}`} onClick={
                  () => {
                    this.getList('successList', 1)
                  }
                }>{successList.loading ? <Icon type="loading" theme="outlined"/> : <Icon type="reload"
                                                                                         theme="outlined"/>} 加载更多
                </div>
              </Panel>
            </Collapse>
            <Collapse defaultActiveKey={['0', '1', '2']}>
              {/*构建失败*/}
              <Panel header={failureList.title} key="2" className="performance-container">

                <PanelContent list={failureList.list} handlerToDetail={this.toDetail}
                              showDetail={typeValue === 3}/>
                <div className={`performance-container-load ${failureList.loading ? 'act' : ''}`} onClick={
                  () => {
                    this.getList('failureList', 1)
                  }
                }>{failureList.loading ? <Icon type="loading" theme="outlined"/> : <Icon type="reload"
                                                                                         theme="outlined"/>} 加载更多
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>


      </div>
    )
  }
}

Performance = connect((state) => {
  return {
    projectId: state.projectId
  }
})(Performance)

export default Performance
