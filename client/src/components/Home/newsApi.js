import { createApi } from '../../store/api/createApi';
import constants from '../../util/constants';

const createNewsApi = () =>
  createApi({
    fetchItems: () => fetch(`${constants.serverUrl}/news`)
  });

export default createNewsApi;
