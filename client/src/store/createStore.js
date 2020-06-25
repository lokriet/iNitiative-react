import authReducer from '../components/Auth/authSlice';
import damageTypeReducer from '../components/MechanicsSetup/DamageTypes/damageTypeSlice';
import conditionReducer from '../components/MechanicsSetup/Conditions/conditionSlice';
import featureReducer from '../components/MechanicsSetup/Features/featureSlice';
import participantTemplateReducer from '../components/ParticipantTemplates/participantTemplateSlice';
import encounterReducer from '../components/Encounters/encounterSlice';
import newsReducer from '../components/Home/newsSlice';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createFirebaseMiddleware from './firebase/firebaseMiddleware';
import firebaseReducer from './firebase/firebaseSlice';

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
