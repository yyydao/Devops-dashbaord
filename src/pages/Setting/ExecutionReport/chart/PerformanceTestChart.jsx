import React from "react";

import {Row, Col, Card} from 'antd';

import Dashbroad from './dashbroad'
class PerformanceTestChart extends React.Component {
  render() {
    return (
        <Card  title="性能测试" style={{marginTop: 30}}>
          <div>
            <Dashbroad id={'haha1'} name={'平均CPU使用率'}/>
            <Dashbroad id={'haha2'} name={'平均内存使用'}/>
            <Dashbroad id={'haha3'} name={'平均流畅值'}/>
            <Dashbroad id={'haha4'} name={'冷启动时间'}/>
            <Dashbroad id={'haha5'} name={'最高CPU使用率'}/>
            <Dashbroad id={'haha6'} name={'最高内存使用率'}/>
            <Dashbroad id={'haha7'} name={'最低流畅值'}/>
          </div>
        </Card>
    );
  }
}

export default PerformanceTestChart;
