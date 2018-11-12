import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";

class packageChart extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { packageData } = this.props
    const type=[,'源码','加固','补丁']
    const scale = {
      createTime: {
        type: "timeCat",
        mask: "MM-DD hh:mm",
        alias:'日期'
        // formatter: () => {}, // 格式化文本内容
      },
      appFileSize:{
        alias:'占用(MB)'
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
          <Chart height={400} data={packageData} scale={scale} padding="auto" forceFit>
            <Legend />
            <Axis name="createTime" title={titles} label={label}/>
            <Axis
                name="appFileSize"
                title={{
                  autoRotate: false,
                  position: 'end',
                  offset: 50
                }}
                label={{autoRotate: false}}
            />
            <Tooltip
                crosshairs={{
                  type: "y"
                }}
            />
            <Geom
                type="line"
                position="createTime*appFileSize"
                size={2}
                color={'name'}
                tooltip={['packageType*appFileSize*createTime', (packageType, appFileSize,createTime) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: `占用(${type[packageType]})`,
                    value: appFileSize+'MB'
                  };
                }]}
            />
            <Geom
                type="point"
                position="createTime*appFileSize"
                size={4}
                shape={"circle"}
                color={'name'}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
                tooltip={['packageType*appFileSize*createTime', (packageType, appFileSize,createTime) => {
                  return {
                    //自定义 tooltip 上显示的 title 显示内容等。
                    name: `占用(${type[packageType]})`,
                    value: appFileSize+'MB'
                  };
                }]}
            />
          </Chart>
        </div>
    );
  }
}

export default packageChart;