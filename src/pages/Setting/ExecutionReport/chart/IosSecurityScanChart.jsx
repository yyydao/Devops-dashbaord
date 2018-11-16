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
import LabelItem from '../LabelItem';
class IosSecurityScanChart extends React.Component {
  render() {
    const data = [
      {
        name: "London",
        "Jan.": 18.9,
        "Feb.": 28.8,
        "Mar.": 39.3,
        "Apr.": 81.4,
        May: 47,
        "Jun.": 20.3,
        "Jul.": 24,
        "Aug.": 35.6
      },
      {
        name: "Berlin",
        "Jan.": 12.4,
        "Feb.": 23.2,
        "Mar.": 34.5,
        "Apr.": 99.7,
        May: 52.6,
        "Jun.": 35.5,
        "Jul.": 37.4,
        "Aug.": 42.4
      }
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."],
      // 展开字段集
      key: "月份",
      // key字段
      value: "月均降雨量" // value字段
    });
    const { DataView } = DataSet;
    const data1 = [
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
    const dv1 = new DataView();
    dv1.source(data1).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
        <Card  title="APP安全扫描" style={{marginTop: 30}}>
          <Row style={{marginTop: 30}} gutter={16}>
            <Col span={12}>
              <Card
                  type="inner"
                  title="安全问题："
              >
                <Chart
                    height={400}
                    data={dv1}
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
            <Col span={12}>
              <Card
                  type="inner"
                  title="文件扫描："
              >
                <Chart
                    height={400}
                    data={dv1}
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

export default IosSecurityScanChart;
