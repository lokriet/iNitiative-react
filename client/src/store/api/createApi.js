const wrapApiCall = (apiCall) => {
  return async function wrapped(...args) {
    try {
      const response = await apiCall(...args);
      return response;
    } catch (error) {
      // TODO
      console.log('api call failed and caught in wrapper', error);
      return {ok: false};
    }
  }
}

export const createApi = (apiDefinitions) => {
  const api = {};

  Object.getOwnPropertyNames(apiDefinitions).forEach(apiDefinitionName => {
    api[apiDefinitionName] = wrapApiCall(apiDefinitions[apiDefinitionName]);
  });

  return api;
}