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
            <Col span={8}>
              <Card
                  type="inner"
                  title="Setps："
              >
                <FanChart data={data.setps}/>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                  type="inner"
                  title="Scenarios："
              >
                <FanChart data={data.scenarios}/>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                  type="inner"
                  title="Features："
              >
                <FanChart data={data.features}/>
              </Card>
            </Col>
          </Row>

        </Card>
    );
  }
}

export default UITestChart;
