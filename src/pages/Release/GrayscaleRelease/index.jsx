import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { reqPost, reqGet } from '@/api/api'
import { Button, Breadcrumb, Row, Col, Card, Table, message, Icon, Modal, Checkbox, Input, Form, Radio} from 'antd'
import Edit from '@/pages/Setting/ConfigManager/Edit';
import './index.scss'

const BreadcrumbItem = Breadcrumb.Item;
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

class GrayscaleRelease extends Component{
  constructor(){
    super();
    this.state = {
      projectId:'',
      platform:'',
      projectName:'',
      columns: [
        {
          title: '版本',
          dataIndex: 'appVersion',
          key: 'appVersion',
          // render: (text, record) => <Link to={`/dashboard/${record.id}`}>{ text }</Link>
        },
        {
          title: 'Build',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '大小',
          dataIndex: 'fileSize',
          key: 'fileSize'
        },
        {
          title: '下载次数',
          dataIndex: 'downloadCount',
          key: 'downloadCount'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime'
        },
        {
          title: '操作',
          render: (text, record) => <div><Link to={{pathname:'/addGrayscale', query:{packageID:record.packageID,versionID:record.id}}}>编辑</Link><span style={{color:"#eee"}}> | </span><a href={`${record.filePath}`}>下载</a></div>
        }
      ],
      androidColumns:[
        {
          title: '特征Key',
          dataIndex: 'featureName',
          key: 'featureName',
          width:160,
          // render: (text, record) => <Link to={`/dashboard/${record.id}`}>{ text }</Link>
        },
        {
          title: '特征描述',
          dataIndex: 'detail',
          key: 'detail',
          render: (text, record,index) => <div className="config-project-item"><Edit name='detail'panelIndex ={index} defaultValue={record.detail} handleConfirm={this.changeEdit}/></div>
        },
        {
          title: '选取值',
          dataIndex: 'featureValue',
          key: 'featureValue',
          render: (text, record,index) => <div style={{display:"flex",alignItems:"center"}}>
            <p style={{marginBottom:0,paddingRight:24}}>{text}</p>
            <Icon type="form" style={{fontSize:14,color:"#1890ff",cursor:"pointer",padding:8}} onClick={()=>{this.editFeatureValue(record.featureName,text,index)}}/>
          </div>
        },
        {
          title: '操作',
          width:100,
          render: (text, record,index) => {
            if(record.featureName==="T-G2-Flow"||record.featureName==="T-G1-Area"||record.featureName==="T-G3-Device"){
              return
            }else {
              return <a onClick={e=>{this.deleteFeature(e,index)}}>删除</a>
            }
          }
        }
      ],
      listData: [],
      pagination: {
        pageSize: 7,
        total: 0,
        showTotal: null
      },
      loading: false,
      params: {
        limit: 7,
        page: 1,
        bundleID: 'com.tuandai.client'
      },
      downloadPath:'',
      androidData:{},
      selectedRowKeys:[],
      modalVisible:false,
      modalTitle:'',
      modelValue:'',
      areaList:[],
      areaCheckedList:[],
      checkAllArea:false,
      editRowIndex:0,

      //新增特征
      newFeatures:{
        featureName:'',
        detail:'',
        checked:false,
        featureValue:''
      },
      flowExpression:[
        '[0-1](.{35})',
        '[0-3](.{35})',
        '[0-5](.{35})',
        '[0-6](.{35})',
        '[0-7](.{35})',
        '[0-9](.{35})',
        '[0-c](.{35})',
        '[0-d](.{35})',
        '[0-e](.{35})',
        '[0-f](.{35})']
    }
  }
  componentWillMount(){
    this.getPlatForm()
  }
  /**
  * @desc 获取项目详情为了获取platform，区分是ios,还是Android
  * @params {int} [page] 页数，默认为1
  */
  getPlatForm = () => {
    reqPost('/project/projectInfo', {
      projectId:this.props.projectId
    }).then(res => {
      if (parseInt(res.code, 0) === 0) {
        this.setState({
          platform:res.data.platform,
          projectName:res.data.description
        },()=>{
          if(res.data.platform===1){
            this.getAndroidGrayScaleData()
          }
          if(res.data.platform===2){
            this.getTableData()
          }
        })
      }
    })
  }

  /**
   * @desc 表格页数改变事件
   */
  handleTableChange = (pagination) => {
    const params = { ...this.state.params };
    params.page = pagination.current;
    this.setState({ params: params }, this.getTableData);
  }

  /**
   * @desc 获取ios表格数据
   */
  getTableData = () => {
    this.setState({ loading: true });
    reqGet('/deploy/versionlist', this.state.params).then(res => {
      if(res.code === 0){
        const pagination = { ...this.state.pagination };
        const params = { ...this.state.params };
        params.bundleID = res.package.bundleID;
        pagination.total = res.data.totalCount;
        pagination.showTotal = () => {
          return '共 ' + res.data.totalCount+ ' 条';
        };

        this.setState({
          loading: false,
          listData: res.data.list,
          projectName:res.package.appName,
          downloadPath:res.package.downloadPath,
          pagination,
          params
        });
      }else{
        this.setState({ loading: false });
        message.error(res.msg);
      }
    })
  }

  /**
   * @desc 文本编辑事件
   * @param value string 文本编辑内容
   * @param key string 文本编辑字段
   * @param index num 环境下标
   */
  changeEdit = (value, index, key) => {
    if(key==="version"){
      let androidData = this.state.androidData
      androidData[key] = value
      this.setState({androidData},()=>{
        this.saveAndroidGrayScaleData(true)
      })
    }else{
      let androidData = this.state.androidData
      androidData.featureItems[index][key] = value
      this.setState({androidData})
    }
  }

  /**
   * @desc 新增特征值改变事件
   */
  onNewFeaturesChange=(e,key)=>{
    let newFeatures=this.state.newFeatures
    newFeatures[key]=e
    this.setState({newFeatures})
  }
  /**
   * @desc 获取android灰度发布主页数据
   */
  getAndroidGrayScaleData = () =>{
    reqGet('/distribute/queryInformation', {projectId:this.props.projectId}).then(res => {
      if(res.code === 0){
        let selectedRowKeys=[]
        res.data.featureItems.map((item,index)=>{
          if(item.checked){
            selectedRowKeys.push(index)
          }
        })
        this.setState({androidData:res.data,selectedRowKeys})
      }else{
        message.error(res.msg)
      }
    })
  }

  /**
   * @desc 删除特征
   */
  deleteFeature = (e,index) =>{
    let androidData = this.state.androidData
    androidData.featureItems.splice(index,1)
    this.setState({androidData})
  }
  /**
   * @desc 获取地区信息
   */
  getAreaInfo = (value) =>{
    this.setState({areaCheckedList:value.split(',')},()=>{
      reqGet('/distribute/queryArea',{projectId:this.props.projectId}).then(res => {
        if(res.code === 0){
          this.setState({areaList:res.data},()=>{
            this.isCheckedAllArea()
            this.setState({modalVisible:true})
          })
        }else{
          message.error(res.msg)
        }
      })
    })
  }
  /**
   * @desc 判断地区是否全选
   */
  isCheckedAllArea = () =>{
    let checkAllArea=true
    let areaList =JSON.parse(JSON.stringify(this.state.areaList))
    let areaCheckedList =JSON.parse(JSON.stringify(this.state.areaCheckedList))
    areaList.map(item=>{
      if(areaCheckedList.indexOf(item.name) === -1){
        checkAllArea=false
      }
      return item
    })
    this.setState({checkAllArea})
  }

  /**
   * @desc modal数据改变事件
   */
  modalValueChange = (e) =>{
    this.setState({modelValue:e})
  }

  /**
   * @desc 表格选择栏改变事件
   */
  onSelectedRowKeys = (selectedRowKeys) =>{
    console.log(selectedRowKeys)
    let androidData = this.state.androidData
    androidData.featureItems.map((item,index)=>{
      if(selectedRowKeys.indexOf(index) === -1){
        item.checked=false
      }else{
        item.checked=true
      }
      return item
    })
    this.setState({androidData,selectedRowKeys:selectedRowKeys})
  }

  /**
   * @desc 编辑android灰度发布的选取值
   */
  editFeatureValue = (key,value,index) =>{
    this.setState({modalTitle:key,editRowIndex:index},()=>{
      if(key==="T-G1-Area"){
        this.getAreaInfo(value)
      }else{
        this.setState({modelValue:value},()=>{this.setState({modalVisible:true})})
      }
    })
  }
  /**
   * @desc
   */
  addFeatures = () => {
    this.setState({modalTitle:"新增特征",modalVisible:true,newFeatures:{}})
  }

  /**
   * @desc modal框确定事件
   */
  handleOk = () =>{
    const {modalTitle,editRowIndex} = this.state
    let androidData = this.state.androidData
    if(modalTitle==="T-G1-Area"){
      androidData.featureItems[editRowIndex].featureValue=this.state.areaCheckedList.join(',')
    } else if(modalTitle==="新增特征"){
      let newFeatures=JSON.parse(JSON.stringify(this.state.newFeatures))
      let isExistKey=false
      if(this.state.androidData.featureItems&&this.state.androidData.featureItems.length>0){
        this.state.androidData.featureItems.map(item=>{
          if(item.featureName===newFeatures.featureName){
            isExistKey=true
          }
        })
      }
      if(isExistKey){
        message.error("该特征已经存在~")
        return
      }
      if(!newFeatures.featureName){
        message.error("请填写特征key")
        return
      }
      if(!newFeatures.detail){
        message.error("请填写特征描述")
        return
      }
      newFeatures.checked=false
      newFeatures.featureValue=''
      androidData.featureItems.push(newFeatures)
    } else {
      androidData.featureItems[editRowIndex].featureValue=this.state.modelValue
    }
    this.setState({androidData,modalVisible:false})
  }


  /**
   * @desc 保存Android灰度发布信息
   */
  saveAndroidGrayScaleData = (isVersion) => {
    let params={}
    if(isVersion){
      params={
        projectId:this.props.projectId,
        version:this.state.androidData.version,
      }
    }else{
      params={
        projectId:this.props.projectId,
        expression:this.state.androidData.expression,
        featureItems:this.state.androidData.featureItems
      }
    }
    reqPost('/distribute/saveDistribute', params).then(res => {
      if(res.code === 0){
        message.success("保存成功")
      }else{
        message.error(res.msg)
      }
    })
  }
  /**
   * @desc 生成表达式
   */
  getExpression = () =>{
    let androidData = this.state.androidData
    let featureItems=this.state.androidData.featureItems
    let area="",flow="",device='',expression=''
    featureItems.map(item=>{
      if(item.checked===true){
        if(item.featureName==="T-G3-Device"){
          device=item.featureValue
        }
        if(item.featureName==="T-G1-Area"&&item.featureValue){
          let featureValue=item.featureValue.split(',')
          featureValue.map((item,index)=>{
            if(index===0){
              area+="("+encodeURI(item)+")"
            }else{
              area+="|("+encodeURI(item)+")"
            }
            return item
          })
        }
        if(item.featureName==="T-G2-Flow"&&item.featureValue){
          let featureValue=parseInt(item.featureValue)/10
          flow=this.state.flowExpression[featureValue-1]
        }
      }
    })
    if(device){
      androidData.expression="^"+device+"$"
      this.setState({androidData})
      return
    }
    if (area||flow){
      androidData.expression="^"+area+flow+"$"
    }
    this.setState({androidData})
  }
  /**
   * @desc Android表达式改变
   */
  onExpressionChange = (value) => {
    let androidData = this.state.androidData
    androidData.expression= value
    this.setState({androidData})
  }
  /**
   * @desc 全选事件
   */
  onCheckAllChange = (e) =>{
    console.log(e)
    let areaCheckedList=[]
    if(e===true){
      this.state.areaList.map(item=>{
        areaCheckedList.push(item.name)
      })
    }
    this.setState({areaCheckedList,checkAllArea:e})
  }

  render () {
    const {platform,
      projectName,
      listData,
      columns,
      androidColumns,
      pagination,
      loading,
      params,
      downloadPath,
      androidData,
      selectedRowKeys,
      modalTitle,
      areaList,
      areaCheckedList,
      modalVisible,
      checkAllArea,
      newFeatures,
      modelValue} = this.state
    const fromItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    let flowList = ()=> {
      let list=[]
      for(let i=1;i<11;i++){
        list.push(<Col key={i} style={{ marginBottom: 24 }}><Radio
          value={i*10+"%"}>{i*10+"%"}</Radio></Col>)
      }
      return list
    }
    return (
      <div>
        <Breadcrumb className="devops-breadcrumb">
          <BreadcrumbItem><Link to="/home">首页</Link></BreadcrumbItem>
          <BreadcrumbItem>灰度发布</BreadcrumbItem>
        </Breadcrumb>
        {platform===1&&
          <div>
            <div className="button-container">
              <span>{projectName}</span>
            </div>
            <div className="content-container">
              {JSON.stringify(androidData) !== "{}"&&
              <Card title="分布情况">
                <div className="config-project-item">
                  <span>分发版本：</span>
                  <Edit name='version'  defaultValue={androidData.version} handleConfirm={this.changeEdit}/>
                </div>
                <p><span style={{paddingRight:8,marginBottom:0}}>实际分发数/预计分发数：(昨天)</span>{androidData.beforeActualQuantity}/{androidData.beforeExpectQuantitty}</p>
                <p><span style={{paddingRight:8,marginBottom:0}}>实际分发数/预计分发数：(今天)</span>{androidData.actualQuantity}/{androidData.expectQuantitty}</p>
              </Card>
              }
              {JSON.stringify(androidData) !== "{}" &&
              <Card
                title="灰度特征及策略管理"
                className="gray-feature"
                extra={<Button type="primary" onClick={() => {
                  this.addFeatures()
                }}><Icon type="plus"/>新增特征</Button>}>
                <Table
                  rowSelection={{
                    selectedRowKeys,
                    onChange: this.onSelectedRowKeys
                  }}
                  columns={androidColumns}
                  rowKey={(record, index) => index}
                  dataSource={androidData.featureItems}
                  pagination={false}/>
                <TextArea value={androidData.expression} style={{minHeight: 100, marginTop: 24}} onChange={(e) => {
                  this.onExpressionChange(e.target.value)
                }}/>
                <div style={{marginTop: 24}}>
                  <Button style={{marginRight: 8}} type="primary" onClick={() => {
                    this.getExpression()
                  }}>生成表达式</Button>
                  <Button type="primary" onClick={() => {
                    this.saveAndroidGrayScaleData()
                  }}>保存</Button>
                </div>
              </Card>
              }
            </div>
          </div>
        }
        {platform===2&&
          <div>
            <div className="button-container">
              <span>{projectName}</span>
              <Button type="primary"><Link to="/addGrayscale">新发布</Link></Button>
              <Button>停止发布</Button>
            </div>
            <Row className="button-container">
              <Col span={8}><span className="item-name">Bundle ID：</span><span className="item-value">{params.bundleID}</span></Col>
              <Col span={8}><span className="item-name">下载地址：</span><a href={downloadPath} className="item-value">点击下载</a></Col>
            </Row>
            <div className="content-container">
              <Card title="版本信息">
                <Table columns={columns} rowKey={record => record.id} dataSource={listData} pagination={pagination} loading={loading} onChange={this.handleTableChange}/>
              </Card>
            </div>
          </div>
        }
        <Modal title={modalTitle} visible={modalVisible} onOk={this.handleOk} onCancel={()=>{this.setState({modalVisible:false})}}
               okText="确认" cancelText="取消">
          {modalTitle==="T-G1-Area"&&
          <div className="checkbox-container">
            <Checkbox checked={checkAllArea} onChange={e=>this.onCheckAllChange(e.target.checked)}>全部</Checkbox>
            <div style={{ marginTop: 24 }}>
              <CheckboxGroup value={areaCheckedList} onChange={(e)=>{this.setState({areaCheckedList:e},()=>{this.isCheckedAllArea()})}}>
                <Row>
                  {
                    areaList.map((item, index) => {
                      return <Col key={index} style={{ marginBottom: 24 }}><Checkbox
                        value={item.name}>{item.name}</Checkbox></Col>
                    })
                  }
                </Row>
              </CheckboxGroup>
            </div>
          </div>
          }
          {modalTitle==="新增特征"&&
            <Form>
              <FormItem {...fromItemLayout} label="特征key：">
                <Input value={newFeatures.featureName} onChange={(e)=>{this.onNewFeaturesChange(e.target.value,'featureName')}}/>
              </FormItem>
              <FormItem {...fromItemLayout} label="特征描述：">
                <Input value={newFeatures.detail} onChange={(e)=>{this.onNewFeaturesChange(e.target.value,'detail')}}/>
              </FormItem>
            </Form>
          }
          {modalTitle==="T-G2-Flow"&&
          <div className="checkbox-container">
          <RadioGroup onChange={e=>{this.modalValueChange(e.target.value)}} value={modelValue}>
            <Row>
            {flowList()}
            </Row>
          </RadioGroup>
          </div>
          }
          {
            modalTitle!=="T-G1-Area"&&modalTitle!=="新增特征"&&modalTitle!=="T-G2-Flow"&&
            <TextArea onChange={e=>{this.modalValueChange(e.target.value)}} value={modelValue}/>
          }
        </Modal>
      </div>
    )
  }
}

GrayscaleRelease = connect((state) => {
  return {
    projectId: state.projectId
  }
})(GrayscaleRelease)

export default GrayscaleRelease
