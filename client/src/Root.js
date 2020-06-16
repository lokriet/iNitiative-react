import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ErrorBoundary } from './hoc/ErrorBoundary';
import App from './App';

const Root = ({store}) => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object
};

export default Root;
