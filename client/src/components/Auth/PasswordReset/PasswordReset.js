import React, { useState, useEffect, useCallback } from 'react';
import classes from './PasswordReset.module.css';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { authInit, resetPassword } from '../authSlice';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';
import Button from '../../UI/Form/Button/Button';
import Error from '../../UI/Errors/Error/Error';

const PasswordReset = () => {
  const { resetPasswordToken } = useParams();

  const [requestSent, setRequestSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { error, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authInit({ resetRedirectPath: false }));
  }, [dispatch]);

  const handleSubmit = useCallback(
    (formValues) => {
      setRequestSent(true);
      dispatch(
        resetPassword(formValues.password, resetPasswordToken, setResetSuccess)
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
              serverError={error}
              component={FormikInput}
              className={classes.Input}
            />

            <Field
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              serverError={error}
              component={FormikInput}
              className={classes.Input}
            />

            <div className={classes.Buttons}>
              <Link to="/login">
                <Button
                  type="button"
                  disabled={loading}
                  className={classes.SpacedButton}
                >
                  Cancel
                </Button>
              </Link>

              <Button type="submit" disabled={loading}>
                Change password
              </Button>
            </div>

            {error ? <Error>{error.message}</Error> : null}
          </Form>
        </Formik>
      </>
    );
  }
  return <div className={classes.Container}>{view}</div>;
};

export default PasswordReset;
