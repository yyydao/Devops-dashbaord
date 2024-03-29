import React from "react";
import {withRouter} from 'react-router-dom'
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";

class FluencyChart extends React.Component {
  render() {
    const scale = {
      createTime: {
        type: "timeCat",
        mask: "MM-DD HH:mm",
        alias:'日期'
      },
      smValue:{
        alias:'流畅度(帧/s)',
        min:0
      },
      coldStartTimeValue:{
        alias:'冷启动时间(s)',
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
                 data={this.props.fluencyData}
                 scale={scale}
                 padding="auto"
                 forceFit
                 onTooltipChange={(ev)=>{
                   if(ev.items.length===2){
                     ev.items.splice(1)
                   }
                   ev.items.map(item=>{
                     if(item.name.indexOf('FPS')>-1){
                       item.value=item.value+"帧/s"
                     }else{
                       item.value=item.value+"s"
                     }
                     return item
                   })
                 }}
                 onPlotClick={ev => {
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
            <Axis name="smValue"
                  label={{
                    autoRotate: false
                  }}
                  title
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
                  title
            />
            <Tooltip
                crosshairs={{
                  type: "y"
                }}
            />
            <Geom
                type="line"
                position="createTime*smValue"
                size={2}
                color={"sm"}
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
                color={["coldStartTime1", ['#ff0000', '#FFA500']]}
            />
            <Geom
                type="point"
                position="createTime*coldStartTimeValue"
                size={4}
                shape={"circle"}
                color={["coldStartTime1", ['#ff0000', '#FFA500']]}
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

export default withRouter(FluencyChart);
