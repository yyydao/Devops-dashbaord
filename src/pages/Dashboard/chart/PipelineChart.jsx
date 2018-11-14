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

class pipelineChart extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { pipeLineData } = this.props
    const type=['开始','构建','测试','部署','完成']
    const scale = {
      createTime: {
        type: "timeCat",
        mask: "MM-DD HH:mm",
        alias:'日期'
        // formatter: () => {}, // 格式化文本内容
      },
      execTime:{
        alias:'执行耗时(s)',
        min:0
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
          <Chart height={400} data={pipeLineData} scale={scale} padding="auto" forceFit>
            <Legend />
            <Axis name="createTime" title={titles} label={label}/>
            <Axis
                name="execTime"
                title={{
                  autoRotate: false,
                  position: 'end',
                  offset: 70
                }}
                label={{autoRotate: false}}
            />
            <Tooltip
                crosshairs={{
                  type: "line"
                }}
            />
            {/*<Geom*/}
                {/*type="area"*/}
                {/*adjustType="stack"*/}
                {/*position="createTime*execTime"*/}
                {/*size={2}*/}
                {/*color={"stepName"}*/}
                {/*tooltip={['stepName*stepCategory*execTime', (stepName, stepCategory,execTime) => {*/}
                  {/*return {*/}
                    {/*//自定义 tooltip 上显示的 title 显示内容等。*/}
                    {/*name: `${stepName}(${type[stepCategory]})`,*/}
                    {/*value: execTime+'s'*/}
                  {/*};*/}
                {/*}]}*/}
            {/*/>*/}
            <Geom type="areaStack"
                  position="createTime*execTime"
                  size={2}
                  color={"stepName"}
                  tooltip={['stepName*stepCategory*execTime', (stepName, stepCategory,execTime) => {
                    return {
                      //自定义 tooltip 上显示的 title 显示内容等。
                      name: `${stepName}(${type[stepCategory]})`,
                      value: execTime+'s'
                    };
                  }]}/>
            <Geom type="lineStack"
                  position="createTime*execTime"
                  size={2}
                  color={"stepName"}
                  tooltip={['stepName*stepCategory*execTime', (stepName, stepCategory,execTime) => {
                    return {
                      //自定义 tooltip 上显示的 title 显示内容等。
                      name: `${stepName}(${type[stepCategory]})`,
                      value: execTime+'s'
                    };
                  }]}/>
          </Chart>
        </div>
    );
  }
}

export default pipelineChart;
