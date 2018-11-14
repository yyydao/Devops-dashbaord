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

class CpuChart extends React.Component {
  render() {
    const scale = {
      createTime: {
        type: "timeCat",
        mask: "MM-DD HH:mm",
        alias:'日期'
      },
      cpuValue:{
        alias:'CPU(%)',
        min:0,
        max:100,
        tickInterval:20
      },
      memoryValue:{
        alias:'内存(MB)',
        min:0
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
          <Chart height={400}
                 data={this.props.cpuData}
                 scale={scale} padding="auto"
                 forceFit
                 onTooltipChange={(ev)=>{
                   if(ev.items.length===3){
                     ev.items.splice(1)
                   }
                  ev.items.map(item=>{
                    if(item.name.indexOf('CPU')>-1){
                      item.value=item.value+"%"
                    }
                    if(item.name.indexOf('内存')>-1){
                      item.value=item.value+"MB"
                    }
                  })
                }}>
            <Legend />
            <Axis name="cpuValue"
                  label={{
                    autoRotate: false
                  }}
                  title={{
                    autoRotate: false,
                    position: 'end',
                    offset: 50
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
            <Axis name="memoryValue"
                  label={{
                    autoRotate: false
                  }}
                  title={{
                    autoRotate: false,
                    position: 'end',
                    offset: 60
                  }}
            />
            <Tooltip
                crosshairs={{
                  type: "y"
                }}
            />
            <Geom
                type="line"
                position="createTime*cpuValue"
                size={2}
                color={"cpu"}
                shape={"smooth"}
            />
            <Geom
                type="point"
                position="createTime*cpuValue"
                size={4}
                shape={"circle"}
                color={"cpu"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
            />
            <Geom
                type="line"
                position="createTime*memoryValue"
                size={2}
                color={["memory", ['#ff0000', '#FFA500']]}
                shape={"smooth"}
            />
            <Geom
                type="point"
                position="createTime*memoryValue"
                size={4}
                shape={"circle"}
                color={["memory", ['#ff0000', '#FFA500']]}
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

export default CpuChart;
