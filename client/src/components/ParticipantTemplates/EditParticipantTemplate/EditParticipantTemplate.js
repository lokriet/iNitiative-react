import React, { useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import useQueryParams from '../../../hooks/useQueryParams';
import withAuthCheck from '../../../hoc/withAuthCheck';
import { ParticipantType } from '../ParticipantTemplates';
import { Formik, Field, Form } from 'formik';
import Input from '../../UI/Form/Input/FormikInput/FormikInput';
import Select from '../../UI/Form/Select/FormikSelect/FormikSelect';
import ImmunitiesSelect from '../../UI/Form/Select/ImmunitiesSelect/ImmunitiesSelect';
import classes from './EditParticipantTemplate.module.css';
import useDropdownValues from '../../../hooks/useDropdownValues';
import Avatar from '../../ImageUpload/Avatar/Avatar';
import { useDispatch, connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { Redirect } from 'react-router-dom';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Button from '../../UI/Form/Button/Button';

const EditParticipantTemplate = props => {
  const queryParams = useQueryParams();
  const [participantType] = useState(
    queryParams.get('type') || ParticipantType.Player
  );

  const [damageTypes, combined, features] = useDropdownValues();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.startParticipantTemplateOperation());
  }, [dispatch])

  const submitHandler = useCallback(
    (values, setSubmitting) => {
      console.log('submit!', values);
      // setSubmittingForm(true);
      dispatch(actions.addParticipantTemplate(values, setSubmitting));
    },
    [dispatch]
  );

  const form = (
    <Formik
      initialValues={{
        type: participantType,
        avatarUrl: null,
        name: '',
        initiativeModifier: 0,
        maxHp: '',
        armorClass: '',
        speed: '',
        mapSize: 1,
        immunities: { damageTypes: [], conditions: [] },
        vulnerabilities: [],
        resistances: [],
        features: [],
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
        immunities: Yup.object(),
        vulnerabilities: Yup.array().of(Yup.string()),
        resistances: Yup.array().of(Yup.string()),
        features: Yup.array().of(Yup.string())
      })}
      onSubmit={(values, { setSubmitting }) =>
        submitHandler(values, setSubmitting)
      }
    >
      {formProps => {
        // console.log(formProps);
        return formProps.submitCount > 0 &&
                !formProps.isSubmitting &&
                formProps.isValid &&
                props.operationSuccess ? (
          <Redirect to={`/templates/${formProps.values.type}s`} />
        ) : (
          <Form className={classes.EditParticipantTemplateForm}>
            <label>Type</label>
            <div className={classes.RadioButtonsGroup}>
              <Field
                type="radio"
                name="type"
                id="player"
                value={ParticipantType.Player}
                component={Input}
                serverError={props.serverError}
              />
              <label htmlFor="player">Player</label>
              <Field
                type="radio"
                name="type"
                id="monster"
                value={ParticipantType.Monster}
                component={Input}
                serverError={props.serverError}
              />
              <label htmlFor="monster">Monster</label>
            </div>

            <label className={classes.Avatar}>Avatar</label>

            <div className={classes.Avatar}>
              <Field id="avatarUrl" name="avatarUrl" component={Avatar} />
            </div>

            <label htmlFor="name">Name</label>
            <Field
              type="text"
              id="name"
              name="name"
              hidingBorder
              component={Input}
              serverError={props.serverError}
            />

            <label htmlFor="initiativeModifier">Initiative Modifier</label>
            <Field
              type="number"
              name="initiativeModifier"
              id="initiativeModifier"
              hidingBorder
              component={Input}
              serverError={props.serverError}
            />

            <label htmlFor="maxHp">Max HP</label>
            <Field
              type="number"
              name="maxHp"
              id="maxHp"
              min={1}
              hidingBorder
              component={Input}
              serverError={props.serverError}
            />

            <label htmlFor="armorClass">Armor class</label>
            <Field
              type="number"
              name="armorClass"
              id="armorClass"
              min={0}
              hidingBorder
              component={Input}
              serverError={props.serverError}
            />

            <label htmlFor="speed">Speed</label>
            <Field
              type="number"
              name="speed"
              id="speed"
              min={0}
              hidingBorder
              component={Input}
              serverError={props.serverError}
            />

            <label htmlFor="mapSize">Map size</label>
            <Field
              type="number"
              name="mapSize"
              id="mapSize"
              min={1}
              hidingBorder
              component={Input}
              serverError={props.serverError}
            />

            <label htmlFor="immunities">Immunities</label>
            <Field
              className={classes.Select}
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
              serverError={props.serverError}
            />
            {props.serverError ? <ServerError /> : null}
            <Button type="submit" disabled={formProps.isSubmitting}>
              Save
            </Button>
          </Form>
        );
      }}
    </Formik>
  );

  return <div>{form}</div>;
};

const mapStateToProps = state => {
  return {
    operationSuccess: state.participantTemplate.operationSuccess,
    serverError: state.participantTemplate.error
  };
};

export default connect(mapStateToProps)(withAuthCheck(EditParticipantTemplate));
