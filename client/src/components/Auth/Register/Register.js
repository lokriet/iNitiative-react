import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';

import * as actions from '../../../store/actions/index';
import classes from './Register.module.css';
import ServerValidationError from '../../UI/ServerValidationError/ServerValidationError';

const Register = props => {
  const [redirectPath, setRedirectPath] = useState('/');
  const dispatch = useDispatch();


  useEffect(() => {
    setRedirectPath(props.redirectPath);
    dispatch(actions.setAuthRedirectPath('/'));
  }, [props.redirectPath, dispatch]);


  const submitHandler = useCallback(
    formValues => {
      dispatch(
        actions.register({
          username: formValues.username,
          email: formValues.email,
          password: formValues.password
        })
      );
    },
    [dispatch]
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

  let form = null;

  if (!props.isAuthenticated) {
    form = (
      <Formik
        initialValues={{
          username: '',
          email: '1@1.com',
          password: '1111111',
          confirmPassword: '1111111'
        }}
        validationSchema={Yup.object({
          username: Yup.string(),
          email: Yup.string().email('Invalid email address'),
          password: Yup.string()
            .required('Required')
            .min(6, 'Must be at least 6 characters long'),
          confirmPassword: Yup.string()
            .equalTo(Yup.ref('password'), 'Passwords must match')
            .required('Required')
        })}
        onSubmit={(values, { setSubmitting }) =>
          submitHandler(values, setSubmitting)
        }
      >
        {({ isSubmitting }) => (
          <Form className={classes.RegisterForm}>
            <Field name="username" type="text" placeholder="Username" />
            <ErrorMessage name="username" />
            <ServerValidationError for="username" serverError={props.error} />

            <Field name="email" type="text" placeholder="E-mail" />
            <ErrorMessage name="email" />
            <ServerValidationError for="email" serverError={props.error} />

            <Field name="password" type="password" placeholder="Password" />
            <ErrorMessage name="password" />
            <ServerValidationError for="password" serverError={props.error} />

            <Field
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
            />
            <ErrorMessage name="confirmPassword" />
            <button type="submit" disabled={props.loading}>
              Register
            </button>
          </Form>
        )}
      </Formik>
    );
  }

  return props.isAuthenticated ? (
    <Redirect to={redirectPath} />
  ) 
  : form; 
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token != null,
    redirectPath: state.auth.redirectPath
  };
};

Register.propTypes = {};

export default connect(mapStateToProps)(Register);
