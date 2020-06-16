import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import * as actions from '../../store/actions/index';
import { Link } from 'react-router-dom';
import classes from './Home.module.css';
import { isEmpty, formatDate } from '../../util/helper-methods';
import Spinner from '../UI/Spinner/Spinner';

const Home = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getLatestEncounter());
    dispatch(actions.getNews());

    return () => {
      dispatch(actions.setLatestEncounter(null));
    };
  }, [dispatch]);

  let jumpRightInContent;
  if (props.fetching) {
    jumpRightInContent = <Spinner />;
  } else if (props.latestEncounter) {
    const lastActivityDate = new Date(props.latestEncounter.updatedAt);
    jumpRightInContent = (
      <>
        <div>
          Continue where you left off:{' '}
          <Link to={`/encounters/play/${props.latestEncounter._id}`}>
            {props.latestEncounter.name}
          </Link>
        </div>
        <br />
        <div className={classes.SideNote}>
          Last activity at: {lastActivityDate.getHours()}:
          {lastActivityDate.getMinutes()}{' '}
          {formatDate(lastActivityDate)}
        </div>
      </>
    );
  } else {
    jumpRightInContent = (
      <>
        <div>Create an encounter and have fun playing!</div>
        <br />
        <div>
          <Link to="/encounters/new">Right-o</Link>
        </div>
      </>
    );
  }

  let news;
  if (props.fetchingNews) {
    news = <Spinner />;
  } else if (props.fetchingNewsError) {
    news = <div>Oops, something went wrong</div>;
  } else {
    news = (
      <div className={classes.NewsContainer}>
        {props.news.map(item => {
          return (
          <div key={item._id} className={classes.News}>
            <div className={classes.NewsHeader}>{item.title}</div>
            <div className={classes.NewsDate}>
              {formatDate(item.createdAt)}
            </div>
            <div className={classes.NewsContent}>{item.text}</div>
          </div>
        )})}
      </div>
    );
  }

  return (
    <div className={classes.Container}>
      <h1 className={classes.Greeting}>
        Hi
        {!props.user
          ? ' stranger'
          : isEmpty(props.user.username)
          ? ''
          : ` ${props.user.username}`}
        !
      </h1>

      <div className={classes.Columns}>
        <div className={classes.CardsContainer}>
          {props.isAuthenticated ? (
            props.fetchingEncounterError == null ? (
              <div className={classes.Card}>
                <div className={classes.CardHeader}>Jump right in!</div>
                <div className={classes.CardContent}>{jumpRightInContent}</div>
              </div>
            ) : null
          ) : (
            <div className={classes.Card}>
              <div className={classes.CardHeader}>You are not logged in</div>
              <div className={classes.CardContent}>
                <div>You'll have a lot of fun once you are logged in. Give it a try!</div>
                <br />
                <Link to="/login">Log in</Link> or{' '}
                <Link to="/register">Create a new account</Link>
              </div>
            </div>
          )}

          <div className={classes.Card}>
            <div className={classes.CardHeader}>Adore foxes</div>
            <div className={classes.CardContent}>
              <div>Because foxes are the cutest animals ever</div>
              <br />
              <a href="https://www.youtube.com/results?search_query=adorable+fox">
                I want one!
              </a>
            </div>
          </div>

          {props.isAuthenticated ? (
            <div className={classes.Card}>
              <div className={classes.CardHeader}>Tell us what you think</div>
              <div className={classes.CardContent}>
                <div>
                  Let us know how we're doing, ask questions or share your fun
                  with others
                </div>
                <br />
                <Link to="/discuss">Go do it!</Link>
              </div>
            </div>
          ) : null}
        </div>

        {news}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null,
    user: state.auth.user,

    latestEncounter: state.encounter.latestEncounter,
    fetchingLatestEncounter: state.encounter.fetching,
    fetchingEncounterError: state.encounter.fetchingError,

    news: state.news.news,
    fetchingNews: state.news.fetching,
    fetchingNewsError: state.news.error
  };
};

export default connect(mapStateToProps)(Home);
