import React from "react";
import FanChart from './FanChart';
import {Row, Col, Progress, Card} from 'antd';

class UITestChart extends React.Component {
  constructor(props) {
    super(props)
    // this.initChart = this.initChart.bind(this)
  }
  componentDidMount() {
    // this.initChart();
  }
  render() {
    const { data } = this.props
    return (
        <Card  title="UI测试" style={{marginTop: 30}}>
          <Row gutter={16}>
            {data.setps && data.setps.rows.length!== 0 &&
            <Col span={12} style={{minWidth:550}}>
              <Card
                  type="inner"
                  title="Setps："
              >
                <FanChart data={data.setps}/>
              </Card>
            </Col>
            }
            {data.scenarios && data.scenarios.rows.length!== 0 &&
            <Col span={12} style={{minWidth:550}}>
              <Card
                  type="inner"
                  title="Scenarios："
              >
                <FanChart data={data.scenarios}/>
              </Card>
            </Col>
            }
            {data.features && data.features.rows.length!== 0 &&
            <Col span={12}  style={{minWidth:550,marginTop:16}}>
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
