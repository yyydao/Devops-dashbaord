import React from "react";

import {Row, Col, Card} from 'antd';
import FanChart from './FanChart';
class IosSecurityScanChart extends React.Component {
  render() {
    const { data } = this.props
    return (
        <Card  title="APP安全扫描" style={{marginTop: 30}}>
          <Row style={{marginTop: 30}} gutter={16}>
            <Col span={12}>
              <Card
                  type="inner"
                  title="安全问题："
              >
                <FanChart data={data.iosSafetyProblem}/>
              </Card>
            </Col>
            <Col span={12}>
              <Card
                  type="inner"
                  title="文件扫描："
              >
                <FanChart data={data.fileScan}/>
              </Card>
            </Col>
          </Row>

        </Card>
    );
  }
}

export default IosSecurityScanChart;
