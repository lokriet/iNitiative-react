import { createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseObtainIdToken } from "../../components/Firebase/firebaseMiddleware";
import get from 'lodash/get';
import ErrorType from "../../util/error";
import constants from "../../util/constants";

export const parseItemOperationError = async (response) => {
  if (!response) {
    return {
      type: ErrorType.INTERNAL_SERVER_ERROR,
      message: 'Internal error occured. Please try again.'
    };
  } else  if (response.status === 422) {
    const responseData = await response.json();
    return {
      type: ErrorType.VALIDATION_ERROR,
      data: responseData.data
    };
  } else if ([500, 401, 403].includes(response.status)) {
    const responseData = await response.json();
    return {
      type: ErrorType[response.status],
      message: responseData.message
    };
  } else {
    return {
      type: ErrorType.INTERNAL_SERVER_ERROR,
      message: 'Internal error occured. Please try again.'
    };
  }
};


export const createFetchItemsThunk = (slicePath, api) => createAsyncThunk(
  `${slicePath.replace('.', '/')}/fetchItems`,
  async (_, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.fetchItems(idToken);
    if (response.ok) {
      const items = await response.json();
      return items;
    } else {
      const error = await parseItemOperationError(response);
      return thunkApi.rejectWithValue(error);
    }
  },

  {
    condition: (_, { getState }) => {
      const sliceState = get(getState(), slicePath);
      if (
        sliceState.fetching ||
        (sliceState.lastFetchTime &&
          new Date().getTime() - sliceState.lastFetchTime <
            constants.refreshDataTimeout)
      ) {
        return false;
      }
    }
  }
);

export const createFetchItemByIdThunk = (slicePath, api) => createAsyncThunk(
  `${slicePath.replace('.', '/')}/fetchItemById`,
  async ({itemId}, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.fetchItem(itemId, idToken);
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      const error = await parseItemOperationError(response);
      return thunkApi.rejectWithValue({
        itemId,
        error
      });
    }
  }
)

export const createAddItemThunk = (slicePath, api) => createAsyncThunk(
  `${slicePath.replace('.', '/')}/addItem`,
  async ({ item, onOperationDone }, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.addItem(item, idToken);
    if (response.ok) {
      const responseData = await response.json();
      if (onOperationDone) onOperationDone(true);
      return responseData.data;
    } else {
      const error = await parseItemOperationError(response);
      if (onOperationDone) onOperationDone(true);
      return thunkApi.rejectWithValue({
        itemId: null,
        error
      });
    }
  }
);

export const createUpdateItemThunk = (slicePath, api) => createAsyncThunk(
  `${slicePath.replace('.', '/')}/updateItem`,
  async ({ item, onOperationDone }, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.updateItem(item, idToken);
    if (response.ok) {
      const responseData = await response.json();
      if (onOperationDone) onOperationDone(true);
      return responseData.data;
    } else {
      const error = await parseItemOperationError(response);
      if (onOperationDone) onOperationDone(true);
      return thunkApi.rejectWithValue({
        itemId: item._id,
        error
      });
    }
  }
);

export const createDeleteItemThunk = (slicePath, api) => createAsyncThunk(
  `${slicePath.replace('.', '/')}/deleteItem`,
  async ({ itemId }, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await api.deleteItem(itemId, idToken);
    if (response.ok) {
      return itemId;
    } else {
      console.log('delete item failed');
      const error = await parseItemOperationError(response);
      console.log(error);
      return thunkApi.rejectWithValue({
        itemId: itemId,
        error
      });
    }
  }
);

export const createThunks = (slicePath, api) => {
  return {
    fetchItems: createFetchItemsThunk(slicePath, api),
    fetchItem: createFetchItemByIdThunk(slicePath, api),
    addItem: createAddItemThunk(slicePath, api),
    updateItem: createUpdateItemThunk(slicePath, api),
    deleteItem: createDeleteItemThunk(slicePath, api)
  }
}