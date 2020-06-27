import { Model, attr } from 'redux-orm';

class Feature extends Model {}
Feature.modelName = 'Feature';
Feature.options = {
  idAttribute: '_id'
};
Feature.fields = {
  _id: attr(),
  name: attr(),
  description: attr(),
  type: attr()
};

export default Feature;