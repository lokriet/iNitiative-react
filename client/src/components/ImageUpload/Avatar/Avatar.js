import React, { useState, useCallback } from 'react';
import ImageUpload from '../ImageUpload';
import defaultMonsterImg from '../../../assets/images/bat.svg';
import defaultPlayerImg from '../../../assets/images/hero.svg';
import classes from './Avatar.module.css';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ParticipantType } from '../../ParticipantTemplates/store/participantTemplateModel';

const Avatar = ({
  field, // { name, value, onChange, onBlur }
  form,
  ...props
}) => {
  const [avatarUrl, setAvatarUrl] = useState(field.value);
  const isMonster = form.values.type === ParticipantType.Monster;
  const onAvatarChanged = props.onAvatarChanged || (() => {});
  const setFieldValue = form.setFieldValue;

  const avatarUploadedHandler = useCallback(url => {
    setAvatarUrl(url);
    
    onAvatarChanged(url);
    setFieldValue(field.name, url);
  }, [field.name, setFieldValue, onAvatarChanged]);

  const avatarDeletedHandler = () => {
    setAvatarUrl('');
    onAvatarChanged('');
    form.setFieldValue(field.name, '');
  };

  const imgSrc =
    avatarUrl == null || avatarUrl === '' ?  (isMonster ? defaultMonsterImg : defaultPlayerImg) : avatarUrl;
  return (
    <div>
      <ImageUpload
        buttonClassName={classes.Avatar}
        maxWidth={150}
        maxHeight={150}
        onUploadFinished={avatarUploadedHandler}
      >
        <img src={imgSrc} className={classes.AvatarImg} alt="avatar" />
      </ImageUpload>
      {avatarUrl != null && avatarUrl !== '' ? (
        <div>
          <IconButton type="button" onClick={avatarDeletedHandler} icon={faTimes}>
            Delete avatar
          </IconButton>
        </div>
      ) : null}
    </div>
  );
};

export default Avatar;
