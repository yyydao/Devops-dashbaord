import React from "react";
import {withRouter} from 'react-router-dom'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";

class UiTestChart extends React.Component {
  render() {
    const scale = {
      createTime: {
        type: "timeCat",
        mask: "MM-DD HH:mm",
        alias:'日期'
      },
      successRateValue:{
        alias:'百分比(%)',
        min:0,
        max:100,
        tickInterval:20
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
          <Chart height={400} data={this.props.uiData} padding="auto" scale={scale} forceFit onPlotClick={ev => {
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
                name="successRateValue"
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
                position="createTime*successRateValue"
                size={2}
                color={"successRate"}
                tooltip={['successRate*successRateValue*createTime', (successRate, successRateValue,createTime) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: successRate,
                    value: successRateValue+'%'
                  };
                }]}
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
                tooltip={['successRate*successRateValue*createTime', (successRate, successRateValue,createTime) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: successRate,
                    value: successRateValue+'%'
                  };
                }]}
            />
          </Chart>
        </div>
    );
  }
}

export default withRouter(UiTestChart)
