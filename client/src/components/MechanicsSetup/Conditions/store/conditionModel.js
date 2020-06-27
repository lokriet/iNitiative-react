import { Model, attr } from 'redux-orm';

class Condition extends Model {}
Condition.modelName = 'Condition';
Condition.idAttribute = '_id';
Condition.fields = {
  _id: attr(),
  name: attr(),
  description: attr()
};
