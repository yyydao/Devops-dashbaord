import React from "react";

import {Row, Col, Progress, Card} from 'antd';
import LabelItem from '../LabelItem';
import FanChart from './FanChart'
class StaticScanChart extends React.Component {
  render() {
    const { data } = this.props
    return (
        <Card  title="静态扫描" style={{marginTop: 30}}>
          <Row>
            <Col span={6}>
              <LabelItem label={"代码总行数："}>{data.totalCodeNum}</LabelItem>
              <LabelItem label={"债务："}>{data.debt}</LabelItem>
              <p>债务比：</p>
              <div style={{margin:"0 auto",width:200}}>
                <Progress style={{marginTop:24}} width={200} strokeWidth={12} type="circle" percent={parseFloat(data.debtRatio)||0} format={() =>parseFloat(data.debtRatio||0)+"%"} />
              </div>
            </Col>
            <Col span={12}>
              <p>基本数据统计：</p>
              <FanChart data={data.basicDataStatistics} />
            </Col>
            <Col span={6}>
              <p>注释比：</p>
              <div style={{margin:"0 auto",width:200}}>
                <Progress style={{marginTop:24}} width={200} strokeWidth={12} type="circle" percent={parseFloat(data.annotatedRatio)||0} format={() =>parseFloat(data.annotatedRatio||0)+"%"} />
              </div>
            </Col>
          </Row>
        </Card>
    );
  }
}

export default StaticScanChart;
