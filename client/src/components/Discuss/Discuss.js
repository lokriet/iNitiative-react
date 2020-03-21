import React from 'react';
import Disqus from 'disqus-react';
import classes from './Discuss.module.css';
import withAuthCheck from '../../hoc/withAuthCheck';

const Discuss = props => {
  return (
    <div className={classes.Container}>
      <h1>Tell us what you think!</h1>
      <Disqus.DiscussionEmbed shortname="initiative-1" config={{title: 'Meow!'}} />
    </div>
  );
};

export default withAuthCheck(Discuss);
