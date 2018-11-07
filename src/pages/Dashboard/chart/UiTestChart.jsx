import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

class UiTestChart extends React.Component {
  render() {
    const scale = {
      createTime: {
        type: "timeCat",
        mask: "MM-DD hh:mm",
        alias:'日期'
      },
      successRateValue:{
        alias:'百分比(%)'
      }
    };
    const label = {
      autoRotate: false,
      formatter(text, item, index) {
        let arr = text.split(' ');
        return `${arr[0]}\n${arr[1]}`;
      }
    }
    const titles={
      autoRotate: false,
      position: 'end',
      offset: 20
    }
    return (
        <div>
          <Chart height={400} data={this.props.uiData} padding="auto" scale={scale} forceFit>
            <Legend />
            <Axis name="createTime" title={titles} label={label}/>
            <Axis
                name="successRateValue"
                label={{autoRotate: false}}
                title={{
                  autoRotate: false,
                  position: 'end',
                  offset: 70
                }}
            />
            <Tooltip
                crosshairs={{
                  type: "y"
                }}
            />
            <Geom
                type="line"
                position="createTime*successRateValue"
                size={2}
                color={"successRate"}
            />
            <Geom
                type="point"
                position="createTime*successRateValue"
                size={4}
                shape={"circle"}
                color={"successRate"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
            />
          </Chart>
        </div>
    );
  }
}

export default UiTestChart;
