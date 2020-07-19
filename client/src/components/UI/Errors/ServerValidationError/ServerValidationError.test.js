import { shallow } from 'enzyme';
import React from 'react';
import ServerValidationError from './ServerValidationError';
import ErrorType from '../../../../util/error';
import { findByTestAttr } from '../../../../util/testUtils';

describe('ServerValidationError', () => {
  it('Renders null without errors if nothing passed as props', () => {
    const wrapper = shallow(<ServerValidationError />);
    expect(wrapper.isEmptyRender()).toBe(true);
  });

  it('Renders all passed server validation errors if for prop is empty', () => {
    const error = {
      type: ErrorType.VALIDATION_ERROR,
      data: [
        {
          name: 'potato',
          msg: 'Potato value is invalid'
        },
        {
          name: 'second.tomato',
          msg: 'Tomato value is invalid'
        }
      ]
    }
    const wrapper = shallow(<ServerValidationError serverError={error} />);
    const errorMessages = findByTestAttr(wrapper, 'error-message');
    expect(errorMessages.length).toBe(2);
    expect(errorMessages.at(1).dive().text()).toBe(error.data[1].msg);
  });

  it('Renders only validation errors for \'for\' prop field', () => {
    const error = {
      type: ErrorType.VALIDATION_ERROR,
      data: [
        {
          param: 'potato',
          msg: 'Potato value is invalid'
        },
        {
          param: 'second.tomato',
          msg: 'Tomato value is invalid'
        }
      ]
    }
    const wrapper = shallow(<ServerValidationError serverError={error} for={'tomato'} />);

    // expect only 'tomato' errors to be rendered
    const errorMessages = findByTestAttr(wrapper, 'error-message');
    expect(errorMessages.length).toBe(1);
    expect(errorMessages.at(0).dive().text()).toBe(error.data[1].msg);
  });

  it('Doesn\'t render non-validation errors', () => {
    const error = {
      type: ErrorType.INTERNAL_CLIENT_ERROR,
      data: [
        {
          param: 'potato',
          msg: 'Potato value is invalid'
        },
        {
          param: 'second.tomato',
          msg: 'Tomato value is invalid'
        }
      ]
    }
    const wrapper = shallow(<ServerValidationError serverError={error} for={'tomato'} />);

    // expect only 'tomato' errors to be rendered
    expect(wrapper.isEmptyRender()).toBe(true);
  });
})