import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { watchAll } from './store/sagas';
import authReducer from './store/reducers/auth';
import thunk from 'redux-thunk';
import damageTypeReducer from './store/reducers/damageType';
import conditionReducer from './store/reducers/condition';
import featureReducer from './store/reducers/feature';
import participantTemplateReducer from './store/reducers/participantTemplate';
import encounterReducer from './store/reducers/encounter';
import newsReducer from './store/reducers/news';
import { ErrorBoundary } from './hoc/ErrorBoundary';

const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const rootReducer = combineReducers({
  auth: authReducer,
  damageType: damageTypeReducer,
  condition: conditionReducer,
  feature: featureReducer,
  participantTemplate: participantTemplateReducer,
  encounter: encounterReducer,
  news: newsReducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, thunk))
);

sagaMiddleware.run(watchAll);

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
