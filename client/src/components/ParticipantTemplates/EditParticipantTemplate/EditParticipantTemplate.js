import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  resetTemplateOperation,
  fetchEditedTemplate,
  resetEditedTemplate,
  updateTemplate,
  addTemplate,
  selectEditedParticipantTemplate
} from '../participantTemplateSlice';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Button from '../../UI/Form/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import FormikColorPicker from '../../UI/Color/ColorPicker/FormikColorPicker';
import PropTypes from 'prop-types';
import {cleanUpAvatarUrls} from '../../../store/common/commonSlice';

const EditParticipantTemplate = ({ isNew }) => {
  const queryParams = useQueryParams();
  const [participantType] = useState(
    queryParams.get('type') || ParticipantType.Player
  );
  const { templateId } = useParams();
  const editMode = !isNew;

  const dispatch = useDispatch();
  const history = useHistory();
  const [damageTypes, combined, features] = useDropdownValues();

  const [avatarUrlsToCheck, setAvatarUrlsToCheck] = useState(new Set());
  const avatarUrlsToCheckRef = useRef(avatarUrlsToCheck);
  avatarUrlsToCheckRef.current = avatarUrlsToCheck;

  const serverError = useSelector((state) => state.participantTemplate.error);
  const operationSuccess = useSelector(
    (state) => state.participantTemplate.operationSuccess
  );
  const editedTemplate = useSelector(selectEditedParticipantTemplate);

  useEffect(() => {
    return () => {
      dispatch(
        cleanUpAvatarUrls(Array.from(avatarUrlsToCheckRef.current))
      );
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetTemplateOperation());
    if (editMode) {
      dispatch(fetchEditedTemplate(templateId));
    }

    return () => {
      if (editMode) {
        dispatch(resetEditedTemplate());
      }
    };
  }, [dispatch, editMode, templateId]);

  const handleSubmit = useCallback(
    (values, setSubmitting) => {
      editMode
        ? dispatch(updateTemplate(templateId, values, setSubmitting))
        : dispatch(addTemplate(null, values, setSubmitting));
    },
    [dispatch, editMode, templateId]
  );

  const handleAvatarChange = useCallback(
    (newAvatarUrl) => {
      const newAvatarUrlsToCheck = new Set(avatarUrlsToCheck);
      if (editedTemplate != null && editedTemplate.avatarUrl) {
        newAvatarUrlsToCheck.add(editedTemplate.avatarUrl);
      }
      if (newAvatarUrl !== null && newAvatarUrl !== '') {
        newAvatarUrlsToCheck.add(newAvatarUrl);
      }
      setAvatarUrlsToCheck(newAvatarUrlsToCheck);
    },
    [avatarUrlsToCheck, editedTemplate]
  );

  let form;
  if (!editMode || editedTemplate != null) {
    form = (
      <Formik
        initialValues={{
          type: editMode ? editedTemplate.type : participantType,
          avatarUrl: editMode ? editedTemplate.avatarUrl || '' : '',
          color: editMode ? editedTemplate.color || '' : '',
          name: editMode ? editedTemplate.name : '',
          initiativeModifier: editMode ? editedTemplate.initiativeModifier : 0,
          maxHp: editMode ? editedTemplate.maxHp : '',
          armorClass: editMode ? editedTemplate.armorClass : '',
          speed: editMode ? editedTemplate.speed : '',
          swimSpeed: editMode ? editedTemplate.swimSpeed || '' : '',
          climbSpeed: editMode ? editedTemplate.climbSpeed || '' : '',
          flySpeed: editMode ? editedTemplate.flySpeed || '' : '',
          mapSize: editMode ? editedTemplate.mapSize : 1,
          immunities: editMode
            ? editedTemplate.immunities
            : { damageTypes: [], conditions: [] },
          vulnerabilities: editMode ? editedTemplate.vulnerabilities : [],
          resistances: editMode ? editedTemplate.resistances : [],
          features: editMode ? editedTemplate.features : [],
          comment: editMode ? editedTemplate.comment : ''
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
          comment: Yup.string().trim(),
          immunities: Yup.object(),
          vulnerabilities: Yup.array().of(Yup.object()),
          resistances: Yup.array().of(Yup.object()),
          features: Yup.array().of(Yup.object())
        })}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        {(formProps) => {
          return formProps.submitCount > 0 &&
            !formProps.isSubmitting &&
            formProps.isValid &&
            operationSuccess ? (
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
                  serverError={serverError}
                />
                <label htmlFor="player">Player</label>
                <Field
                  type="radio"
                  name="type"
                  id="monster"
                  value={ParticipantType.Monster}
                  component={Input}
                  serverError={serverError}
                />
                <label htmlFor="monster">Monster</label>
              </div>

              <label htmlFor="color">Color</label>
              <Field id="color" name="color" component={FormikColorPicker} />

              <label className={classes.Avatar}>Avatar</label>
              <div className={classes.Avatar}>
                <Field
                  id="avatarUrl"
                  name="avatarUrl"
                  component={Avatar}
                  onAvatarChanged={handleAvatarChange}
                />
              </div>

              <label htmlFor="name">Name</label>
              <Field
                className={classes.InputField}
                type="text"
                id="name"
                name="name"
                hidingBorder
                component={Input}
                serverError={serverError}
              />

              <label htmlFor="initiativeModifier">Initiative Modifier</label>
              <Field
                className={classes.InputField}
                type="number"
                name="initiativeModifier"
                id="initiativeModifier"
                hidingBorder
                component={Input}
                serverError={serverError}
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
                serverError={serverError}
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
                serverError={serverError}
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
                serverError={serverError}
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
                    serverError={serverError}
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
                    serverError={serverError}
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
                    serverError={serverError}
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
                serverError={serverError}
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
                serverError={serverError}
              />
              {serverError ? (
                <ServerError
                  className={classes.FullRow}
                  serverError={serverError}
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

  if (editMode && !editedTemplate) {
    if (serverError) {
      return <ServerError serverError={serverError} />;
    } else {
      return <Spinner />;
    }
  } else {
    return <div>{form}</div>;
  }
};

EditParticipantTemplate.propTypes = {
  isNew: PropTypes.bool
};

export default withAuthCheck(EditParticipantTemplate);
