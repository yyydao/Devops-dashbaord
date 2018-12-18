import Welcome from '@/pages/Welcome';

import Home from '@/pages/Home';
import Personal from '@/pages/Home/Personal';

import MemberManager from '@/pages/Setting/MemberManager';
import ProjectInfo from '@/pages/Setting/ProjectInfo';
import Branch from '@/pages/Setting/Branch';
import ConfigManager from '@/pages/Setting/ConfigManager';
import Pipeline from '@/pages/Pipeline'
import PipelineDetail from '@/pages/Pipeline/pipelineDetail'
import PipelineAdd from '@/pages/Pipeline/addPipeline'
import PipelineEdit from '@/pages/Pipeline/editPipeline'
import pipelineTask from '@/pages/Pipeline/addTask'
import pipelineTaskEdit from '@/pages/Pipeline/editTask'

import Performance from '@/pages/Test/Performance';
import PackageOld from '@/pages/PackageOld/';
import Package from '@/pages/Package';
import PackageList from '@/pages/PackageOld/list';
import PackageDetail from '@/pages/PackageOld/detail';
import Dashboard from '@/pages/Dashboard'
import ThirdParty from '@/pages/Setting/ThirdPartyManager'
import NoticeManager from '@/pages/Setting/NoticeManager'
// import ExecutionReport from '@/pages/Setting/ExecutionReport'

import GrayscaleRelease from '@/pages/Release/GrayscaleRelease'
import AddGrayscale from '@/pages/Release/GrayscaleRelease/AddGrayscale'


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
    path: '/noticeManager',
    name: 'noticeManager',
    component: NoticeManager
  },
  {
    path: '/performanceConfig',
    name: 'performance',
    component: Performance
  },
  {
    path: '/packageold',
    name: 'packageold',
    component: PackageOld
  },
  {
    path: '/package',
    name: 'package',
    component: Package
  },
  {
    path: '/packageold/:envId',
    name: 'packageList',
    component: PackageList
  },
  {
    path: '/packageold/detail/:buildId',
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
    path: '/pipeline/task/add',
    name: 'pipelineTask',
    component: pipelineTask
  },
  {
    path: '/pipeline/task/edit',
    name: 'pipelineTaskEdit',
    component: pipelineTaskEdit
  },
  {
    path: '/pipeline/task/edit/:stepID',
    name: 'pipelineTaskEdit',
    component: pipelineTaskEdit
  },
  {
    path: '/pipeline/edit/:taskID',
    name: 'PipelineEdit',
    component: PipelineEdit
  },{
    path: '/dashboard/:id',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/thirdparty',
    name: 'thirdparty',
    component: ThirdParty
  },
  {
    path: '/grayscale',
    name: 'grayscale',
    component:GrayscaleRelease
  },
  {
    path: '/addGrayscale',
    name: 'addGrayscale',
    component:AddGrayscale
  }
]
