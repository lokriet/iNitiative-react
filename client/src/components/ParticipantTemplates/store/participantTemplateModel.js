import { attr, many } from 'redux-orm';
import DamageType from '../../MechanicsSetup/DamageTypes/store/damageTypeModel';
import Condition from '../../MechanicsSetup/Conditions/store/conditionModel';
import Feature from '../../MechanicsSetup/Features/store/featureModel';
import { CommonModel } from '../../../store/orm/commonModel';

export const ParticipantType = {
  Player: 'player',
  Monster: 'monster'
};

class ParticipantTemplate extends CommonModel() {
  static parse(participantTemplateData) {
    const {Condition, DamageType, Feature} = this.session;

    const newParticipantTemplate = {...participantTemplateData};
    
    newParticipantTemplate.conditionImmunities = participantTemplateData.immunities.conditions.map(condition => Condition.parse(condition));
    newParticipantTemplate.damageTypeImmunities = participantTemplateData.immunities.damageTypes.map(damageType => DamageType.parse(damageType));
    delete newParticipantTemplate.immunities;

    newParticipantTemplate.vulnerabilities = participantTemplateData.vulnerabilities.map(vulnerability => DamageType.parse(vulnerability));
    newParticipantTemplate.resistances = participantTemplateData.resistances.map(resistance => DamageType.parse(resistance));
    newParticipantTemplate.features = participantTemplateData.features.map(feature => Feature.parse(feature));

    return this.upsert(newParticipantTemplate);
  }
};

ParticipantTemplate.addReducers({
  resetStore: (action, ModelClass, session) => {
    ModelClass.delete();
  }
})

ParticipantTemplate.modelName = 'ParticipantTemplate';
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
  creator: attr(),

  damageTypeImmunities: many(DamageType, 'dtImmunityParticipantTemplates'),
  conditionImmunities: many(Condition, 'conditionImmunityParticipantTemplates'),
  vulnerabilities: many(DamageType, 'vulnerabilityParticipantTemplates'),
  resistances: many(DamageType,'resistanceParticipantTemplates'),
  features: many(Feature, 'featureParticipantTemplates')
};

export default ParticipantTemplate;