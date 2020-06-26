import React, { useState, useEffect, useCallback } from 'react';
import classes from './PasswordResetRequest.module.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authInit, requestPasswordReset } from '../authSlice';
import { Formik, Form, Field } from 'formik';
import Error from '../../UI/Errors/Error/Error';
import * as Yup from 'yup';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';
import Button from '../../UI/Form/Button/Button';
import useQueryParams from '../../../hooks/useQueryParams';

const PasswordResetRequest = () => {
  const [queryParams] = useQueryParams();
  const [requestSent, setRequestSent] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const { error, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authInit({ resetRedirectPath: false }));
  }, [dispatch]);

  const handleSubmit = useCallback(
    (formValues) => {
      setRequestSent(true);
      dispatch(requestPasswordReset(formValues.email, setRequestSuccess));
    },
    [dispatch, setRequestSuccess]
  );

  let view;
  if (requestSent && requestSuccess) {
    view = (
      <>
        <h1>Email sent</h1>
        <p>
          Please check your inbox for the instructions about how to complete the
          process.
        </p>
        <Link to="/login">
          <Button className={classes.Button}>Return to login page</Button>
        </Link>
      </>
    );
  } else {
    view = (
      <div>
        <h1>Reset your password</h1>
        <p>To reset your password, enter your email below and submit.</p>
        <p>
          An email will be sent to you with instructions about how to complete
          the process.
        </p>
        <Formik
          initialValues={{
            email: queryParams.get('email')
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .required('Email is required')
              .email('Invalid email address')
          })}
          onSubmit={(values, { setSubmitting }) => handleSubmit(values)}
        >
          <Form className={classes.ResetForm}>
            <Field
              name="email"
              type="text"
              placeholder="Email"
              autoComplete="username"
              component={FormikInput}
              className={classes.EmailInput}
            />

            <Button type="submit" disabled={loading} className={classes.Button}>
              Reset password
            </Button>

            <Link to="/login">
              <Button
                type="button"
                disabled={loading}
                className={classes.Button}
              >
                Cancel
              </Button>
            </Link>

            {error ? <Error>{error.message}</Error> : null}
          </Form>
        </Formik>
      </div>
    );
  }

  return <div className={classes.Container}>{view}</div>;
};

export default PasswordResetRequest;
