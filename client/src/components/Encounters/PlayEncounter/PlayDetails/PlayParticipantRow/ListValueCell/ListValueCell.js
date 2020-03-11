import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

import Popup from 'reactjs-popup';
import ItemsRow from '../../../../../UI/ItemsRow/ItemsRow';
import InlineSelect from '../../../../../UI/Form/Select/InlineSelect/InlineSelect';

import classes from './ListValueCell.module.css';
import Button from '../../../../../UI/Form/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItem from './ListItem/ListItem';

const ListValueCell = ({
  itemsList,
  options,
  isOptionsListGrouped,
  isImmunitiesList,
  onValuesChanged
}) => {
  const [items, setItems] = useState(
    isImmunitiesList ? { damageTypes: [], conditions: [] } : []
  );
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownSelectedItems, setDropdownSelectedItems] = useState([]);

  useEffect(() => {
    let newItems;
    if (isImmunitiesList) {
      newItems = {
        damageTypes: itemsList.damageTypes.sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
        conditions: itemsList.conditions.sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      };
    } else {
      newItems = itemsList.sort((a, b) => a.name.localeCompare(b.name));
    }
    setItems(newItems);
  }, [isImmunitiesList, itemsList]);

  useEffect(() => {
    let newDropdownOptions;
    if (isImmunitiesList && options.length > 0) {
      newDropdownOptions = [
        {
          ...options[0],
          options: options[0].options.filter(
            dropdownOption =>
              !items.damageTypes.some(item => item._id === dropdownOption._id)
          )
        },
        {
          ...options[1],
          options: options[1].options.filter(
            dropdownOption =>
              !items.conditions.some(item => item._id === dropdownOption._id)
          )
        }
      ];
    } else {
      newDropdownOptions = options.filter(
        dropdownOption => !items.some(item => item._id === dropdownOption._id)
      );
    }
    setDropdownOptions(newDropdownOptions);
  }, [items, options, isImmunitiesList]);

  const handleCancelAddingItems = useCallback(close => {
    setDropdownSelectedItems([]);
    close();
  }, []);

  const handleAddItems = useCallback(
    close => {
      setItems(prevItems => {
        let newItems;
        if (isImmunitiesList) {
          let damageTypes = [];
          let conditions = [];
          dropdownSelectedItems.forEach(selectedOption => {
            if (
              options[0].options.some(
                option => option._id === selectedOption._id
              )
            ) {
              damageTypes.push(selectedOption);
            } else {
              conditions.push(selectedOption);
            }
          });
          newItems = {
            damageTypes: prevItems.damageTypes
              .concat(damageTypes)
              .sort((a, b) => a.name.localeCompare(b.name)),
            conditions: prevItems.conditions
              .concat(conditions)
              .sort((a, b) => a.name.localeCompare(b.name))
          };
        } else {
          newItems = prevItems
            .concat(dropdownSelectedItems)
            .sort((a, b) => a.name.localeCompare(b.name));
        }

        onValuesChanged(newItems);
        return newItems;
      });
      setDropdownSelectedItems([]);
      close();
    },
    [dropdownSelectedItems, onValuesChanged, isImmunitiesList, options]
  );

  const handleDeleteItem = useCallback(
    deletedItem => {
      setItems(prevItems => {
        let newItems;

        if (isImmunitiesList) {
          newItems = {
            damageTypes: prevItems.damageTypes.filter(
              item => item._id.toString() !== deletedItem._id.toString()
            ),
            conditions: prevItems.conditions.filter(
              item => item._id.toString() !== deletedItem._id.toString()
            )
          };
        } else {
          newItems = prevItems.filter(
            item => item._id.toString() !== deletedItem._id.toString()
          );
        }
        onValuesChanged(newItems);
        return newItems;
      });
    },
    [onValuesChanged, isImmunitiesList]
  );

  return (
    <div className={classes.List}>
      {isImmunitiesList ? (
        <>
          {items.damageTypes.map(item => (
            <ListItem item={item} onDelete={handleDeleteItem} key={item._id} />
          ))}
          {items.damageTypes.length > 0 && items.conditions.length > 0 ? <div>—</div> : null}
          {items.conditions.map(item => (
            <ListItem item={item} onDelete={handleDeleteItem} key={item._id} />
          ))}
        </>
      ) : (
        items.map(item => (
          <ListItem item={item} onDelete={handleDeleteItem} key={item._id} />
        ))
      )}
      <Popup
        trigger={open => (
          <div>
            <button className={`${classes.HidingButton} ${classes.AddButton}`}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        )}
        contentStyle={{ width: 'auto' }}
        closeOnEscape={false}
        closeOnDocumentClick={false}
      >
        {close => (
          <div className={classes.Popup}>
            <div>
              <InlineSelect
                className={classes.Dropdown}
                options={dropdownOptions}
                isMulti={true}
                isGrouped={isOptionsListGrouped}
                value={dropdownSelectedItems}
                onChange={items => setDropdownSelectedItems(items)}
              />
            </div>
            <ItemsRow>
              <Button onClick={() => handleAddItems(close)}>Ok</Button>
              <Button onClick={() => handleCancelAddingItems(close)}>
                Cancel
              </Button>
            </ItemsRow>
          </div>
        )}
      </Popup>
    </div>
  );
};

ListValueCell.propTypes = {
  itemsList: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  isOptionsListGrouped: PropTypes.bool,
  onValuesChanged: PropTypes.func.isRequired
};

export default ListValueCell;
