import { Model, attr } from 'redux-orm';

class DamageType extends Model {}
DamageType.modelName = 'DamageType';
DamageType.options = {
  idAttribute: '_id'
};
DamageType.fields = {
  _id: attr(),
  name: attr()
};

export default DamageType;