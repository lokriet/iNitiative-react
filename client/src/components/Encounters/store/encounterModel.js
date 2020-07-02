import { attr, many, oneToOne, fk } from 'redux-orm';
import DamageType from '../../MechanicsSetup/DamageTypes/store/damageTypeModel';
import Condition from '../../MechanicsSetup/Conditions/store/conditionModel';
import Feature from '../../MechanicsSetup/Features/store/featureModel';
import { CommonModel } from '../../../store/orm/commonModel';

export class EncounterParticipant extends CommonModel() {
  static parse(encounterPartiicipantData) {
    const { Condition, DamageType, Feature } = this.session;

    const newEncounterParticipant = { ...encounterPartiicipantData };

    newEncounterParticipant.conditionImmunities = encounterPartiicipantData.immunities.conditions.map(
      (condition) => Condition.parse(condition)
    );
    newEncounterParticipant.damageTypeImmunities = encounterPartiicipantData.immunities.damageTypes.map(
      (damageType) => DamageType.parse(damageType)
    );
    delete newEncounterParticipant.immunities;

    newEncounterParticipant.vulnerabilities = encounterPartiicipantData.vulnerabilities.map(
      (vulnerability) => DamageType.parse(vulnerability)
    );
    newEncounterParticipant.resistances = encounterPartiicipantData.resistances.map(
      (resistance) => DamageType.parse(resistance)
    );
    newEncounterParticipant.features = encounterPartiicipantData.features.map(
      (feature) => Feature.parse(feature)
    );
    newEncounterParticipant.conditions = encounterPartiicipantData.conditions.map(
      (condition) => Condition.parse(condition)
    );

    return this.upsert(newEncounterParticipant);
  }

  applyUpdate(partialUpdate) {
    const flatPartialUpdate = { ...partialUpdate };
    const { Condition, DamageType, Feature } = this.getClass().session;

    if (partialUpdate.immunities) {
      this.conditionImmunities.clear();
      partialUpdate.immunities.conditions.forEach((condition) => this.conditionImmunities.add(Condition.parse(condition)));


      this.damageTypeImmunities.clear();
      partialUpdate.immunities.damageTypes.forEach((damageType) => this.damageTypeImmunities.add(DamageType.parse(damageType)));

      delete flatPartialUpdate.immunities;
    }

    if (partialUpdate.vulnerabilities) {
      this.vulnerabilities.clear();
      
      partialUpdate.vulnerabilities.forEach(
        (vulnerability) => this.vulnerabilities.add(DamageType.parse(vulnerability))
      );

      delete flatPartialUpdate.vulnerabilities;
    }

    if (partialUpdate.resistances) {
      this.resistances.clear();
      partialUpdate.resistances.forEach(
        resistance => this.resistances.add(DamageType.parse(resistance))
      );

      delete flatPartialUpdate.resistances;
    }

    if (partialUpdate.features) {
      this.features.clear();
      partialUpdate.features.forEach(
        (feature) => this.features.add(Feature.parse(feature))
      );

      delete flatPartialUpdate.features;
    }

    if (partialUpdate.conditions) {
      this.conditions.clear();
      partialUpdate.conditions.forEach(
        (condition) => this.conditions.add(Condition.parse(condition))
      );

      delete flatPartialUpdate.conditions;
    }

    return this.update(flatPartialUpdate);
  }

  static buildObject(participantModel) {
    if (!participantModel) return null;

    const result = { ...participantModel.ref };

    result.immunities = {
      damageTypes: participantModel.damageTypeImmunities.toRefArray(),
      conditions: participantModel.conditionImmunities.toRefArray()
    };

    result.vulnerabilities = participantModel.vulnerabilities.toRefArray();
    result.resistances = participantModel.resistances.toRefArray();
    result.features = participantModel.features.toRefArray();
    result.conditions = participantModel.conditions.toRefArray();

    return result;
  }
}
EncounterParticipant.modelName = 'EncounterParticipant';
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

  damageTypeImmunities: many(DamageType, 'dtImmunityParticipants'),
  conditionImmunities: many(Condition, 'conditionImmunityParticipants'),
  vulnerabilities: many(DamageType, 'vulnerabilityParticipants'),
  resistances: many(DamageType, 'resistanceParticipants'),
  features: many(Feature, 'featureParticipants'),
  conditions: many(Condition, 'conditionParticipants')
};

export class AreaEffect extends CommonModel() {
  static parse(areaEffectData) {
    const newAreaEffect = { ...areaEffectData };
    newAreaEffect.positionX = areaEffectData.position.x;
    newAreaEffect.positionY = areaEffectData.position.y;
    delete newAreaEffect.position;

    return this.upsert(newAreaEffect);
  }

  static buildObject(areaEffectModel) {
    const result = { ...areaEffectModel.ref };
    result.position = {
      x: areaEffectModel.positionX,
      y: areaEffectModel.positionY
    };
    delete result.positionX;
    delete result.positionY;

    return result;
  }
}
AreaEffect.modelName = 'AreaEffect';
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

  followingParticipantId: fk({
    to: EncounterParticipant,
    as: 'followingParticipant',
    relatedName: 'followingAreaEffects'
  })
};

export class ParticipantCoordinate extends CommonModel() {
  static parse(participantCoordinateData) {
    return this.upsert(participantCoordinateData);
  }
}
ParticipantCoordinate.modelName = 'ParticipantCoordinate';
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

export class EncounterMap extends CommonModel() {
  static parse(encounterMapData) {
    const { ParticipantCoordinate, AreaEffect } = this.session;

    const newEncounterMap = { ...encounterMapData };

    newEncounterMap.participantCoordinates = encounterMapData.participantCoordinates.map(
      (coordinate) => ParticipantCoordinate.parse(coordinate)
    );

    newEncounterMap.areaEffects = encounterMapData.areaEffects.map(
      (areaEffect) => AreaEffect.parse(areaEffect)
    );

    return this.upsert(newEncounterMap);
  }

  deleteCascade() {
    this.participantCoordinates.delete();
    this.areaEffects.delete();
    this.delete();
  }

  static buildObject(encounterMapModel) {
    if (!encounterMapModel) return null;

    const { AreaEffect } = this.session;
    const result = { ...encounterMapModel.ref };

    if (encounterMapModel.participantCoordinates) {
      result.participantCoordinates = encounterMapModel.participantCoordinates.toRefArray();
    }

    if (encounterMapModel.areaEffects) {
      result.areaEffects = encounterMapModel.areaEffects
        .toModelArray()
        .map((areaEffectModel) => AreaEffect.buildObject(areaEffectModel));
    }

    return result;
  }
}
EncounterMap.modelName = 'EncounterMap';
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

  areaEffects: many(AreaEffect),
  participantCoordinates: many(ParticipantCoordinate)
};

export class Encounter extends CommonModel() {
  static parse(encounterData) {
    const { EncounterParticipant, EncounterMap } = this.session;

    const newEncounter = { ...encounterData };

    if (encounterData.participants) {
      newEncounter.participants = encounterData.participants.map(
        (participant) => EncounterParticipant.parse(participant)
      );
    }
    if (encounterData.map) {
      newEncounter.map = EncounterMap.parse(encounterData.map);
    }

    const result = this.upsert(newEncounter);
    return result;
  }

  applyUpdate(partialUpdate) {
    const { EncounterParticipant, EncounterMap } = this.getClass().session;

    if (partialUpdate.participants) {
      partialUpdate.participants.forEach((participantPartialUpdate) =>
        EncounterParticipant.withId(participantPartialUpdate._id).applyUpdate(participantPartialUpdate)
      );
    }

    if (this.map != null && 'map' in partialUpdate) {
      this.map.deleteCascade();
      this.map = EncounterMap.parse(partialUpdate.map);
    }

    return this.update(partialUpdate);
  }

  static buildObject(encounterModel) {
    if (!encounterModel) return null;

    const { EncounterParticipant, EncounterMap } = this.session;
    const result = { ...encounterModel.ref };

    if (encounterModel.participants) {
      result.participants = encounterModel.participants
        .toModelArray()
        .map((participantModel) =>
          EncounterParticipant.buildObject(participantModel)
        );
    }
    if (encounterModel.map) {
      result.map = EncounterMap.buildObject(encounterModel.map);
    }

    return result;
  }
}
Encounter.modelName = 'Encounter';
Encounter.fields = {
  _id: attr(),
  name: attr(),
  activeParticipantId: attr(),

  map: oneToOne(EncounterMap, 'encounter'),
  participants: many(EncounterParticipant)
};
