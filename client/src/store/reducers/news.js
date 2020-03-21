import * as ActionTypes from '../actions/actionTypes';
const initialState = {
  error: null,
  fetching: false,
  news: [],
  newsInitialised: null
};

const conditionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.news.START_FETCHING_NEWS:
      return startFetchingNews(state, action);

    case ActionTypes.news.SET_NEWS:
      return setNews(state, action);

    case ActionTypes.news.FETCH_NEWS_FAILED:
      return fetchNewsFailed(state, action);

    default:
      return state;
  }
};

const startFetchingNews = (state, action) => {
  return {
    ...state,
    fetching: true,
    error: null
  };
};

const setNews = (state, action) => {
  return {
    ...state,
    fetching: false,
    error: null,
    news: action.news.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    })),
    newsInitialised: new Date()
  };
};

const fetchNewsFailed = (state, action) => {
  return {
    ...state,
    fetching: false,
    error: action.error
  };
};

export default conditionsReducer;
