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
import { Redirect, useHistory, useParams } from 'react-router-dom';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Button from '../../UI/Form/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';

const EditParticipantTemplate = props => {
  const queryParams = useQueryParams();
  const [participantType] = useState(
    queryParams.get('type') || ParticipantType.Player
  );
  const { templateId } = useParams();
  const editMode = !props.isNew;

  const dispatch = useDispatch();
  const history = useHistory();
  const [damageTypes, combined, features] = useDropdownValues();

  useEffect(() => {
    dispatch(actions.startParticipantTemplateOperation());
    if (editMode) {
      dispatch(actions.getParticipantTemplateById(templateId));
    }

    return () => {
      if (editMode) {
        dispatch(actions.resetEditedParticipantTemplate());
      }
    };
  }, [dispatch, editMode, templateId]);

  const submitHandler = useCallback(
    (values, setSubmitting) => {
      console.log('submit!', values);
      dispatch(
        actions.editParticipantTemplate(
          editMode ? templateId : null,
          values,
          setSubmitting
        )
      );
    },
    [dispatch, editMode, templateId]
  );

  let form;

  if (
    !editMode ||
    (props.editedTemplate != null)
  ) {
    form = (
      <Formik
        initialValues={{
          type: editMode ? props.editedTemplate.type : participantType,
          avatarUrl: editMode ? props.editedTemplate.avatarUrl || '' : '',
          name: editMode ? props.editedTemplate.name : '',
          initiativeModifier: editMode
            ? props.editedTemplate.initiativeModifier
            : 0,
          maxHp: editMode ? props.editedTemplate.maxHp : '',
          armorClass: editMode ? props.editedTemplate.armorClass : '',
          speed: editMode ? props.editedTemplate.speed : '',
          swimSpeed: editMode ? props.editedTemplate.swimSpeed || '' : '',
          climbSpeed: editMode ? props.editedTemplate.climbSpeed || '' : '',
          flySpeed: editMode ? props.editedTemplate.flySpeed || '' : '',
          mapSize: editMode ? props.editedTemplate.mapSize : 1,
          immunities: editMode
            ? props.editedTemplate.immunities
            : { damageTypes: [], conditions: [] },
          vulnerabilities: editMode ? props.editedTemplate.vulnerabilities : [],
          resistances: editMode ? props.editedTemplate.resistances : [],
          features: editMode ? props.editedTemplate.features : [],
          comment: editMode ? props.editedTemplate.comment : ''
        }}
        validationSchema={Yup.object({
          type: Yup.string().required('Type is required'),
          name: Yup.string().required('Name is required'),
          avatarUrl: Yup.string(),
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
          swimSpeed: Yup.number().min(0, 'Speed should be positive').nullable(true),
          climbSpeed: Yup.number().min(0, 'Speed should be positive').nullable(true),
          flySpeed: Yup.number().min(0, 'Speed should be positive').nullable(true),
          mapSize: Yup.number()
            .required('Map size is required')
            .min(1, 'Map size should be more than 0'),
          comment: Yup.string().trim(),
          immunities: Yup.object(),
          vulnerabilities: Yup.array().of(Yup.object()),
          resistances: Yup.array().of(Yup.object()),
          features: Yup.array().of(Yup.object())
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
                className={classes.InputField}
                type="text"
                id="name"
                name="name"
                hidingBorder
                component={Input}
                serverError={props.serverError}
              />

              <label htmlFor="initiativeModifier">Initiative Modifier</label>
              <Field
                className={classes.InputField}
                type="number"
                name="initiativeModifier"
                id="initiativeModifier"
                hidingBorder
                component={Input}
                serverError={props.serverError}
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
                serverError={props.serverError}
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
                serverError={props.serverError}
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
                serverError={props.serverError}
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
                    serverError={props.serverError}
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
                    serverError={props.serverError}
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
                    serverError={props.serverError}
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
                serverError={props.serverError}
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

              <label htmlFor="comment">Comment</label>
              <Field
                className={classes.InputField}
                inputType="textarea"
                name="comment"
                id="comment"
                hidingBorder
                component={Input}
                serverError={props.serverError}
              />
              {props.serverError ? (
                <ServerError
                  className={classes.FullRow}
                  serverError={props.serverError}
                />
              ) : null}

              <div className={classes.FullRow}>
                <Button type="submit" disabled={formProps.isSubmitting}>
                  Save
                </Button>
                <Button type="button" onClick={history.goBack}>
                  Cancel
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }

  if (editMode && !props.editedTemplate) {
    if (props.serverError) {
      return <ServerError serverError={props.serverError} />;
    } else {
      return <Spinner />;
    }
  } else {
    return <div>{form}</div>;
  }
};

const mapStateToProps = state => {
  return {
    operationSuccess: state.participantTemplate.operationSuccess,
    serverError: state.participantTemplate.error,
    editedTemplate: state.participantTemplate.editedParticipantTemplate
  };
};

export default connect(mapStateToProps)(withAuthCheck(EditParticipantTemplate));
