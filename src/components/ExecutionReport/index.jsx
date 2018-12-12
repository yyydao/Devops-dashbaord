import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, message, Card } from 'antd'

import { reqGet } from '@/api/api'
import './index.scss'
import LabelItem from './LabelItem'
import ScoreChart from './chart/ScoreChart'
import StaticScanChart from './chart/StaticScanChart'
import SecurityScanChart from './chart/SecurityScanChart'
import IosSecurityScanChart from './chart/IosSecurityScanChart'
import UnitTestChart from './chart/UnitTestChart'
import UITestChart from './chart/UITestChart'
import PerformanceTestChart from './chart/PerformanceTestChart'

import DataSet from '@antv/data-set'

class ExecutionReport extends Component {
    constructor (props) {
        super(props)
        this.state = {
            taskID: props.taskID,
            buildNum: props.buildNum,
            platform: props.platform,
            scoreStandard: {},
            basicInfo: {},
            staticScan: {},
            appSecurityScan: {},
            unitTest: {},
            uiTest: {},
            performanceTest: {},
            host:window.location.host
        }
    }

    propTypes: {
        taskID: PropTypes.string.isRequired,
        buildNum: PropTypes.string.isRequired,
        platform: PropTypes.string.isRequired
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            taskID: nextProps.taskID,
            buildNum: nextProps.buildNum,
            platform: nextProps.platform,
        },()=>this.getExecutionReport());

    }
    componentWillMount () {
        this.getExecutionReport()
    }

    /**
     * @desc 获取基本信息
     */
    getExecutionReport = () => {
        const {taskID, buildNum, platform} = this.state
        reqGet('pipeline/report/taskreport', {
            taskID,
            buildNum,
            platform
        }).then(res => {
            if (res.code === 0) {
                let basicInfo = res.data.basicInfo
                let scoreStandard = res.data.scoreStandard
                let performanceTest = res.data.performanceTest
                //静态扫描数据处理
                let staticScan = res.data.staticScan
                staticScan.basicDataStatistics = this.dealFanData(res.data.staticScan.basicDataStatistics)

                //安全扫描数据处理
                let appSecurityScan = res.data.appSecurityScan
                if (appSecurityScan.appType === 1) {
                    appSecurityScan.fourComponents = this.dealBarData(res.data.appSecurityScan.fourComponents)
                    appSecurityScan.safetyProblem = this.dealFanData(res.data.appSecurityScan.safetyProblem)
                    appSecurityScan.sensitiveInfo = this.dealFanData(res.data.appSecurityScan.sensitiveInfo)
                } else {
                    appSecurityScan.iosSafetyProblem = this.dealFanData(res.data.appSecurityScan.iosSafetyProblem)
                    appSecurityScan.fileScan = this.dealFanData(res.data.appSecurityScan.fileScan)
                }

                //单元测试数据处理
                let unitTest = res.data.unitTest
                unitTest.executionResult = this.dealFanData(res.data.unitTest.executionResult)

                //ui测试数据处理
                let uiTest = res.data.uiTest
                uiTest.setps = this.dealFanData(res.data.uiTest.setps)
                uiTest.features = this.dealFanData(res.data.uiTest.features)
                uiTest.scenarios = this.dealFanData(res.data.uiTest.scenarios)

                this.setState({
                    basicInfo,
                    staticScan,
                    scoreStandard,
                    appSecurityScan,
                    unitTest,
                    uiTest,
                  performanceTest
                })
            } else {
                message.error(res.msg)
            }
        })
    }

    /**
     * @desc 处理扇形数据
     */
    dealFanData = (data) => {
        const {DataView} = DataSet
        const dv = new DataView()
        if (data && Object.keys(data)) {
            dv.source(data).transform({
                type: 'percent',
                field: 'count',
                dimension: 'type',
                as: 'percent'
            })
            return dv
        } else {
            // message.error(`数据异常`)
        }

    }

    /**
     * @desc 处理柱状图数据
     */
    dealBarData = (data) => {
        if (data && Object.keys(data)) {
            const ds = new DataSet()
            const dv = ds.createView().source(data)
            dv.transform({
                type: 'fold',
                fields: ['activity', 'service', 'broadcastReceiver', 'contentProvider'],
                // 展开字段集
                key: 'key',
                // key字段
                value: 'value' // value字段
            })
            return dv
        } else {
            // message.error(`数据异常`)
        }
    }

  /**
   * @desc 判断对象是否为空
   */
  checkNullObj = obj=> {
    return JSON.stringify(obj)!=='{}'
  }

  render () {
        const {basicInfo, scoreStandard, staticScan, appSecurityScan, unitTest, uiTest, performanceTest, host} = this.state
        return (
            <div>
                <Card title="基本信息" style={{marginTop: 30}}>
                    <Row>
                        {basicInfo && this.checkNullObj(basicInfo) && <Col span={12}>

                            <LabelItem label={'Identifier：'}>{basicInfo.packageName || '-'}</LabelItem>
                            <LabelItem label={'Target SDK：'}>{basicInfo.targetSdk || '-'}</LabelItem>
                            <LabelItem label={'Min SDK：'}>{basicInfo.minSdk || '-'}</LabelItem>
                            <LabelItem label={'Version Code：'}>{basicInfo.versionCode || '-'}</LabelItem>
                            <LabelItem label={'Version Name：'}>{basicInfo.versionName || '-'}</LabelItem>
                            <LabelItem label={'Size：'}>{basicInfo.appFileSize || '-'}</LabelItem>
                            {basicInfo.sourcePackagePath&&
                            <LabelItem label={'源包下载：'}>
                              <a href={`http://${host}/download/downloadApk?filePath=${basicInfo.sourcePackagePath}`}>点击下载</a>
                            </LabelItem>
                            }
                            {basicInfo.reinforcePackagePath&&
                            <LabelItem label={'加固包下载：'}>
                                <a href={`http://${host}/download/downloadApk?filePath=${basicInfo.reinforcePackagePath}`}>点击下载</a>
                            </LabelItem>
                            }
                            {basicInfo.patchPackagePath &&
                            <LabelItem label={'补丁包下载：'}>
                              <a href={`http://${host}/download/downloadApk?filePath=${basicInfo.patchPackagePath}`}>点击下载</a>
                            </LabelItem>
                            }
                        </Col>}
                        {scoreStandard && scoreStandard.items &&
                        <Col span={8}>
                            <ScoreChart data={scoreStandard.items}></ScoreChart>
                        </Col>
                        }
                        {scoreStandard && scoreStandard.compositeScore &&
                        <Col span={4}>
                            <p>综合评分:</p>
                            <p style={{fontSize: 80, fontWeight: 'bold'}}>{scoreStandard.compositeScore}</p>
                        </Col>
                        }
                    </Row>
                </Card>
                {staticScan &&  this.checkNullObj(staticScan) &&
                    <StaticScanChart data={staticScan}/>
                }
                {appSecurityScan && appSecurityScan.appType === 1 && <SecurityScanChart data={appSecurityScan}/>}
                {appSecurityScan && appSecurityScan.appType === 2 && <IosSecurityScanChart data={appSecurityScan}/>}
                {unitTest && this.checkNullObj(unitTest) &&
                    <UnitTestChart data={unitTest}/>
                }
                {   uiTest && this.checkNullObj(uiTest) &&
                    <UITestChart data={uiTest}/>
                }
                {   performanceTest && this.checkNullObj(performanceTest) &&
                    <PerformanceTestChart data={performanceTest}/>
                }
            </div>
        )
    }
}

export default connect(state => {
    return {
        projectId: state.projectId
    }
}, {})(ExecutionReport)
