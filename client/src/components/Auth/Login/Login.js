import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';

import * as actions from '../../../store/actions/index';
import classes from './Login.module.css';
import ServerValidationError from '../../UI/ServerValidationError/ServerValidationError';
import ErrorType from '../../../util/error';

const Login = props => {
  const [redirectPath, setRedirectPath] = useState('/');
  const dispatch = useDispatch();

  useEffect(() => {
    setRedirectPath(props.redirectPath);
    dispatch(actions.setAuthRedirectPath('/'));
  }, [props.redirectPath, dispatch]);

  const submitHandler = useCallback(
    formValues => {
      dispatch(
        actions.login({
          email: formValues.email,
          password: formValues.password
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
          email: '1@1.com',
          password: '1111111'
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
          submitHandler(values, setSubmitting)
        }
      >
        {formProps => (
          <Form className={classes.LoginForm}>
            <Field name="email" type="text" placeholder="E-mail" />
            <ErrorMessage name="email" />
            <ServerValidationError for="email" serverError={props.error} />

            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage name="password" />
            <ServerValidationError for="password" serverError={props.error} />

            {operationErrorMessage}

            <button type="submit" disabled={props.loading}>
              Login
            </button>

            <div>
              Don't have an account?
              <Link to={'/register'}>{'Register'}</Link>
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

export default connect(mapStateToProps)(Login);
