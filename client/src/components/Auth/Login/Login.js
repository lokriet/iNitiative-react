import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import * as actions from '../../../store/actions/index';
import ErrorType from '../../../util/error';

import Button from '../../UI/Form/Button/Button';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';

import classes from './Login.module.css';

const Login = props => {
  const [redirectPath] = useState(props.redirectPath);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.setAuthRedirectPath('/'));
    dispatch(actions.authInit());
  }, [dispatch]);

  const handleSubmit = useCallback(
    formValues => {
      dispatch(
        actions.authenticate(false, {
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
        <Form className={classes.LoginForm}>
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
            autoComplete="current-password"
            serverError={props.error}
            component={FormikInput}
          />

          <label>
            <Field name="rememberMe" type="checkbox" />
            Remember me
          </label>

          {operationErrorMessage}

          <Button type="submit" disabled={props.loading}>
            Login
          </Button>

          <div>
            Don't have an account?
            <Link to={'/register'}>Register</Link>
          </div>
        </Form>
      </Formik>
    );
  }

  return props.isAuthenticated ? <Redirect to={redirectPath} /> : form;
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token != null,
    redirectPath: state.auth.redirectPath
  };
};

export default connect(mapStateToProps)(Login);
