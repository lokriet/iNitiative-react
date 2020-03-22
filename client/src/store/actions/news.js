import ErrorType from '../../util/error';
import constants from '../../util/constants';

export const NewsActionTypes = {
  START_FETCHING_NEWS: 'START_FETCHING_NEWS',
  SET_NEWS: 'SET_NEWS',
  FETCH_NEWS_FAILED: 'FETCH_NEWS_FAILED'
};

export const getNews= () => {
  return async (dispatch, getState) => {
    if (
      getState().feature.newsInitialised &&
      new Date().getTime() - getState().feature.newsInitialised <
        constants.refreshDataTimeout
    ) {
      return;
    }

    try {
      dispatch(startFetchingNews());
      const response = await fetch(`${constants.serverUrl}/news`);
      if (response.status === 200) {
        const news = await response.json();
        dispatch(setNews(news));
      } else {
        const responseData = await response.json();
        dispatch(
          fetchNewsFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: responseData && responseData.message ? responseData.message : 'Fetching news failed'
          })
        );
      }
    } catch (error) {
      dispatch(
        fetchNewsFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching news failed'
        })
      );
    }
  };
};

export const startFetchingNews = () => {
  return {
    type: NewsActionTypes.START_FETCHING_NEWS
  }
};

export const setNews = (news) => {
  return {
    type: NewsActionTypes.SET_NEWS,
    news
  }
};

export const fetchNewsFailed = (error) => {
  return {
    type: NewsActionTypes.FETCH_NEWS_FAILED,
    error
  }
};