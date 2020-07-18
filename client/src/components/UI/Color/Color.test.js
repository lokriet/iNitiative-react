import { shallow } from 'enzyme';
import React from 'react';
import Color from './Color';

describe('Color', () => {
  it('renders green div when passed green in props', () => {
    const wrapper = shallow(<Color color='#00ff00' />);
    expect(wrapper.get(0).props.style).toHaveProperty('backgroundColor', '#00ff00');
  });

  it('renders div withoug background color when passed null in props', () => {
    const wrapper = shallow(<Color />);
    expect(wrapper.get(0).props.style).not.toHaveProperty('backgroundColor');
  });
})