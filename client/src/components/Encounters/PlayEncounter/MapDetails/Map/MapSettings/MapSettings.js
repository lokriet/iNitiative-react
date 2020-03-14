import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import FormikInput from '../../../../../UI/Form/Input/FormikInput/FormikInput';

import classes from './MapSettings.module.css';
import Button from '../../../../../UI/Form/Button/Button';
import ItemsRow from '../../../../../UI/ItemsRow/ItemsRow';

const MapSettings = ({ mapSettings, onSettingsChanged }) => {
  const handleSubmit = useCallback(
    (formValues, close) => {
      onSettingsChanged(formValues);
      close();
    },
    [onSettingsChanged]
  );

  return (
    <Popup
      on="click"
      trigger={open => (
        <div className={classes.SettingsButton}>
          <FontAwesomeIcon icon={faCog} />
        </div>
      )}
      position="bottom left"
      offsetX={15}
      arrow={false}
      contentStyle={{ width: 'auto' }}
    >
      {close => (
        <Formik
          initialValues={mapSettings}
          validationSchema={Yup.object({
            gridColor: Yup.string().nullable(true),
            snapToGrid: Yup.bool(),
            showGrid: Yup.bool(),
            showInfo: Yup.bool(),
            showDead: Yup.bool(),
            girdWidth: Yup.number()
              .min(1, 'Grid size should be positive')
              .max(1000)
              .nullable(true),
            gridHeight: Yup.number()
              .min(1, 'Grid size should be positive')
              .max(1000)
              .nullable(true)
          })}
          onSubmit={values => handleSubmit(values, close)}
        >
          {formProps => (
            <Form className={classes.MapSettingsForm}>
              <div className={classes.FormHeader}>Map settings</div>

              <ItemsRow alignCentered className={classes.FullRow}>
                <label htmlFor="gridColor">Grid color</label>
                <Field type="color" name="gridColor" id="gridColor" />
              </ItemsRow>

              <div>
                <Field type="checkbox" name="snapToGrid" id="snapToGrid" />
                <label htmlFor="snapToGrid">Snap to grid</label>
              </div>
              <div>
                <Field type="checkbox" name="showGrid" id="showGrid" />
                <label htmlFor="showGrid">Show grid</label>
              </div>
              <div>
                <Field type="checkbox" name="showInfo" id="showInfo" />
                <label htmlFor="showInfo">Show info</label>
              </div>
              <div>
                <Field type="checkbox" name="showDead" id="showDead" />
                <label htmlFor="showDead">Show dead</label>
              </div>

              <ItemsRow className={classes.FullRow} alignCentered>
                <label htmlFor="gridWidth">Grid size</label>

                <ItemsRow alignCentered>
                  <label htmlFor="gridWidth">W: </label>
                  <Field
                    type="number"
                    min={1}
                    max={1000}
                    id="gridWidth"
                    name="gridWidth"
                    hidingBorder
                    className={classes.ShortInput}
                    component={FormikInput}
                  />
                </ItemsRow>

                <ItemsRow alignCentered>
                  <label htmlFor="gridHeight">H: </label>
                  <Field
                    type="number"
                    min={1}
                    max={1000}
                    id="gridHeight"
                    name="gridHeight"
                    hidingBorder
                    className={classes.ShortInput}
                    component={FormikInput}
                  />
                </ItemsRow>
              </ItemsRow>

              <ItemsRow className={classes.FormButtons}>
                <Button type="submit">Ok</Button>
                <Button onClick={close}>Cancel</Button>
              </ItemsRow>
            </Form>
          )}
        </Formik>
      )}
    </Popup>
  );
};

MapSettings.propTypes = {
  onSettingsChanged: PropTypes.func.isRequired,
  mapSettings: PropTypes.object.isRequired
};

export default MapSettings;
