import authReducer from './components/Auth/authSlice';
import damageTypeReducer from './store/reducers/damageType';
import conditionReducer from './components/MechanicsSetup/Conditions/conditionSlice';
import featureReducer from './store/reducers/feature';
import participantTemplateReducer from './store/reducers/participantTemplate';
import encounterReducer from './store/reducers/encounter';
import newsReducer from './store/reducers/news';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createFirebaseMiddleware from './components/Firebase/firebaseMiddleware';
import firebaseReducer from './components/Firebase/firebaseSlice';

const middleware = [
  ...getDefaultMiddleware(),
  createFirebaseMiddleware()
];

const createStore = () => configureStore({
  reducer: {
    auth: authReducer,
    damageType: damageTypeReducer,
    condition: conditionReducer,
    feature: featureReducer,
    participantTemplate: participantTemplateReducer,
    encounter: encounterReducer,
    news: newsReducer,
    firebase: firebaseReducer
  },
  middleware,
  devTools: process.env.NODE_ENV !== 'production'
});

export default createStore;
