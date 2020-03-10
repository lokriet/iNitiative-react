import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import useDropdownValues from '../../../hooks/useDropdownValues';

import Input from '../../UI/Form/Input/FormikInput/FormikInput';
import Select from '../../UI/Form/Select/FormikSelect/FormikSelect';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Button from '../../UI/Form/Button/Button';
import ImmunitiesSelect from '../../UI/Form/Select/ImmunitiesSelect/ImmunitiesSelect';
import Avatar from '../../ImageUpload/Avatar/Avatar';

import classes from './EditEncounterParticipant.module.css';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import { faDiceD6 } from '@fortawesome/free-solid-svg-icons';
import FormikColorPicker from '../../UI/Color/ColorPicker/FormikColorPicker';

const generateInitiative = () => Math.ceil(Math.random() * 20);

const EditEncounterParticipant = ({ participant, onCancel, onSave }) => {
  const [damageTypes, combined, features, conditions] = useDropdownValues();

  const submitHandler = values => {
    onSave(values);
  };

  const form = (
    <Formik
      initialValues={{
        color: participant.color || '',
        name: participant.name,
        avatarUrl: participant.avatarUrl || '',
        rolledInitiative: participant.rolledInitiative || '',
        initiativeModifier: participant.initiativeModifier,
        maxHp: participant.maxHp,
        armorClass: participant.armorClass,
        speed: participant.speed,
        swimSpeed: participant.swimSpeed || '',
        climbSpeed: participant.climbSpeed || '',
        flySpeed: participant.flySpeed || '',
        mapSize: participant.mapSize,
        immunities: participant.immunities,
        vulnerabilities: participant.vulnerabilities,
        resistances: participant.resistances,
        features: participant.features,
        conditions: participant.conditions,
        advantages: participant.advantages || '',
        comment: participant.comment || ''
      }}
      validationSchema={Yup.object({
        color: Yup.string(),
        name: Yup.string()
          .required('Name is required')
          .trim(),
        avatarUrl: Yup.string(),
        rolledInitiative: Yup.number()
          .min(1, 'Rolled value should be between 1 and 20')
          .max(20, 'Rolled value should be between 1 and 20'),
        initiativeModifier: Yup.number().required('Ini Mod is required'),
        maxHp: Yup.number()
          .required('HP is required')
          .min(1, 'HP should be more than 0'),
        armorClass: Yup.number()
          .required('Armor class is required')
          .min(0, 'Armor class should be positive'),
        speed: Yup.number()
          .required('Speed is required')
          .min(0, 'Speed should be positive'),
        swimSpeed: Yup.number()
          .min(0, 'Speed should be positive')
          .nullable(true),
        climbSpeed: Yup.number()
          .min(0, 'Speed should be positive')
          .nullable(true),
        flySpeed: Yup.number()
          .min(0, 'Speed should be positive')
          .nullable(true),
        mapSize: Yup.number()
          .required('Map size is required')
          .min(1, 'Map size should be more than 0'),
        immunities: Yup.object(),
        vulnerabilities: Yup.array().of(Yup.string()),
        resistances: Yup.array().of(Yup.string()),
        conditions: Yup.array().of(Yup.string()),
        features: Yup.array().of(Yup.string()),
        advantages: Yup.string().trim(),
        comment: Yup.string().trim()
      })}
      onSubmit={values => submitHandler(values)}
    >
      {formProps => (
        <Form className={classes.EditEncounterParticipantForm}>
          <label htmlFor="color">Color</label>
          <Field id="color" name="color" component={FormikColorPicker} />

          <label className={classes.Avatar} htmlFor="avatarUrl">Avatar</label>
          <div className={classes.Avatar}>
            <Field id="avatarUrl" name="avatarUrl" component={Avatar} />
          </div>

          <label htmlFor="name">Name</label>
          <Field
            className={classes.InputField}
            type="text"
            id="name"
            name="name"
            hidingBorder
            component={Input}
          />

          <label htmlFor="rolledInitiative">Rolled Initiative</label>
          <ItemsRow alignCentered>
            <Field
              className={classes.RolledInitiative}
              type="number"
              min={1}
              max={20}
              name="rolledInitiative"
              id="rolledInitiative"
              hidingBorder
              component={Input}
            />
            <IconButton
              icon={faDiceD6}
              onClick={() =>
                formProps.setFieldValue(
                  'rolledInitiative',
                  generateInitiative()
                )
              }
            />
          </ItemsRow>

          <label htmlFor="initiativeModifier">Initiative Modifier</label>
          <Field
            className={classes.InputField}
            type="number"
            name="initiativeModifier"
            id="initiativeModifier"
            hidingBorder
            component={Input}
          />

          <label htmlFor="maxHp">Max HP</label>
          <Field
            className={classes.InputField}
            type="number"
            name="maxHp"
            id="maxHp"
            min={1}
            hidingBorder
            component={Input}
          />

          <label htmlFor="armorClass">Armor class</label>
          <Field
            className={classes.InputField}
            type="number"
            name="armorClass"
            id="armorClass"
            min={0}
            hidingBorder
            component={Input}
          />

          <label htmlFor="speed">Speed</label>
          <Field
            className={classes.InputField}
            type="number"
            name="speed"
            id="speed"
            min={0}
            hidingBorder
            component={Input}
          />

          <div className={classes.FullRow}>
            <ItemsRow alignCentered className={classes.ExtraSpeeds}>
              <label htmlFor="swimSpeed">Swim</label>
              <Field
                className={classes.ExtraSpeedInput}
                type="number"
                name="swimSpeed"
                id="swimSpeed"
                min={0}
                hidingBorder
                component={Input}
              />

              <label htmlFor="climbSpeed">Climb</label>
              <Field
                className={classes.ExtraSpeedInput}
                type="number"
                name="climbSpeed"
                id="climbSpeed"
                min={0}
                hidingBorder
                component={Input}
              />
              <label htmlFor="flySpeed">Fly</label>
              <Field
                className={classes.ExtraSpeedInput}
                type="number"
                name="flySpeed"
                id="flySpeed"
                min={0}
                hidingBorder
                component={Input}
              />
            </ItemsRow>
          </div>

          <label htmlFor="mapSize">Map size</label>
          <Field
            className={classes.InputField}
            type="number"
            name="mapSize"
            id="mapSize"
            min={1}
            hidingBorder
            component={Input}
          />

          <label htmlFor="conditions">Conditions</label>
          <Field
            isMulti
            className={classes.InputField}
            name="conditions"
            id="conditions"
            component={Select}
            options={conditions}
          />

          <label htmlFor="immunities">Immunities</label>
          <Field
            className={classes.InputField}
            name="immunities"
            id="immunities"
            isMulti
            isGrouped
            component={ImmunitiesSelect}
            options={combined}
          />

          <label htmlFor="resistances">Resistances</label>
          <Field
            isMulti
            className={classes.InputField}
            name="resistances"
            id="resistances"
            component={Select}
            options={damageTypes}
          />

          <label htmlFor="vulnerabilities">Vulnerabilities</label>
          <Field
            isMulti
            className={classes.InputField}
            name="vulnerabilities"
            id="vulnerabilities"
            component={Select}
            options={damageTypes}
          />

          <label htmlFor="features">Features</label>
          <Field
            isMulti
            isGrouped
            className={classes.InputField}
            name="features"
            id="features"
            component={Select}
            options={features}
          />

          <label htmlFor="advantages">Advantages</label>
          <Field
            className={classes.InputField}
            inputType="textarea"
            name="advantages"
            id="advantages"
            hidingBorder
            component={Input}
          />

          <label htmlFor="comment">Comment</label>
          <Field
            className={classes.InputField}
            inputType="textarea"
            name="comment"
            id="comment"
            hidingBorder
            component={Input}
          />

          <div className={classes.FullRow}>
            <Button type="submit" disabled={!formProps.isValid}>
              Save
            </Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );

  return <div className={classes.Container}>{form}</div>;
};

EditEncounterParticipant.propTypes = {
  participant: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default EditEncounterParticipant;
