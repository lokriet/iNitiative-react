import { mount } from 'enzyme';
import React from 'react';
import App from './App';
import { storeFactory } from './util/testUtils';
import { Provider } from 'react-redux';
import Spinner from './components/UI/Spinner/Spinner';
import { BrowserRouter } from 'react-router-dom';

const setup = (initialStoreState) => {
  const store = storeFactory(initialStoreState);

  const wrapper = mount(<Provider store={store}><App /></Provider>)
  return wrapper;
};

describe('App', () => {
  it('renders Spinner without errors when user is not authenticated', () => {
    const wrapper = setup({
      auth: {
        token: null,
        initialAuthCheckDone: false
      }
    });
    expect(wrapper.find(Spinner)).toHaveLength(1);
    expect(wrapper.find(BrowserRouter)).toHaveLength(0);
  });

  it('renders BrowserRouter without errors when user is authenticated', () => {
    const wrapper = setup({
      auth: {
        token: '123',
        initialAuthCheckDone: true
      }
    });
    expect(wrapper.find(BrowserRouter)).toHaveLength(1);
  });
});
