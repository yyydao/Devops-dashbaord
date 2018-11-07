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

class FluencyChart extends React.Component {
  render() {
    const scale = {
      createTime: {
        type: "timeCat",
        mask: "MM-DD hh:mm",
        alias:'日期'
      },
      smValue:{
        alias:'流畅度(帧/s)'
      },
      coldStartTimeValue:{
        alias:'冷启动时间(ms)'
      }
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
          <Chart height={400} data={this.props.fluencyData} scale={scale} padding="auto" forceFit>
            <Legend />
            <Axis name="smValue"
                  label={{
                    autoRotate: false
                  }}
                  title={{
                    autoRotate: false,
                    position: 'end',
                    offset: 60
                  }}
            />
            <Axis
                name="createTime"
                title={{
                  autoRotate: false,
                  position: 'end',
                  offset: 20
                }}
                label={label}
            />
            <Axis name="coldStartTimeValue"
                  label={{
                    autoRotate: false
                  }}
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
                itemTpl='<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{name}: {value}</li>'
            />
            <Geom
                type="line"
                position="createTime*smValue"
                size={2}
                color={"sm"}
                shape={"smooth"}
            />
            <Geom
                type="point"
                position="createTime*smValue"
                size={4}
                shape={"circle"}
                color={"sm"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
            />
            <Geom
                type="line"
                position="createTime*coldStartTimeValue"
                size={2}
                color={["coldStartTime", ['#ff0000', '#FFA500']]}
                shape={"smooth"}
            />
            <Geom
                type="point"
                position="createTime*coldStartTimeValue"
                size={4}
                shape={"circle"}
                color={["coldStartTime", ['#ff0000', '#FFA500']]}
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

export default FluencyChart;
