import { Model, attr, many, oneToOne } from 'redux-orm';
import DamageType from '../../MechanicsSetup/DamageTypes/store/damageTypeModel';
import Condition from '../../MechanicsSetup/Conditions/store/conditionModel';
import Feature from '../../MechanicsSetup/Features/store/featureModel';

export class EncounterParticipant extends Model {}
EncounterParticipant.modelName = 'EncounterParticipant';
EncounterParticipant.options = {
  idAttribute: '_id'
};
EncounterParticipant.fields = {
  _id: attr(),
  type: attr(),
  name: attr(),
  avatarUrl: attr(),
  color: attr(),
  initiativeModifier: attr(),
  rolledInitiative: attr(),
  maxHp: attr(),
  currentHp: attr(),
  temporaryHp: attr(),
  armorClass: attr(),
  temporaryArmorClass: attr(),
  speed: attr(),
  temporarySpeed: attr(),
  swimSpeed: attr(),
  temporarySwimSpeed: attr(),
  climbSpeed: attr(),
  temporaryClimbSpeed: attr(),
  flySpeed: attr(),
  temporaryFlySpeed: attr(),
  mapSize: attr(),
  advantages: attr(),
  comment: attr(),

  damageTypeImmunities: many(DamageType),
  conditionImmunities: many(Condition),
  vulnerabilities: many(DamageType),
  resistances: many(DamageType),
  features: many(Feature),
  conditions: many(Condition)
};

export class ParticipantCoordinate extends Model {}
ParticipantCoordinate.modelName = 'ParticipantCoordinate';
ParticipantCoordinate.options = {
  idAttribute: '_id'
};
ParticipantCoordinate.fields = {
  _id: attr(),
  mapX: attr(),
  mapY: attr(),
  infoX: attr(),
  infoY: attr(),
  gridX: attr(),
  gridY: attr(),

  participantId: oneToOne({
    to: EncounterParticipant,
    as: 'participant'
  })
};

export class AreaEffect extends Model {}
AreaEffect.modelName = 'AreaEffect';
AreaEffect.options = {
  idAttribute: '_id'
};
AreaEffect.fields = {
  _id: attr(),
  name: attr(),
  type: attr(),
  color: attr(),
  gridWidth: attr(),
  gridHeight: attr(),
  angle: attr(),
  positionX: attr(),
  positionY: attr(),

  followingParticipantId: oneToOne({
    to: EncounterParticipant,
    as: 'followingParticipant'
  })
};

export class EncounterMap extends Model {}
EncounterMap.modelName = 'EncounterMap';
EncounterMap.options = {
  idAttribute: '_id'
};
EncounterMap.fields = {
  _id: attr(),
  mapUrl: attr(),
  mapWidth: attr(),
  mapHeight: attr(),
  gridWidth: attr(),
  gridHeight: attr(),
  gridColor: attr(),
  showGrid: attr(),
  showInfo: attr(),
  showDead: attr(),
  snapToGrid: attr(),
  
  participantCoordinages: many(ParticipantCoordinate)
};

export class Encounter extends Model {}
Encounter.modelName = 'Encounter';
Encounter.options = {
  idAttribute: '_id'
};
Encounter.fields = {
  _id: attr(),
  name: attr(),
  activeParticipantId: attr(),

  participants: many(EncounterParticipant),
  map: oneToOne(EncounterMap)
};
