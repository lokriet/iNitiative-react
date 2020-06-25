import { createFetchItemsThunk } from '../../store/common/listOperationThunks';
import createNewsApi from './newsApi';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const newsApi = createNewsApi();
const fetchItems = createFetchItemsThunk('news', newsApi, false);

const entityAdapter = createEntityAdapter({
  selectId: (item) => item._id
});

const initialState = entityAdapter.getInitialState({
  fetching: false,
  error: null,
  lastFetchTime: null
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  extraReducers: {
    [fetchItems.pending]: (state, action) => {
      state.fetching = true;
      state.error = null;
    },
    [fetchItems.fulfilled]: (state, action) => {
      state.fetching = false;
      state.error = null;
      state.lastFetchTime = new Date().getTime();
      entityAdapter.setAll(state, action.payload);
    },
    [fetchItems.rejected]: (state, action) => {
      state.fetching = false;
      state.error = action.payload;
    }
  }
});

//actions
export const fetchNews = fetchItems;

//reducer
export default newsSlice.reducer

//selectors
export const selectAllNews = (state) => entityAdapter.getSelectors().selectAll(state.news);