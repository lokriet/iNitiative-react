import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import { authInit, authenticate, selectIsAuthenticated } from '../authSlice';
import ErrorType from '../../../util/error';

import Button from '../../UI/Form/Button/Button';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';

import classes from './Register.module.css';

const Register = () => {
  const {loading, error, redirectPath: storeRedirectPath} = useSelector(state => state.auth);
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
          isRegister: true,
          username: formValues.username,
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
      operationErrorMessage = <div>{error.message}</div>;
    }

    form = (
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          rememberMe: true
        }}
        validationSchema={Yup.object({
          username: Yup.string(),
          email: Yup.string()
            .required('Required')
            .email('Invalid email address'),
          password: Yup.string()
            .required('Required')
            .min(6, 'Must be at least 6 characters long'),
          confirmPassword: Yup.string()
            .required('Required')
            .oneOf([Yup.ref('password')], "Passwords don't match")
        })}
        onSubmit={(values, { setSubmitting }) =>
          handleSubmit(values, setSubmitting)
        }
      >
        <Form className={classes.RegisterForm}>
          <Field
            name="username"
            type="text"
            placeholder="Username"
            serverError={error}
            component={FormikInput}
          />

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
            autoComplete="new-password"
            serverError={error}
            component={FormikInput}
          />

          <Field
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            component={FormikInput}
          />

          <label>
            <Field name="rememberMe" type="checkbox" />
            Remember me
          </label>

          {operationErrorMessage}

          <Button type="submit" disabled={loading}>
            Register
          </Button>

          <div>
            Already have an account?
            <Link to="/login">Login</Link>
          </div>
        </Form>
      </Formik>
    );
  }

  return isAuthenticated ? <Redirect to={redirectPath} /> : form;
};

export default Register;
