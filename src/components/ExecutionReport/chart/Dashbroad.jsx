
import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/gauge';

class Dashbroad extends Component {
  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(this.props.id));
    // 绘制图表
    myChart.setOption({
      tooltip : {
        formatter: "{a} <br/>{b} : {c}"+this.props.unit
      },
      series: [
        {
          name: this.props.name,
          type: 'gauge',
          detail: {
            formatter:'{value}'+this.props.unit,
            fontSize:16
          },
          data: [{value:this.props.value, name:this.props.name}],
          min:0,
          max:this.props.max,
          title:{
            offsetCenter:[0, '80%']
          },
          axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
              color: this.props.color,
              width:18
            }
          },
          splitLine:{
            length:18
          }
        }
      ]
    });
  }
  render() {
    const {id}=this.props
    return (
        <div id={id} style={{ width:'25%',minWidth:230, height: 300,float:'left' }}></div>
    );
  }
}

export default Dashbroad;
