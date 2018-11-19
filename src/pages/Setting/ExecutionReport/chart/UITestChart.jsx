import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend
} from "bizcharts";
import DataSet from "@antv/data-set";
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
    const { DataView } = DataSet;
    const data = [
      {
        item: "事例一",
        count: 40
      },
      {
        item: "事例二",
        count: 21
      },
      {
        item: "事例三",
        count: 17
      },
      {
        item: "事例四",
        count: 13
      },
      {
        item: "事例五",
        count: 9
      }
    ];
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    console.log(dv)
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
        <Card  title="UI测试" style={{marginTop: 30}}>
          <Row gutter={16}>
            <Col span={8}>
              <Card
                  type="inner"
                  title="Setps："
              >
                <Chart
                    height={400}
                    data={dv}
                    scale={cols}
                    padding={[80, 100, 80, 80]}
                    forceFit
                >
                  <Coord type="theta" radius={0.75} />
                  <Axis name="percent" />
                  <Legend/>
                  <Tooltip
                      showTitle={false}
                      itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                  />
                  <Geom
                      type="intervalStack"
                      position="percent"
                      color="item"
                      tooltip={[
                        "item*percent",
                        (item, percent) => {
                          percent = percent * 100 + "%";
                          return {
                            name: item,
                            value: percent
                          };
                        }
                      ]}
                      style={{
                        lineWidth: 1,
                        stroke: "#fff"
                      }}
                  >
                    <Label
                        content="percent"
                        formatter={(val, item) => {
                          return item.point.item + ": " + val;
                        }}
                    />
                  </Geom>
                </Chart>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                  type="inner"
                  title="Scenarios："
              >
                <Chart
                    height={400}
                    data={dv}
                    scale={cols}
                    padding={[80, 100, 80, 80]}
                    forceFit
                >
                  <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
                  <Axis name="percent" />
                  <Legend/>
                  <Tooltip
                      showTitle={false}
                      itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                  />
                  <Geom
                      type="intervalStack"
                      position="percent"
                      color="item"
                      tooltip={[
                        "item*percent",
                        (item, percent) => {
                          percent = percent * 100 + "%";
                          return {
                            name: item,
                            value: percent
                          };
                        }
                      ]}
                      style={{
                        lineWidth: 1,
                        stroke: "#fff"
                      }}
                  >
                    <Label
                        content="percent"
                        formatter={(val, item) => {
                          return item.point.item + ": " + val;
                        }}
                    />
                  </Geom>
                </Chart>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                  type="inner"
                  title="Features："
              >
                <Chart
                    height={400}
                    data={dv}
                    scale={cols}
                    padding={[80, 100, 80, 80]}
                    forceFit
                >
                  <Coord type="theta" radius={0.75} />
                  <Axis name="percent" />
                  <Legend/>
                  <Tooltip
                      showTitle={false}
                      itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                  />
                  <Geom
                      type="intervalStack"
                      position="percent"
                      color="item"
                      tooltip={[
                        "item*percent",
                        (item, percent) => {
                          percent = percent * 100 + "%";
                          return {
                            name: item,
                            value: percent
                          };
                        }
                      ]}
                      style={{
                        lineWidth: 1,
                        stroke: "#fff"
                      }}
                  >
                    <Label
                        content="percent"
                        formatter={(val, item) => {
                          return item.point.item + ": " + val;
                        }}
                    />
                  </Geom>
                </Chart>
              </Card>
            </Col>
          </Row>

        </Card>
    );
  }
}

export default UITestChart;
