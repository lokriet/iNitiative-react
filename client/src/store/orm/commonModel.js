import { Model } from 'redux-orm';

export const CommonModel = () => {
  const result = class extends Model {
    static reducers = {
      resetStore: (action, ModelClass, session) => {
        ModelClass.delete();
      }
    };

    static addReducers = (additionalReducers) => {
      this.reducers = { ...this.reducers, ...additionalReducers };
    };

    static reducer(action, ModelClass, session) {
      if (action.type in this.reducers) {
        console.log(`model ${this} run action ${action.type}`);
        this.reducers[action.type](action, ModelClass, session);
      }
    };
  };

  result.options = {
    idAttribute: '_id'
  };
  return result;
}
