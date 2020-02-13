import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classes from './FilterInput.module.css';

import useDebounce from '../../../hooks/useDebounce';

const FilterInput = ({allItems, onItemsFiltered, searchField}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterItems = useCallback(debouncedSearchTerm => {
    const results = allItems.filter(item =>
      item[searchField]
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );

    onItemsFiltered(results);
  }, [allItems, searchField, onItemsFiltered]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);

      filterItems(debouncedSearchTerm);
      setIsSearching(false);
    } else {
      onItemsFiltered(allItems);
    }
  }, [debouncedSearchTerm, allItems, onItemsFiltered , filterItems]);

  return (
    <div className={classes.FilterInput}>
      <FontAwesomeIcon
        className={classes.Icon}
        icon={isSearching ? faSpinner : faSearch}
        spin={isSearching}
      />
      <input type="text"
        onChange={event => setSearchTerm(event.target.value)} />
    </div>
  );
};

FilterInput.propTypes = {
  allItems: PropTypes.array,
  searchField: PropTypes.string,
  onItemsFiltered: PropTypes.func
};

export default FilterInput;
