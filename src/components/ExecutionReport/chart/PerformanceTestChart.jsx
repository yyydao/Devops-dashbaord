import React from "react";

import { Card} from 'antd';

import Dashbroad from './Dashbroad'
class PerformanceTestChart extends React.Component {
  render() {
    const { data } = this.props
    return (
        <Card  title="性能测试" style={{marginTop: 30}}>
          <div>
            {
              data.averageCpuRatio&&
              <Dashbroad
                  id={'haha1'}
                  name={'平均CPU使用率'}
                  color={[
                    [0.65, '#1890ff'],
                    [1, '#FF6A6A']
                  ]}
                  unit={'%'}
                  value={parseFloat(data.averageCpuRatio)||0}
                  max={100}/>
            }
            {
              data.averageMemory&&
              <Dashbroad
                  id={'haha2'}
                  name={'平均内存使用'}
                  color={[
                    [0.9, '#1890ff'],
                    [1, '#FF6A6A']
                  ]}
                  unit={'MB'}
                  value={parseFloat(data.averageMemory)||0}
                  max={300}/>
            }
            {
              data.averageFluency&&
              <Dashbroad
                  id={'haha3'}
                  name={'平均流畅值'}
                  color={[
                    [0.5, '#FF6A6A'],
                    [1, '#1890ff']
                  ]}
                  unit={'帧/s'}
                  value={parseFloat(data.averageFluency)||0}
                  max={60}/>
            }
            {
              data.coldBootTime&&
              <Dashbroad
                  id={'haha4'}
                  name={'冷启动时间'}
                  color={[
                    [0.83, '#1890ff'],
                    [1, '#FF6A6A']
                  ]}
                  unit={'ms'}
                  value={parseFloat(data.coldBootTime)||0}
                  max={3000}/>
            }
            {
              data.maxCpuRatio&&
              <Dashbroad
                  id={'haha5'}
                  name={'最高CPU使用率'}
                  color={[
                    [0.65, '#1890ff'],
                    [1, '#FF6A6A']
                  ]}
                  unit={'%'}
                  value={parseFloat(data.maxCpuRatio)||0}
                  max={100}/>
            }
            {
              data.maxMemory&&
              <Dashbroad
                  id={'haha6'}
                  name={'最高内存使用率'}
                  color={[
                    [0.9, '#1890ff'],
                    [1, '#FF6A6A']
                  ]}
                  unit={'MB'}
                  value={parseFloat(data.maxMemory)||0}
                  max={300}/>
            }
            {
              data.minFluency&&
              <Dashbroad
                  id={'haha7'}
                  name={'最低流畅值'}
                  color={[
                    [0.5, '#FF6A6A'],
                    [1, '#1890ff']
                  ]}
                  unit={'帧/s'}
                  value={parseFloat(data.minFluency)||0}
                  max={60}/>
            }
          </div>
        </Card>
    );
  }
}

export default PerformanceTestChart;
