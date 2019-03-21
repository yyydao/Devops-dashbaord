import React from "react";
import {withRouter} from 'react-router-dom'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";

class packageChart extends React.Component {
  render() {
    const {data} = this.props
    const scale = {
      version: {
        alias: '版本'
        // formatter: () => {}, // 格式化文本内容
      },
      size: {
        min: 0,
        formatter: value => value + 'MB', // 格式化文本内容
      }
    };
    const titles = {
      autoRotate: false,
      position: 'end',
      offset: 20
    }
    const label = {
      autoRotate: false
    }
    return (
      <div>
        <Chart height={400} data={data} scale={scale} padding="auto" forceFit>
          <Legend/>
          <Axis name="version" title={titles} label={label}/>
          <Axis
            name="size"
          />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="version*size"
            size={2}
            color={['name', ['#F5222D ', '#1890FF', '#2FC25B', '#FACC14', '#8543E0', '#AD4E00', '#c95afe', '#6170f2', '#2096f3']]}
            tooltip={['name*size*version', (name, size, version) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: name,
                value: size + 'MB'
              };
            }]}
          />
          <Geom
            type="point"
            position="version*size"
            size={4}
            shape={"circle"}
            color={['name', ['#F5222D ', '#1890FF', '#2FC25B', '#FACC14', '#8543E0', '#AD4E00', '#c95afe', '#6170f2', '#2096f3']]}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
            tooltip={['name*size*version', (name, size, version) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: name,
                value: size + 'MB'
              };
            }]}
          />
        </Chart>
      </div>
    );
  }
}

export default withRouter(packageChart)
