import React from "react";
import FanChart from './FanChart';
import {Row, Col, Progress, Card, Button} from 'antd';
class UnitTestChart extends React.Component {
  render() {
    const { data, detailUrl } = this.props;
    return (
        <Card  title="单元测试" style={{marginTop: 30}} extra={<Button type="primary"><a href={detailUrl} target="_blank">查看详情</a></Button>}>
          <Col span={9}>
            <p>执行结果：</p>
            <FanChart data={data.executionResult}/>
          </Col>
          <Row>
            <Col span={5}>
              <p>总覆盖率：</p>
              <div style={{margin:"0 auto",width:200}}>
                <Progress
                    style={{marginTop:24}}
                    width={200}
                    strokeWidth={12}
                    type="circle"
                    percent={parseFloat(data.totalCoverageRate)||0} format={() =>parseFloat(data.totalCoverageRate||0)+"%"}/>
              </div>
            </Col>
            <Col span={5}>
              <p>代码覆盖率：</p>
              <div style={{margin:"0 auto",width:200}}>
                <Progress
                    style={{marginTop:24}}
                    width={200}
                    strokeWidth={12}
                    type="circle"
                    percent={parseFloat(data.codeCoverageRate)||0} format={() =>parseFloat(data.codeCoverageRate||0)+"%"}/>
              </div>
            </Col>
            <Col span={5}>
              <p>分支覆盖率：</p>
              <div style={{margin:"0 auto",width:200}}>
                <Progress
                    style={{marginTop:24}}
                    width={200}
                    strokeWidth={12}
                    type="circle"
                    percent={parseFloat(data.branchCoverageRate)||0} format={() =>parseFloat(data.branchCoverageRate||0)+"%"}/>
              </div>
            </Col>
          </Row>
        </Card>
    );
  }
}

export default UnitTestChart;
