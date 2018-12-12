import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend,
} from "bizcharts";

class ScoreChart extends React.Component {
  render() {
    const { data } = this.props
    const cols = {
      score: {
        min: 0,
        max: 100
      }
    };
    return (
        <div>
          <Chart
              height={400}
              data={data}
              padding={[20, 20, 95, 20]}
              scale={cols}
              forceFit
          >
            <Coord type="polar" radius={0.8} />
            <Axis
                name="name"
                line={null}
                tickLine={null}
                grid={{
                  lineStyle: {
                    lineDash: null
                  },
                  hideFirstLine: false
                }}
            />
            <Tooltip />
            <Axis
                name="score"
                line={null}
                tickLine={null}
                grid={{
                  type: "polygon",
                  lineStyle: {
                    lineDash: null
                  },
                  alternateColor: "rgba(0, 0, 0, 0.04)"
                }}
            />
            <Legend name="type" marker="circle" offset={30} />
            <Geom type="area" position="name*score" color="type" />
            <Geom type="line" position="name*score" color="type" size={2} />
            <Geom
                type="point"
                position="name*score"
                color="type"
                shape="circle"
                size={4}
                style={{
                  stroke: "#fff",
                  lineWidth: 1,
                  fillOpacity: 1
                }}
            />
          </Chart>
        </div>
    );
  }
}

export default ScoreChart;
