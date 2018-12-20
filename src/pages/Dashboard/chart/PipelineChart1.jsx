
import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';

// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';

class PipelineChart1 extends Component {
  constructor(props) {
    super(props)
    this.setOptions = this.setOptions.bind(this)
    this.initChart = this.initChart.bind(this)
  }
  componentDidMount() {
    this.initChart();
  }
  componentDidUpdate() {
    this.initChart();
  }

  formatSeconds = (value) =>{
    let theTime = parseInt(value, 0),// 秒
      theTime1 = 0,// 分
      theTime2 = 0// 小时
    if(theTime > 60) {
      theTime1 = parseInt(theTime/60, 0)
      theTime = parseInt(theTime%60, 0)
      if(theTime1 > 60) {
        theTime2 = parseInt(theTime1/60, 0)
        theTime1 = parseInt(theTime1%60, 0)
      }
    }
    let result = ""+parseInt(theTime, 0)+"s";
    if(theTime1 > 0) {
      result = ""+parseInt(theTime1, 0)+"''"+result;
    }
    if(theTime2 > 0) {
      result = ""+parseInt(theTime2, 0)+"'"+result;
    }
    return result;
  }
  zeroize = (value, length) =>{
    if (!length) length = 2;
    value = String(value);
    let zeros = ''
    for (let i = 0; i < (length - value.length); i++) {
      zeros += '0';
    }
    return zeros + value;
  }

  initChart = () =>{
    const { pipeLineData } = this.props
    let myChart = echarts.init(this.refs.pieChart)
    myChart.showLoading()
    let options = this.setOptions(pipeLineData)
    myChart.setOption(options,true)
    myChart.hideLoading()
  }

  setOptions=(data)=> {
    const type=['开始','构建','测试','部署','完成','无']
    let legend=[]
    let series=[]
    if(data){
      data.map(item => {
        legend.push(item.stepName);
        series.push({
          name:item.stepName,
          type:'line',
          stack: '总量',
          areaStyle: {},
          data:item.data,
          markPoint:{
            symbolSize:5
          }
        })
        return item
      })
    }
    return {
      tooltip : {
        trigger: 'axis',
        backgroundColor:'rgba(255,255,255, 0.95)',
        extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);',
        textStyle:{
          color:"#595959"
        },
        formatter: (params) =>{
          let res=`<div><p style="font-size: 12px;margin-bottom: 4px">${params[0].data[0]}</p></div>`
          for(let i=0;i<params.length;i++){
            let marker=params[i].marker.split(":10")
            let markerString=marker.join(":6")
            res+=`<p style="width: 180px;font-size: 12px;margin-bottom: 0px">${markerString}${params[i].seriesName}(${type[params[i].data[2]]}):<span style="float:right;padding-right: 8px">${this.formatSeconds(params[i].data[1])}</span></p>`
          }
          return res;
        }
      },
      legend: {
        data:legend
      },
      color:["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089",'#1890ff','#2fc25b','#facc14','#f5222d','#8543e0','#13c2c2','#ad4e00','#919191'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          axisLabel:{
            formatter: (value, index)=>{
              // 格式化成月/日，只在第一个刻度显示年份
              var date = new Date(value);
              return `${this.zeroize(date.getMonth() + 1)}-${this.zeroize(date.getDate())}\n${this.zeroize(date.getHours())}:${this.zeroize(date.getMinutes())}`;
            },
            color:(val) => "#000000",
          },
          axisLine:{
            lineStyle:{
              color:"#ccc",
              width:2
            }
          }
        }
      ],
      yAxis : [
        {
          type : 'value',
          name : '执行耗时（分钟）',
          nameGap:40,
          nameLocation:'center',
          axisLine:{
            show:false,
          },
          axisTick:{
            show:false
          },
          axisLabel:{
            formatter:(value, index)=>{
              return parseInt(value/60)
            }
          },
          splitLine:{
            lineStyle:{
              type:"dashed",
              opacity:0.5
            }
          }
        }
      ],
      series : series
    }
  }
  render() {
    return (
      <div ref="pieChart" style={{ width:'100%', height: 400,float:'left' }}></div>
    );
  }
}

export default PipelineChart1;
