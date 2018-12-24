import React from "react";

import {Row, Col, Progress, Card, Button} from 'antd';
import LabelItem from '../LabelItem';
import FanChart from './FanChart'
class StaticScanChart extends React.Component {
  render() {
    const { data, detailUrl } = this.props
    return (
        <Card  title="静态扫描" style={{marginTop: 30}} extra={<Button type="primary"><a href={detailUrl} target="_blank">查看详情</a></Button>}>
          <Row>
            <Col span={8}>
              <LabelItem label={"代码总行数："}>{data.totalCodeNum}</LabelItem>
              <LabelItem label={"债务："}>{data.debt}</LabelItem>
              <p>债务比：</p>
              <div style={{marginTop:"80px",width:200}}>
                <Progress style={{marginTop:24}} width={200} strokeWidth={12} type="circle" percent={parseFloat(data.debtRatio)||0} format={() =>parseFloat(data.debtRatio||0)+"%"} />
              </div>
            </Col>
            <Col span={8}>
              <p className='scan-paragraph'></p>
              <p className='scan-paragraph'></p>
              <p>注释比：</p>
              <div style={{marginTop:"80px",width:200}}>
                <Progress style={{marginTop:24}} width={200} strokeWidth={12} type="circle" percent={parseFloat(data.annotatedRatio)||0} format={() =>parseFloat(data.annotatedRatio||0)+"%"} />
              </div>
            </Col>
            <Col span={8}>
              <p className='scan-paragraph'></p>
              <p className='scan-paragraph'></p>
              <p>基本数据统计：</p>
              <FanChart data={data.basicDataStatistics} />
            </Col>

          </Row>
        </Card>
    );
  }
}

export default StaticScanChart;
