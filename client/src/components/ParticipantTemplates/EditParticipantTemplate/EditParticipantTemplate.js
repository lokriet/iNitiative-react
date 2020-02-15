import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useQueryParams from '../../../hooks/useQueryParams';
import { ParticipantType } from '../ParticipantTemplates';
import { Formik, Field, Form } from 'formik';
import Input from '../../UI/Form/Input/FormikInput/FormikInput';
import classes from './EditParticipantTemplate.module.css';

const EditParticipantTemplate = props => {
  const queryParams = useQueryParams();
  const [participantType] = useState(
    queryParams.get('type') || ParticipantType.Player
  );

  const form = (
    <Formik
      initialValues={{
        type: participantType,
        name: '',
        initiativeModifier: '',
        maxHp: '',
        armorClass: '',
        speed: '',
        mapSize: 1,
        comment: ''
      }}
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
          min={0}
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

        <label htmlFor="comment">Comment</label>
        <Field
          inputType="textarea"
          name="comment"
          id="comment"
          hidingBorder
          component={Input}
        />
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
  return form;
};

EditParticipantTemplate.propTypes = {};

const mapStateToProps = state => {
  return {
    
  };
}

export default EditParticipantTemplate;
