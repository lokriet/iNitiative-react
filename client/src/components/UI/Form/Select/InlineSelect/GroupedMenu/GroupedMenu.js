import React, { useState, useCallback } from 'react';

import { components } from 'react-select';
import classes from './GroupedMenu.module.css';
import GroupButton from './GroupButton/GroupButton';

const GroupedMenu = props => {
  const [selectedGroups, setSelectedGroups] = useState(
    props.options.map(item => item.label)
  );

  const switchGroupSelectedHandler = useCallback(
    (groupName) => {
      const index = selectedGroups.findIndex(item => item === groupName);
      if (index < 0) {
        setSelectedGroups([...selectedGroups, groupName]);
      } else {
        setSelectedGroups(selectedGroups.filter(item => item !== groupName));
      }
    },
    [selectedGroups]
  );

  const selectAllGroupsHandler = useCallback(() => {
    setSelectedGroups(props.options.map(item => item.label));
  }, [props.options]);

  const selectNoGroupsHandler = useCallback(() => {
    setSelectedGroups([]);
  }, []);


  const childrenCount= React.Children.count(props.children);
  const children = React.Children.map(props.children, child => {
    return child.props.data && selectedGroups.includes(child.props.data.label) ? child : null
  });
  const groupsFilter = (<details className={classes.GroupedMenu}>
    <summary>Filter groups</summary>
    <div>
      <button
        type="button"
        onClick={selectAllGroupsHandler}
        className={classes.MenuButton}
      >
        All
      </button>
      <button
        type="button"
        onClick={selectNoGroupsHandler}
        className={classes.MenuButton}
      >
        None
      </button>
      <br />
      {props.options.map(group => (
        <GroupButton
          key={group.label}
          name={group.label}
          selected={selectedGroups.includes(group.label)}
          onGroupSelectionSwitched={switchGroupSelectedHandler}
        />
      ))}
    </div>
  </details>);
  return (
    <components.MenuList {...props} >
      {childrenCount > 1 ? groupsFilter : null}
      {children}
    </components.MenuList>
  );
};

export default GroupedMenu;