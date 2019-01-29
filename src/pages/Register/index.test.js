import React from 'react'
import { configure, mount, shallow, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Login from './index'
import { MemoryRouter} from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'

import MockAdapter from 'axios-mock-adapter'

import { Provider } from 'react-redux'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({})

configure({ adapter: new Adapter() })

var instance
var mock

it('contains html ', function () {
  beforeEach(function () {
    class LocalStorageMock {
      constructor () {
        this.store = {}
      }

      clear () {
        this.store = {}
      }

      getItem (key) {
        return this.store[key] || null
      }

      setItem (key, value) {
        this.store[key] = value.toString()
      }

      removeItem (key) {
        delete this.store[key]
      }
    }

    console.log(Promise)

    global.localStorage = new LocalStorageMock
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    var normalAxios = axios.create()
    var mockAxios = axios.create()
    var mock = new MockAdapter(mockAxios)

    mock
      .onGet('/stfDevices/checkUserUseDevice')
      .reply(() => Promise.then([
          normalAxios
            .get('/api/v1/orders')
            .then(resp => resp.data),
          normalAxios
            .get('/api/v2/orders')
            .then(resp => resp.data),
          { id: '-1', content: 'extra row 1' },
          { id: '-2', content: 'extra row 2' }
        ]).finally(
        sources => [200, sources.reduce((agg, source) => agg.concat(source))]
        )
      )

  })
  expect(mount(
    <Provider store={store}>
      <MemoryRouter>
        <Login
          dispatch={store.dispatch}/>
      </MemoryRouter>
    </Provider>).find('.ant-breadcrumb-link').find('a').text()).toBe("首页")
})
