import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classes from './TemplatesPickList.module.css';
import FilterInput from '../../../UI/FilterInput/FilterInput';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import { faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TemplateDetailsPopup from './TemplateDetailsPopup/TemplateDetailsPopup';

const TemplatesPickList = props => {
  const [filteredTemplates, setFilteredTemplates] = useState(props.templates);

  const handleItemsFiltered = useCallback(filteredItems => {
    setFilteredTemplates(filteredItems);
  }, []);

  return (
    <>
      {props.templates ? (
        <FilterInput
          allItems={props.templates}
          onItemsFiltered={handleItemsFiltered}
        />
      ) : null}

      {filteredTemplates && filteredTemplates.length > 0 ? (
        filteredTemplates.map(template => (
          <ItemsRow className={classes.TemplateRow} key={template._id}>
            <div className={classes.AvatarContainer}>
              {template.avatarUrl ? (
                <img
                  className={classes.Avatar}
                  src={template.avatarUrl}
                  alt={template.name}
                />
              ) : null}
            </div>
            <div className={classes.Name}>{template.name}</div>
            <ItemsRow className={classes.Buttons}>
              <Popup on="hover" position="right top" trigger={open => <IconButton icon={faInfoCircle} />} contentStyle={{width: "auto"}}>
                <TemplateDetailsPopup template={template} />
              </Popup>

              <IconButton
                icon={faPlus}
                type="button"
                onClick={() => props.onAdd(template._id)}
              >
                Add
              </IconButton>
            </ItemsRow>
          </ItemsRow>
        ))
      ) : (
        <div>No templates found</div>
      )}
    </>
  );
};

TemplatesPickList.propTypes = {
  templates: PropTypes.array,
  onAdd: PropTypes.func.isRequired
};

export default TemplatesPickList;
