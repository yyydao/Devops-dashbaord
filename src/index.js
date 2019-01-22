import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './App'
// import store from './store'
import { Provider } from 'react-redux'
import {LocaleProvider} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import registerServiceWorker from './registerServiceWorker'
import configureStore from './store'

const store = configureStore()


ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zhCN}>
    <App/>
    </LocaleProvider>
  </Provider>, document.getElementById('root'))

registerServiceWorker()
