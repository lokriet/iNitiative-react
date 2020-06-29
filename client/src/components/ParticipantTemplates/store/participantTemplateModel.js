import { Model, attr, many } from 'redux-orm';
import DamageType from '../../MechanicsSetup/DamageTypes/store/damageTypeModel';
import Condition from '../../MechanicsSetup/Conditions/store/conditionModel';
import Feature from '../../MechanicsSetup/Features/store/featureModel';

export const ParticipantType = {
  Player: 'player',
  Monster: 'monster'
};

class ParticipantTemplate extends Model {}
ParticipantTemplate.modelName = 'ParticipantTemplate';
ParticipantTemplate.options = {
  idAttribute: '_id'
};
ParticipantTemplate.fields = {
  _id: attr(),
  type: attr(),
  name: attr(),
  avatarUrl: attr(),
  color: attr(),
  initiativeModifier: attr(),
  maxHp: attr(),
  armorClass: attr(),
  speed: attr(),
  swimSpeed: attr(),
  climbSpeed: attr(),
  flySpeed: attr(),
  mapSize: attr(),
  comment: attr(),

  damageTypeImmunities: many(DamageType, 'dtImmunityParticipantTemplates'),
  conditionImmunities: many(Condition, 'conditionImmunityParticipantTemplates'),
  vulnerabilities: many(DamageType, 'vulnerabilityParticipantTemplates'),
  resistances: many(DamageType,'resistanceParticipantTemplates'),
  features: many(Feature, 'featureParticipantTemplates')
};

export default ParticipantTemplate;