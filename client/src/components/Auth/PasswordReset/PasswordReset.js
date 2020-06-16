import React, { useState, useEffect, useCallback } from 'react';
import classes from './PasswordReset.module.css';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import * as actions from '../../../store/actions/index';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';
import Button from '../../UI/Form/Button/Button';
import Error from '../../UI/Errors/Error/Error';

const PasswordReset = (props) => {
  const { resetPasswordToken } = useParams();
  const [requestSent, setRequestSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.authInit());
  }, [dispatch]);

  const handleSubmit = useCallback(
    (formValues) => {
      setRequestSent(true);
      dispatch(
        actions.resetPassword(
          formValues.password,
          resetPasswordToken,
          setResetSuccess
        )
      );
    },
    [dispatch, resetPasswordToken]
  );

  let view;
  if (requestSent && resetSuccess) {
    view = (
      <>
        <h1>Password changed successfully</h1>
        <p>
          Please <Link to="/login">login</Link> to the application with your new
          password
        </p>
      </>
    );
  } else {
    view = (
      <>
        <Formik
          initialValues={{
            password: '',
            confirmPassword: ''
          }}
          validationSchema={Yup.object({
            password: Yup.string()
              .required('Password is required')
              .min(6, 'Password must be at least 6 characters long'),
            confirmPassword: Yup.string()
              .required('Confirm password is required')
              .oneOf([Yup.ref('password')], "Passwords don't match")
          })}
          onSubmit={(values, { setSubmitting }) => handleSubmit(values)}
        >
          <Form>
            <Field
              name="password"
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              serverError={props.error}
              component={FormikInput}
              className={classes.Input}
            />

            <Field
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              serverError={props.error}
              component={FormikInput}
              className={classes.Input}
            />

            <div className={classes.Buttons}>
              <Link to="/login">
                <Button
                  type="button"
                  disabled={props.loading}
                  className={classes.SpacedButton}
                >
                  Cancel
                </Button>
              </Link>

              <Button type="submit" disabled={props.loading}>
                Change password
              </Button>
            </div>

            {props.error ? <Error>{props.error.message}</Error> : null}
          </Form>
        </Formik>
      </>
    );
  }
  return <div className={classes.Container}>{view}</div>;
};

PasswordReset.propTypes = {};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    loading: state.auth.loading
  };
};

export default connect(mapStateToProps)(PasswordReset);