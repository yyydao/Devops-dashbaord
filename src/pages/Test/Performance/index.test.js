import React, { Component } from 'react';
import { mount } from 'enzyme';
import TestDemo from '../Performance';

test('TestDemo', () => {
  const wrapper = mount(<TestDemo />);
  expect(wrapper.find('div').text()).toBe('test');
});