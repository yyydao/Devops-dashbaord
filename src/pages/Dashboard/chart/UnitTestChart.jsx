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
import DataSet from "@antv/data-set";

class UnitTestChart extends React.Component {
  render() {
    const { unitData } = this.props;
    const cols = {
      createTime: {
        type: "time",
        mask: "MM-DD hh:mm",
        alias:'日期'
      },
      sqaleValue:{
        alias:'百分比(%)'
      }
    };
    const titles={
      autoRotate: false,
      position: 'end',
      offset: 60
    }
    const label = {
      autoRotate: false,
      formatter(text, item, index) {
        let arr = text.split(' ');
        return `${arr[0]}\n${arr[1]}`;
      }
    }
    return (
        <div>
          <Chart height={400} data={unitData} scale={cols} padding="auto" forceFit>
            <Legend />
            <Axis name="createTime" title={titles} label={label}/>
            <Axis
                name="sqaleValue"
                label={{autoRotate: false}}
                title={titles}
            />
            <Tooltip
                crosshairs={{
                  type: "y"
                }}
                itemTpl= '<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}: {value}</li>'
            />
            <Geom
                type="line"
                position="createTime*sqaleValue"
                size={2}
                color={"metric"}
            />
            <Geom
                type="point"
                position="createTime*sqaleValue"
                size={4}
                shape={"circle"}
                color={"metric"}
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

export default UnitTestChart;
