
import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
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
    myChart.on('click', params => {
      if(params.data[4]&&params.data[4]!==-1){
        this.props.history.push({
          pathname: `/pipeline/detail/${params.data[3]}`,
          search: `?buildNumber=${params.data[4]}&curRecordNo=${params.data[6]}&platform=${params.data[5]}`,
          state:{
            taskStatus:2
          }
        })
      }
    });
    myChart.hideLoading()
  }
  setOptions=(data)=> {
    const type=['开始','构建','测试','部署','完成','无']
    let legend=[]
    let series=[]
    if(data){
      data.map((item,index) => {
        let obj={}
        obj.name=item.stepName;
        legend.push(obj);
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
      color:['#1890FF', '#73C9E6', '#13C2C2', '#6CD9B3', '#2FC25B', '#9DD96C', '#FACC14', '#E6965C', '#F04864', '#D66BCA', '#8543E0', '#8E77ED', '#3436C7', '#737EE6', '#223273', '#7EA2E6'],
      // color:['#20b0ba', '#26c770', '#f8c517', '#f78e63', '#f4493d', '#f65896', '#c95afe', '#6170f2', '#2096f3'],
      // color:['#c1f1e8', '#bcecd2', '#f9eabc', '#f9dace', '#f8c4c1', '#f8cadd', '#eac7fe', '#cbd1f9', '#baddf9'],
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
          name : '执行耗时',
          nameGap:50,
          nameLocation:'center',
          axisLine:{
            show:false,
          },
          axisTick:{
            show:false
          },
          axisLabel:{
            formatter:(value, index)=>{
              return this.formatSeconds(value)
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

export default withRouter(PipelineChart1);
