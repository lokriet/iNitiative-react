import { attr } from 'redux-orm';
import { CommonModel } from '../../../../store/orm/commonModel';

class DamageType extends CommonModel() {}
DamageType.modelName = 'DamageType';
DamageType.fields = {
  _id: attr(),
  name: attr(),
  isHomebrew: attr()
};

export default DamageType;