import { rootReducer } from '../store/createStore';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import checkPropTypes from 'check-prop-types';

/**
 * Create a testing store with imported reducers, middleware, and initial state.
 *  globals: rootReducer, middlewares.
 * @param {object} initialState - Initial state for store.
 * @function storeFactory
 * @returns {Store} - Redux store.
 */
export const storeFactory = (initialState) => {
  // TODO: firebase?
  const middleware = [...getDefaultMiddleware()];
  return configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState: initialState
  });
};

/**
 * Return node(s) with the given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper.
 * @param {string} val - Value of data-test attribute for search.
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

/**
 * Test that component works correctly when passed certain props
 * @param {any} component
 * @param {any} conformingProps
 */
export const checkProps = (component, conformingProps) => {
  const propError = checkPropTypes(
    component.propTypes,
    conformingProps,
    'prop',
    component.name
  );
  expect(propError).toBeUndefined();
};
