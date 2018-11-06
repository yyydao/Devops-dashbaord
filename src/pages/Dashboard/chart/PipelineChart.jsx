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
        mask: "MM-DD hh:mm",
        alias:'日期'
        // formatter: () => {}, // 格式化文本内容
      },
      execTime:{
        alias:'执行耗时(s)'
      }
    };
    const titles={
      autoRotate: false,
      position: 'end',
      offset: 70
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
                title={titles}
                label={{autoRotate: false}}
            />
            <Tooltip
                crosshairs={{
                  type: "y"
                }}
            />
            <Geom
                type="line"
                position="createTime*execTime"
                size={2}
                color={"stepName"}
                tooltip={['stepName*stepCategory*execTime', (stepName, stepCategory,execTime) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: `${stepName}(${type[stepCategory]})`,
                    value: execTime
                  };
                }]}
            />
            <Geom
                type="point"
                position="createTime*execTime"
                size={4}
                shape={"circle"}
                color={"stepName"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
                tooltip={['stepName*stepCategory*execTime', (stepName, stepCategory,execTime) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: `${stepName}(${type[stepCategory]})`,
                    value: execTime
                  };
                }]}
            />
          </Chart>
        </div>
    );
  }
}

export default pipelineChart;
