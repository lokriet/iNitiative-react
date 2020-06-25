import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classes from './Home.module.css';
import { isEmpty, formatDate } from '../../util/helper-methods';
import Spinner from '../UI/Spinner/Spinner';
import {
  fetchLatestEncounter,
  resetLatestEncounter,
  selectLatestEncounter
} from '../Encounters/encounterSlice';
import { selectAllNews, fetchNews } from './newsSlice';

const Home = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.auth.token != null);
  const user = useSelector(state => state.auth.user);

  const latestEncounter = useSelector(selectLatestEncounter);
  const fetchingLatestEncounter = useSelector(state => state.encounter.fetching);
  const fetchingEncounterError = useSelector(state => state.encounter.fetchingError);

  const news = useSelector(selectAllNews);
  const fetchingNews = useSelector(state => state.news.fetching);
  const fetchingNewsError = useSelector(state => state.news.error);


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchLatestEncounter());
    }
    dispatch(fetchNews());

    return () => {
      dispatch(resetLatestEncounter());
    };
  }, [dispatch, isAuthenticated]);

  let jumpRightInContent;
  if (fetchingLatestEncounter) {
    jumpRightInContent = <Spinner />;
  } else if (latestEncounter) {
    const lastActivityDate = new Date(latestEncounter.updatedAt);
    jumpRightInContent = (
      <>
        <div>
          Continue where you left off:{' '}
          <Link to={`/encounters/play/${latestEncounter._id}`}>
            {latestEncounter.name}
          </Link>
        </div>
        <br />
        <div className={classes.SideNote}>
          Last activity at: {lastActivityDate.getHours()}:
          {lastActivityDate.getMinutes()} {formatDate(lastActivityDate)}
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

  let newsView;
  if (fetchingNews) {
    newsView = <Spinner />;
  } else if (fetchingNewsError) {
    newsView = <div>Oops, something went wrong</div>;
  } else {
    newsView = (
      <div className={classes.NewsContainer}>
        {news.map((item) => {
          return (
            <div key={item._id} className={classes.News}>
              <div className={classes.NewsHeader}>{item.title}</div>
              <div className={classes.NewsDate}>
                {formatDate(item.createdAt)}
              </div>
              <div className={classes.NewsContent}>{item.text}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={classes.Container}>
      <h1 className={classes.Greeting}>
        Hi
        {!user
          ? ' stranger'
          : isEmpty(user.username)
          ? ''
          : ` ${user.username}`}
        !
      </h1>

      <div className={classes.Columns}>
        <div className={classes.CardsContainer}>
          {isAuthenticated ? (
            fetchingEncounterError == null ? (
              <div className={classes.Card}>
                <div className={classes.CardHeader}>Jump right in!</div>
                <div className={classes.CardContent}>{jumpRightInContent}</div>
              </div>
            ) : null
          ) : (
            <div className={classes.Card}>
              <div className={classes.CardHeader}>You are not logged in</div>
              <div className={classes.CardContent}>
                <div>
                  You'll have a lot of fun once you are logged in. Give it a
                  try!
                </div>
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

          {isAuthenticated ? (
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

        {newsView}
      </div>
    </div>
  );
};

export default Home;
