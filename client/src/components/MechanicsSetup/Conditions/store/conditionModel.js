import { attr } from 'redux-orm';
import { CommonModel } from '../../../../store/orm/commonModel';

class Condition extends CommonModel() {}
Condition.modelName = 'Condition';
Condition.fields = {
  _id: attr(),
  name: attr(),
  description: attr(),
  isHomebrew: attr()
};

export default Condition;
