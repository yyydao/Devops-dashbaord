import React from "react";
import {withRouter} from 'react-router-dom'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";

class UnitTestChart extends React.Component {
  render() {
    const { unitData } = this.props;
    const cols = {
      createTime: {
        type: "timeCat",
        mask: "MM-DD HH:mm",
        alias:'日期'
      },
      sqaleValue:{
        alias:'百分比(%)',
        min:0,
        max:100,
        tickInterval:20
      }
    };
    const titles={
      autoRotate: false,
      position: 'end',
      offset: 20
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
          <Chart height={400} data={unitData} scale={cols} padding="auto" forceFit onPlotClick={ev => {
            console.log(ev)
            if(ev.data){
              this.props.history.push({
                pathname: `/pipeline/detail/${ev.data._origin.taskID}`,
                search: `?buildNumber=${ev.data._origin.buildNum}&curRecordNo=${ev.data._origin.curRecordNo}&platform=${ev.data._origin.platform}`,
                state:{
                  taskStatus:2
                }
              })
            }
          }}>
            <Legend />
            <Axis name="createTime" title={titles} label={label}/>
            <Axis
                name="sqaleValue"
                label={{autoRotate: false}}
                title
            />
            <Tooltip
                crosshairs={{
                  type: "y"
                }}
            />
            <Geom
                type="line"
                position="createTime*sqaleValue"
                size={2}
                color={"metric"}
                tooltip={['metric*sqaleValue*createTime', (metric, sqaleValue,createTime) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: metric,
                    value: sqaleValue+'%'
                  };
                }]}
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
                tooltip={['metric*sqaleValue*createTime', (metric, sqaleValue,createTime) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: metric,
                    value: sqaleValue+'%'
                  };
                }]}
            />
          </Chart>
        </div>
    );
  }
}

export default withRouter(UnitTestChart);
