import React, { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import useQueryParams from '../../../hooks/useQueryParams';
import withAuthCheck from '../../../hoc/withAuthCheck';
import { ParticipantType } from '../ParticipantTemplates';
import { Formik, Field, Form } from 'formik';
import Input from '../../UI/Form/Input/FormikInput/FormikInput';
import Select from '../../UI/Form/Select/FormikSelect/FormikSelect';
import classes from './EditParticipantTemplate.module.css';
import useDropdownValues from '../../../hooks/useDropdownValues';

const EditParticipantTemplate = props => {
  const queryParams = useQueryParams();
  const [participantType] = useState(
    queryParams.get('type') || ParticipantType.Player
  );

  const [damageTypes, combined, features] = useDropdownValues();

  const form = (
    <Formik
      initialValues={{
        type: participantType,
        name: '',
        initiativeModifier: 0,
        maxHp: '',
        armorClass: '',
        speed: '',
        mapSize: 1,
        immunities: '',
        vulnerabilities: '',
        resistances: '',
        features: '',
        comment: ''
      }}
      validationSchema={Yup.object({
        type: Yup.string().required('Type is required'),
        name: Yup.string().required('Name is required'),
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
        mapSize: Yup.number()
          .required('Map size is required')
          .min(1, 'Map size should be more than 0'),
        comment: Yup.string().trim(),
        immunities: Yup.array().of(Yup.string()),
        vulnerabilities: Yup.array().of(Yup.string()),
        resistances: Yup.array().of(Yup.string()),
        features: Yup.array().of(Yup.string())
      })}
      onSubmit={(values, { setSubmitting }) =>
        // handleSubmit(values, setSubmitting)
        console.log('submit!', values)
      }
    >
      <Form className={classes.EditParticipantTemplateForm}>
        <label>Type</label>
        <div className={classes.RadioButtonsGroup}>
          <Field
            type="radio"
            name="type"
            id="player"
            value={ParticipantType.Player}
            component={Input}
          />
          <label htmlFor="player">Player</label>
          <Field
            type="radio"
            name="type"
            id="monster"
            value={ParticipantType.Monster}
            component={Input}
          />
          <label htmlFor="monster">Monster</label>
        </div>

        <label htmlFor="name">Name</label>
        <Field
          type="text"
          id="name"
          name="name"
          hidingBorder
          component={Input}
        />

        <label htmlFor="initiativeModifier">Initiative Modifier</label>
        <Field
          type="number"
          name="initiativeModifier"
          id="initiativeModifier"
          hidingBorder
          component={Input}
        />

        <label htmlFor="maxHp">Max HP</label>
        <Field
          type="number"
          name="maxHp"
          id="maxHp"
          min={1}
          hidingBorder
          component={Input}
        />

        <label htmlFor="armorClass">Armor class</label>
        <Field
          type="number"
          name="armorClass"
          id="armorClass"
          min={0}
          hidingBorder
          component={Input}
        />

        <label htmlFor="speed">Speed</label>
        <Field
          type="number"
          name="speed"
          id="speed"
          min={0}
          hidingBorder
          component={Input}
        />

        <label htmlFor="mapSize">Map size</label>
        <Field
          type="number"
          name="mapSize"
          id="mapSize"
          min={1}
          hidingBorder
          component={Input}
        />

        <label htmlFor="immunities">Immunities</label>
        <Field
          className={classes.Select}
          name="immunities"
          id="immunities"
          isMulti
          isGrouped
          component={Select}
          options={combined}
        />

        <label htmlFor="resistances">Resistances</label>
        <Field
          isMulti
          className={classes.Select}
          name="resistances"
          id="resistances"
          component={Select}
          options={damageTypes}
        />

        <label htmlFor="vulnerabilities">Vulnerabilities</label>
        <Field
          isMulti
          className={classes.Select}
          name="vulnerabilities"
          id="vulnerabilities"
          component={Select}
          options={damageTypes}
        />

        <label htmlFor="features">Features</label>
        <Field
          isMulti
          isGrouped
          className={classes.Select}
          name="features"
          id="features"
          component={Select}
          options={features}
        />

        <label htmlFor="comment">Comment</label>
        <Field
          className={classes.Comment}
          inputType="textarea"
          name="comment"
          id="comment"
          hidingBorder
          component={Input}
        />
        <button type="submit">Save</button>
      </Form>
    </Formik>
  );

  // return (
  //   // <div>
  //     {form}
  //     {/* <InlineInput type="text" name="name" placeholder="Name" />
  //     <InlineInput type="number" name="initiativeModifier" placeholder="Name" /> */}
  //     {/* New {participantType} */}
  //   // </div>
  // );
  return <div>{form}</div>;
};

EditParticipantTemplate.propTypes = {};

export default withAuthCheck(EditParticipantTemplate);
