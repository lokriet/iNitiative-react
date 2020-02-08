import React, { useCallback, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';

import * as actions from '../../store/actions/index';
import classes from './Authenticate.module.css';
import ServerValidationError from '../UI/ServerValidationError/ServerValidationError';
import ErrorType from '../../util/error';

const Authenticate = props => {
  const [redirectPath, setRedirectPath] = useState('/');
  const dispatch = useDispatch();

  useEffect(() => {
    setRedirectPath(props.redirectPath);
    dispatch(actions.setAuthRedirectPath('/'));
  }, [props.redirectPath, dispatch]);

  // const changeModeHandler = useCallback((isLogin, resetForm) => {
  //   setIsLogin(isLogin);
  //   resetForm();
  // }, []);

  const submitHandler = useCallback(
    formValues => {
      if (props.isLogin) {
        dispatch(
          actions.login({
            email: formValues.email,
            password: formValues.password
          })
        );
      } else {
        dispatch(
          actions.register({
            username: formValues.username,
            email: formValues.email,
            password: formValues.password
          })
        );
      }
    },
    [dispatch, props.isLogin]
  );

  function equalTo(ref, msg) {
    return Yup.mixed().test({
      name: 'equalTo',
      exclusive: false,
      message: msg || '${path} must be the same as ${reference}',
      params: {
        reference: ref.path
      },
      test: function(value) {
        return value === this.resolve(ref);
      }
    });
  }
  Yup.addMethod(Yup.string, 'equalTo', equalTo);

  const loginInitialValues = {
    email: '1@1.com',
    password: '1111111'
  };

  const loginValidators = Yup.object({
    email: Yup.string().email('Invalid email address'),
    password: Yup.string()
      .required('Required')
      .min(6, 'Must be at least 6 characters long')
  });

  const registerInitialValues = {
    username: '',
    email: '1@1.com',
    password: '1111111',
    confirmPassword: '1111111'
  };

  const registerValidators = Yup.object({
    username: Yup.string(),
    email: Yup.string().email('Invalid email address'),
    password: Yup.string()
      .required('Required')
      .min(6, 'Must be at least 6 characters long'),
    confirmPassword: Yup.string()
      .equalTo(Yup.ref('password'), 'Passwords must match')
      .required('Required')
  });

  let form = null;

  if (!props.isAuthenticated) {
    let operationErrorMessage = null;
    if (props.error && props.error.type !== ErrorType.VALIDATION_ERROR) {
      operationErrorMessage = <div>{props.error.message}</div>;
    }

    form = (
      <Formik
        initialValues={props.isLogin ? loginInitialValues : registerInitialValues}
        validationSchema={props.isLogin ? loginValidators : registerValidators}
        onSubmit={(values, { setSubmitting }) =>
          submitHandler(values, setSubmitting)
        }
      >
        {formProps => (
          <Form className={classes.AuthenticateForm}>
            {props.isLogin ? null : (
              <Fragment>
                <Field name="username" type="text" placeholder="Username" />
                <ErrorMessage name="username" />
                <ServerValidationError
                  for="username"
                  serverError={props.error}
                />
              </Fragment>
            )}

            <Field name="email" type="text" placeholder="E-mail" />
            <ErrorMessage name="email" />
            <ServerValidationError for="email" serverError={props.error} />

            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage name="password" />
            <ServerValidationError for="password" serverError={props.error} />

            {props.isLogin ? null : (
              <Fragment>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                />
                <ErrorMessage name="confirmPassword" />
              </Fragment>
            )}

            {operationErrorMessage}
            
            <button type="submit" disabled={props.loading}>
              {props.isLogin ? 'Login' : 'Register'}
            </button>

            <div>
              {props.isLogin ? `Don't have an account?` : 'Already have an account?'}
              <Link to={props.isLogin ? '/register' : '/login'}>
                {props.isLogin ? 'Register' : 'Login'}
              </Link>
            </div>
          </Form>
        )}
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

Authenticate.propTypes = {
  isLogin: PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Authenticate);
