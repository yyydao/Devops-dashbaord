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

class FanChart extends React.Component {
  render() {
    const { data } = this.props
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + "%";
          return val;
        }
      }
    };
    return (
              <Chart
                  height={400}
                  data={data}
                  scale={cols}
                  padding={[80, 100, 80, 80]}
                  forceFit
              >
                <Coord type="theta" radius={0.75} background={{
                  fill: "#eeeeee",
                }}/>
                <Axis name="percent" />
                <Legend/>
                <Tooltip
                    showTitle={false}
                    itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                />
                <Geom
                    type="intervalStack"
                    position="percent"
                    color="type"
                    tooltip={[
                      "type*percent",
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
                        return `${item.point.type} : ${item.point.count}(${parseFloat(val).toFixed(2)}%)`;
                      }}
                  />
                </Geom>
              </Chart>
    );
  }
}

export default FanChart;
