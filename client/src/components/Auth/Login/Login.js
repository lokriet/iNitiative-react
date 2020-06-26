import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import {  authInit, authenticate, selectIsAuthenticated } from '../authSlice';
import ErrorType from '../../../util/error';

import Button from '../../UI/Form/Button/Button';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';

import classes from './Login.module.css';
import Error from '../../UI/Errors/Error/Error';

const Login = () => {
  const { loading, error, redirectPath: storeRedirectPath } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [redirectPath] = useState(storeRedirectPath);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authInit({resetRedirectPath: true}));
  }, [dispatch]);

  const handleSubmit = useCallback(
    (formValues) => {
      dispatch(
        authenticate({
          isRegister: false,
          email: formValues.email,
          password: formValues.password,
          rememberMe: formValues.rememberMe
        })
      );
    },
    [dispatch]
  );

  let form = null;

  if (!isAuthenticated) {
    let operationErrorMessage = null;
    if (error && error.type !== ErrorType.VALIDATION_ERROR) {
      operationErrorMessage = <Error>{error.message}</Error>;
    }

    form = (
      <Formik
        initialValues={{
          email: '',
          password: '',
          rememberMe: true
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .required('Required')
            .email('Invalid email address'),
          password: Yup.string()
            .required('Required')
            .min(6, 'Must be at least 6 characters long')
        })}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        {(formikForm) => (
          <Form className={classes.LoginForm}>
            <Field
              name="email"
              type="text"
              placeholder="E-mail"
              autoComplete="username"
              serverError={error}
              component={FormikInput}
            />

            <Field
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              serverError={error}
              component={FormikInput}
            />

            <label>
              <Field name="rememberMe" type="checkbox" />
              Remember me
            </label>

            <div>
              <Link
                to={`/requestPasswordReset?email=${formikForm.values.email}`}
              >
                Forgot password
              </Link>
            </div>

            {operationErrorMessage}

            <Button type="submit" disabled={loading}>
              Login
            </Button>

            <div>
              Don't have an account?
              <Link to="/register">Register</Link>
            </div>
          </Form>
        )}
      </Formik>
    );
  }

  return isAuthenticated ? <Redirect to={redirectPath} /> : form;
};

export default Login;
