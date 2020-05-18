import React, { useState, useEffect, useCallback } from 'react';
import classes from './PasswordResetRequest.module.css';
import { useLocation, Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { Formik, Form, Field } from 'formik';
import Error from '../../UI/Errors/Error/Error';
import * as Yup from 'yup';
import FormikInput from '../../UI/Form/Input/FormikInput/FormikInput';
import Button from '../../UI/Form/Button/Button';

const PasswordResetRequest = (props) => {
  const [query] = useState(new URLSearchParams(useLocation().search));
  const [requestSent, setRequestSent] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.authInit());
  }, [dispatch]);

  const handleSubmit = useCallback(
    (formValues) => {
      setRequestSent(true);
      dispatch(
        actions.requestPasswordReset(formValues.email, setRequestSuccess)
      );
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
        <Link to="/login"><Button className={classes.Button}>Return to login page</Button></Link>
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
            email: query.get('email')
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

            <Button type="submit" disabled={props.loading} className={classes.Button}>
              Reset password
            </Button>

            <Link to="/login">
              <Button type="button" disabled={props.loading}  className={classes.Button} >
                Cancel
              </Button>
            </Link>

            {props.error ? <Error>{props.error.message}</Error> : null}
          </Form>
        </Formik>
      </div>
    );
  }

  return <div className={classes.Container}>{view}</div>;
};

PasswordResetRequest.propTypes = {};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    loading: state.auth.loading
  };
};

export default connect(mapStateToProps)(PasswordResetRequest);
