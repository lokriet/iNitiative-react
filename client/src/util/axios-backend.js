import axios from 'axios';
import constants from './constants';

const instance = axios.create({
  baseURL: `${constants.serverUrl}/`
});

export default instance;