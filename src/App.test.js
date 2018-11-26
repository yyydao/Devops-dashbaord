import React from 'react';
import { configure,shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const store = configureStore([
    thunk,
])();

class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = value.toString();
    }

    removeItem(key) {
        delete this.store[key];
    }
};

global.localStorage = new LocalStorageMock;

configure({ adapter: new Adapter() });
it('renders without crashing', () => {
    shallow(
        <App   store={store} />
    ).dive();
});
