import Welcome from '@/pages/Welcome';

import Home from '@/pages/Home';
import Personal from '@/pages/Home/Personal';

import MemberManager from '@/pages/Setting/MemberManager';
import ProjectInfo from '@/pages/Setting/ProjectInfo';
import Branch from '@/pages/Setting/Branch';
import ConfigManager from '@/pages/Setting/ConfigManager';
import PackageConfigManager from '@/pages/Setting/ConfigManager/PackageConfig';
import PerformanceConfigManager from '@/pages/Setting/ConfigManager/PerformanceConfig';
import Pipeline from '@/pages/Pipeline'
import PipelineDetail from '@/pages/Pipeline/detail'
import PipelineAdd from '@/pages/Pipeline/add'
import PipelineEdit from '@/pages/Pipeline/editPipeline'
import pipelineTask from '@/pages/Pipeline/task'
import pipelineTaskEdit from '@/pages/Pipeline/editTask'

import Performance from '@/pages/Test/Performance';
import Package from '@/pages/Package/';
import PackageList from '@/pages/Package/list';
import PackageDetail from '@/pages/Package/detail';

export default [
    {
        path: '/',
        name: 'home',
        component: Home,
        hideSideBar: true
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        hideSideBar: true
    },
    {
        path: '/personal',
        name: 'personal',
        component: Personal,
        hideSideBar: true
    },
    {
        path: '/welcome/:id',
        name: 'welcome',
        component: Welcome
    },
    {
        path: '/projectInfo',
        name: 'projectInfo',
        component: ProjectInfo
    },
    {
        path: '/memberManager',
        name: 'memberManager',
        component: MemberManager
    },
    {
        path: '/branch',
        name: 'branch',
        component: Branch
    },
    {
        path: '/configManager',
        name: 'configManager',
        component: ConfigManager
    },
    {
        path: '/configManager/packageConfig/:id',
        name: 'packageConfigManager',
        component: PackageConfigManager
    },
    {
        path: '/configManager/performanceConfig/:id',
        name: 'performanceConfigManager',
        component: PerformanceConfigManager
    },
    {
        path: '/performanceConfig',
        name: 'performance',
        component: Performance
    },
    {
        path: '/package',
        name: 'package',
        component: Package
    },
    {
        path: '/package/:envId',
        name: 'packageList',
        component: PackageList
    },
    {
        path: '/package/detail/:buildId',
        name: 'packageDetail',
        component: PackageDetail
    },
    {
        path: '/pipeline',
        name: 'pipeline',
        component: Pipeline
    },
    {
        path: '/pipeline/detail/:taskID',
        name: 'pipelineDetail',
        component: PipelineDetail
    },
    {
        path: '/pipeline/add',
        name: 'PipelineAdd',
        component: PipelineAdd
    },
    {
        path: '/pipeline/task',
        name: 'pipelineTask',
        component: pipelineTask
    },
    {
        path: '/pipeline/task/edit',
        name: 'pipelineTaskEdit',
        component: pipelineTaskEdit
    },
    {
        path: '/pipeline/edit/:taskID',
        name: 'PipelineEdit',
        component: PipelineEdit
    }
]
