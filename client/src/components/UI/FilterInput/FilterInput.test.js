import { shallow, mount } from 'enzyme';
import React, {useState, useEffect} from 'react';
import FilterInput from './FilterInput';
import { checkProps, findByTestAttr } from '../../../util/testUtils';
import { act } from 'react-dom/test-utils';

describe('FilterInput', () => {
  it('renders without errors', () => {
    const expectedProps = {
      allItems: [],
      onItemsFiltered: () => {}
    };
    checkProps(FilterInput, expectedProps);

    const wrapper = shallow(<FilterInput {...expectedProps} />);
    const input = findByTestAttr(wrapper, 'input');
    expect(input.length).toBe(1);
  });

  it('filters by name by default', async () => {
    // jest.mock('../../../hooks/useDebounce', () => ({
    //   __esModule: true,
    //   default: prop => {
    //     console.log('mocked debounce ', prop);
    //     return prop
    //   }
    // }));
    jest.mock('../../../hooks/useDebounce',() => prop => {
      console.log('mocked debounce', prop);
      return prop;
    })

    const onItemsFilteredMock = jest.fn();
    const expectedProps = {
      allItems: [
        {
          name: 'Banana',
          description: 'Bananas are yellow'
        },
        {
          name: 'Mango',
          description: 'Mangoes are yummy'
        }
      ],
      onItemsFiltered: onItemsFilteredMock
    };
    const wrapper = shallow(<FilterInput {...expectedProps} />);

    const input = findByTestAttr(wrapper, 'input');

    input.simulate('change', { target: { value: 'man' } });

    await new Promise((r) => setTimeout(r, 1000));

    const onItemFilteredCalls = onItemsFilteredMock.mock.calls;
    console.log('calls', onItemFilteredCalls);
    expect(onItemFilteredCalls.length).toBe(1);
    expect(onItemFilteredCalls[0][0][0]).toBeEqual(expectedProps.allItems[1]);
  });
});
