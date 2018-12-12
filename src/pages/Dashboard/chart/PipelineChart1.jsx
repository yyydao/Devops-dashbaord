
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
    // const {id,pipeLineData}=this.props
    // console.log(pipeLineData)
    // 基于准备好的dom，初始化echarts实例

    // var chart = echarts.init(document.getElementById(id));
    // chart.clear();
    // let option ={
    //   tooltip : {
    //     trigger: 'axis',
    //     axisPointer: {
    //       type: 'cross',
    //       label: {
    //         backgroundColor: '#6a7985'
    //       }
    //     },
    //     formatter: function (params) {
    //       console.log(params)
    //       let res=`<div><p>${params[0].data[0]}</p></div>`
    //       for(var i=0;i<params.length;i++){
    //         res+=`<p>${params[i].seriesName}(${type[params[i].data[2]]}):<span style="padding-left: 16px">${params[i].data[1]}s</span></p>`
    //       }
    //       return res;
    //     }
    //   },
    //   legend: {
    //     data:[]
    //   },
    //   grid: {
    //     left: '3%',
    //     right: '4%',
    //     bottom: '3%',
    //     containLabel: true
    //   },
    //   xAxis : [
    //     {
    //       type : 'time',
    //       boundaryGap : false
    //     }
    //   ],
    //   yAxis : [
    //     {
    //       type : 'value'
    //     }
    //   ],
    //   series : [
    //     {
    //       name:'代码拉取',
    //       type:'line',
    //       stack: '总量',
    //       areaStyle: {},
    //       data:[
    //           ["2018-11-15 17:46:33.0",20,1],["2018-11-15 17:47:33.0",200,2],["2018-11-15 17:49:33.0",20,3],["2018-11-15 17:50:33.0",20,4]
    //       ]
    //     },
    //     {
    //       name:'联盟广告',
    //       type:'line',
    //       stack: '总量',
    //       areaStyle: {},
    //       data:[
    //         ["2018-11-15 17:46:33.0",50,1],["2018-11-15 17:47:33.0",10,2],["2018-11-15 17:49:33.0",202,3],["2018-11-15 17:50:33.0",120,4]
    //       ]
    //     }
    //   ]
    // }
    // chart.setOption(option);
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
    var result = ""+parseInt(theTime, 0)+"s";
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

    for (var i = 0, zeros = ''; i < (length - value.length); i++) {

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
          data:item.data
        })
        return item
      })
    }
    return {
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type:'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: (params) =>{
          let res=`<div><p style="font-size: 12px">${params[0].data[0]}</p></div>`
          for(let i=0;i<params.length;i++){
            res+=`<p style="width: 180px;font-size: 12px">${params[i].marker}${params[i].seriesName}(${type[params[i].data[2]]}):<span style="float:right;padding-right: 8px">${this.formatSeconds(params[i].data[1])}</span></p>`
          }
          return res;
        }
      },
      legend: {
        data:legend
      },
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
            }
          }
          // boundaryGap : false
        }
      ],
      yAxis : [
        {
          type : 'value'
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
