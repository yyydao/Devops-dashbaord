import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";
import {Row, Col, Card, Button} from 'antd';
import FanChart from './FanChart';
class SecurityScanChart extends React.Component {

  render() {
    const { data, detailUrl } = this.props
    return (
        <Card  title="APP安全扫描" style={{marginTop: 30}} extra={<Button type="primary"><a href={detailUrl} target="_blank">查看详情</a></Button>}>
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
            <Col span={12} style={{minWidth:520}}>
              <Card
                  type="inner"
                  title="安全问题："
              >
                <FanChart data={data.safetyProblem}/>
              </Card>
            </Col>
            }
            {data.sensitiveInfo && data.sensitiveInfo.rows.length!== 0 &&
            <Col span={12} style={{minWidth:520}}>
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
