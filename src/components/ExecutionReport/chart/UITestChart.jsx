import React from "react";
import FanChart from './FanChart';
import {Row, Col, Card} from 'antd';

class UITestChart extends React.Component {
  render() {
    const { data } = this.props
    return (
        <Card  title="UI测试" style={{marginTop: 16}}>
          <Row gutter={16}>
            {data.setps && data.setps.rows.length!== 0 &&
            <Col span={12} style={{minWidth:520,marginTop:16}}>
              <Card
                  type="inner"
                  title="Setps："
              >
                <FanChart data={data.setps}/>
              </Card>
            </Col>
            }
            {data.scenarios && data.scenarios.rows.length!== 0 &&
            <Col span={12} style={{minWidth:520,marginTop:16}}>
              <Card
                  type="inner"
                  title="Scenarios："
              >
                <FanChart data={data.scenarios}/>
              </Card>
            </Col>
            }
            {data.features && data.features.rows.length!== 0 &&
            <Col span={12}  style={{minWidth:520,marginTop:16}}>
              <Card
                  type="inner"
                  title="Features："
              >
                <FanChart data={data.features}/>
              </Card>
            </Col>
            }
          </Row>

        </Card>
    );
  }
}

export default UITestChart;
