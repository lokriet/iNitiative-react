import { shallow } from 'enzyme';
import React from 'react';
import ServerError from './ServerError';

describe('ServerError', () => {
  it('renders error if found in props', () => {
    const error = {
      message: 'Test error message'
    };
    const wrapper = shallow(<ServerError serverError={error} />);
    expect(wrapper.dive().text()).toBe(error.message);
  });
  
  it('renders null without errors if passed nothing', () => {
    const wrapper = shallow(<ServerError />);
    expect(wrapper.isEmptyRender()).toBe(true);
  })
})