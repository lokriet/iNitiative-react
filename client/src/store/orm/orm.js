import { ORM } from 'redux-orm';
import Condition from '../../components/MechanicsSetup/Conditions/store/conditionModel';
import Feature from '../../components/MechanicsSetup/Features/store/featureModel';
import DamageType from '../../components/MechanicsSetup/DamageTypes/store/damageTypeModel';
import ParticipantTemplate from '../../components/ParticipantTemplates/store/participantTemplateModel';
import {
  EncounterParticipant,
  EncounterMap,
  AreaEffect,
  ParticipantCoordinate,
  Encounter
} from '../../components/Encounters/store/encounterModel';

let orm;

const getOrm = () => {
  if (!orm) {
    orm = new ORM({
      stateSelector: state => state.orm,
    });
    orm.register(
      Condition,
      Feature,
      DamageType,
      ParticipantTemplate,
      EncounterParticipant,
      EncounterMap,
      AreaEffect,
      ParticipantCoordinate,
      Encounter
    );
  }

  return orm;
};
export default getOrm;
