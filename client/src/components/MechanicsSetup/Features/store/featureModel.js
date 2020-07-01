import { attr } from 'redux-orm';
import { CommonModel } from '../../../../store/orm/commonModel';

class Feature extends CommonModel() {}
Feature.modelName = 'Feature';
Feature.fields = {
  _id: attr(),
  name: attr(),
  description: attr(),
  type: attr(),
  isHomebrew: attr(),
  creator: attr()
};

export default Feature;