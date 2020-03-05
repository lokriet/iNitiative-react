import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classes from './FilterInput.module.css';

import useDebounce from '../../../hooks/useDebounce';

const FilterInput = ({ allItems, onItemsFiltered, searchField }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterItems = useCallback(
    debouncedSearchTerm => {
      const results = allItems.filter(item =>
        item[(searchField || 'name')]
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
      onItemsFiltered(results);
      setIsFiltering(false);
    },
    [allItems, searchField, onItemsFiltered]
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsFiltering(true);
      filterItems(debouncedSearchTerm);
    } else {
      onItemsFiltered(allItems);
    }
  }, [debouncedSearchTerm, allItems, onItemsFiltered, filterItems]);

  return (
    <div className={classes.FilterInput}>
      {isFiltering ? (
        <FontAwesomeIcon className={classes.Icon} icon={faSpinner} spin />
      ) : (
        <FontAwesomeIcon className={classes.Icon} icon={faSearch} />
      )}

      <input
        type="text"
        onChange={event => setSearchTerm(event.target.value)}
      />
    </div>
  );
};

FilterInput.propTypes = {
  allItems: PropTypes.array.isRequired,
  searchField: PropTypes.string,
  onItemsFiltered: PropTypes.func.isRequired
};

export default FilterInput;
