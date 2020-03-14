import React, { useEffect } from 'react';

import * as actions from '../../../store/actions';
import withAuthCheck from '../../../hoc/withAuthCheck';
import { useDispatch } from 'react-redux';
import {
  Redirect,
  useParams,
  useRouteMatch,
  Route,
  Switch
} from 'react-router-dom';

import PropTypes from 'prop-types';
import PlayDetails from './PlayDetails/PlayDetails';
import TabbedNavigation from '../../Navigation/TabbedNavigation/TabbedNavigation';
import TabbedNavigationItem from '../../Navigation/TabbedNavigation/TabbedNavigationItem/TabbedNavigationItem';
import MapDetails from './MapDetails/MapDetails';

const PlayEncounter = props => {
  const dispatch = useDispatch();
  const { encounterId } = useParams();
  let { path, url } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.getEncounterById(encounterId));

    return () => {
      dispatch(actions.resetEditedEncounter());
    };
  }, [dispatch, encounterId]);

  return (
    <>
      <TabbedNavigation>
        <TabbedNavigationItem link={`${url}/details`}>
          Details
        </TabbedNavigationItem>
        <TabbedNavigationItem link={`${url}/map`}>Map</TabbedNavigationItem>
      </TabbedNavigation>

      <Switch>
        <Route exact path={path}>
          <Redirect to={`${url}/details`} />
        </Route>
        <Route path={`${path}/details`}>
          <PlayDetails />
        </Route>
        <Route path={`${path}/map`}>
          <MapDetails />
        </Route>
        <Route path="*">
          <Redirect to="/404" />
        </Route>
      </Switch>
    </>
  );
};

PlayEncounter.propTypes = {};

export default withAuthCheck(PlayEncounter);
