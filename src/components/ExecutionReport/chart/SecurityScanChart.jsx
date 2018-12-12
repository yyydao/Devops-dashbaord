import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";
import {Row, Col, Card} from 'antd';
import FanChart from './FanChart';
class SecurityScanChart extends React.Component {

  render() {
    const { data } = this.props
    return (
        <Card  title="APP安全扫描" style={{marginTop: 30}}>
          {
            data.fourComponents&&data.fourComponents.rows.length!== 0&&
            <Card
                type="inner"
                title="四大组件："
            >
              <Chart height={400} data={data.fourComponents} forceFit>
                <Axis name="key" />
                <Axis name="value" />
                <Legend />
                <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                />
                <Geom
                    type="interval"
                    position="key*value"
                    color={"name"}
                    adjust={[
                      {
                        type: "dodge",
                        marginRatio: 1 / 32
                      }
                    ]}
                />
              </Chart>
            </Card>
          }
          <Row style={{marginTop: 30}} gutter={16}>
            {data.safetyProblem && data.safetyProblem.rows.length!== 0 &&
            <Col span={12} style={{minWidth:600}}>
              <Card
                  type="inner"
                  title="安全问题："
              >
                <FanChart data={data.safetyProblem}/>
              </Card>
            </Col>
            }
            {data.sensitiveInfo && data.sensitiveInfo.rows.length!== 0 &&
            <Col span={12} style={{minWidth:600}}>
              <Card
                  type="inner"
                  title="敏感信息："
              >
                <FanChart data={data.sensitiveInfo}/>
              </Card>
            </Col>
            }
          </Row>

        </Card>
    );
  }
}

export default SecurityScanChart;
