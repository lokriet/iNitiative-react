import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import { setAuthRedirectPath, authInit, authenticate } from '../authSlice';
import ErrorType from '../../../util/error';

import Button from '../../UI/Form/Button/Button';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';

import classes from './Register.module.css';

const Register = (props) => {
  const [redirectPath, setRedirectPath] = useState('/');
  const dispatch = useDispatch();

  useEffect(() => {
    setRedirectPath(props.redirectPath);
    dispatch(setAuthRedirectPath('/'));
    dispatch(authInit());
  }, [props.redirectPath, dispatch]);

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

  if (!props.isAuthenticated) {
    let operationErrorMessage = null;
    if (props.error && props.error.type !== ErrorType.VALIDATION_ERROR) {
      operationErrorMessage = <div>{props.error.message}</div>;
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
            serverError={props.error}
            component={FormikInput}
          />

          <Field
            name="email"
            type="text"
            placeholder="E-mail"
            autoComplete="username"
            serverError={props.error}
            component={FormikInput}
          />

          <Field
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            serverError={props.error}
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

          <Button type="submit" disabled={props.loading}>
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

  return props.isAuthenticated ? <Redirect to={redirectPath} /> : form;
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token != null,
    redirectPath: state.auth.redirectPath
  };
};

export default connect(mapStateToProps)(Register);
