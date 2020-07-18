import React from 'react';
import ColorPicker from './ColorPicker';
import { checkProps, findByTestAttr } from '../../../../util/testUtils';
import { shallow } from 'enzyme';
import Color from '../Color';

describe('Color Picker', () => {
  it('renders without warnings with min props setup', () => {
    const expectedProps = {
      onSelected: () => {},
      onCancel: () => {}
    };
    checkProps(ColorPicker, expectedProps);

    const wrapper = shallow(<ColorPicker {...expectedProps} />);
    const colorsLength = wrapper.find(Color).length;
    console.log('colors', colorsLength);
    expect(colorsLength).toBeGreaterThan(0);
  });

  it('calls onSelected when a color is picked', () => {
    const onSelectedMock = jest.fn();
    const expectedProps = {
      onSelected: onSelectedMock,
      onCancel: () => {}
    };
    const wrapper = shallow(<ColorPicker {...expectedProps} />);

    // click on the second color in the color grid
    const secondColorElement = wrapper.find(Color).at(1);
    const secondColorValue = secondColorElement.get(0).props.color;
    secondColorElement.simulate('click');

    // click ok and expect onSelected to be called with the clicked color value
    const okButton = findByTestAttr(wrapper, 'ok-button');
    okButton.simulate('click');
    const onSelectCalls = onSelectedMock.mock.calls;
    expect(onSelectCalls.length).toBe(1);
    expect(onSelectCalls[0][0]).toBe(secondColorValue);
  });

  it('calls onCancelled when cancelButton is clicked', () => {
    const onCancelMock = jest.fn();
    const expectedProps = {
      onSelected: () => {},
      onCancel: onCancelMock
    };
    const wrapper = shallow(<ColorPicker {...expectedProps} />);

    // click ok and expect onSelected to be called with the clicked color value
    const cancelButton = findByTestAttr(wrapper, 'cancel-button');
    cancelButton.simulate('click');
    const onCancelCalls = onCancelMock.mock.calls;
    expect(onCancelCalls.length).toBe(1);
  });

  it('sets provided color prop as a value', () => {
    const onSelectedMock = jest.fn();
    const expectedProps = {
      onSelected: onSelectedMock,
      onCancel: () => {},
      selectedColor: '#abccba'
    };

    const wrapper = shallow(<ColorPicker {...expectedProps} />);

    // click ok and expect onSelected to be called with the provided prop value
    const okButton = findByTestAttr(wrapper, 'ok-button');
    okButton.simulate('click');
    const onSelectCalls = onSelectedMock.mock.calls;
    expect(onSelectCalls[0][0]).toBe('#abccba');
  })
});
