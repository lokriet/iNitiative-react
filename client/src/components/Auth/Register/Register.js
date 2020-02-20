import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import * as actions from '../../../store/actions/index';
import ErrorType from '../../../util/error';

import Button from '../../UI/Form/Button/Button';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';

import classes from './Register.module.css';

const Register = props => {
  const [redirectPath, setRedirectPath] = useState('/');
  const dispatch = useDispatch();

  useEffect(() => {
    setRedirectPath(props.redirectPath);
    dispatch(actions.setAuthRedirectPath('/'));
  }, [props.redirectPath, dispatch]);

  const handleSubmit = useCallback(
    formValues => {
      dispatch(
        actions.authenticate(true, {
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
          rememberMe: formValues.rememberMe
        })
      );
    },
    [dispatch]
  );

  function equalTo(ref, msg) {
    return Yup.mixed().test({
      name: 'equalTo',
      exclusive: false,
      // eslint-disable-next-line no-template-curly-in-string
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
    let operationErrorMessage = null;
    if (props.error && props.error.type !== ErrorType.VALIDATION_ERROR) {
      operationErrorMessage = <div>{props.error.message}</div>;
    }

    form = (
      <Formik
        // initialValues={{
        //   username: '',
        //   email: '1@1.com',
        //   password: '1111111',
        //   confirmPassword: '1111111',
        //   rememberMe: true
        // }}
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
            .equalTo(Yup.ref('password'), 'Passwords must match')
            .required('Required')
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
            serverError={props.error}
            component={FormikInput}
          />

          <Field
            name="password"
            type="password"
            placeholder="Password"
            serverError={props.error}
            component={FormikInput}
          />

          <Field
            name="confirmPassword"
            type="password"
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

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token != null,
    redirectPath: state.auth.redirectPath
  };
};

export default connect(mapStateToProps)(Register);
