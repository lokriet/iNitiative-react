import React, { useState } from 'react';
import ImageUpload from '../ImageUpload';
import defaultMonsterImg from '../../../assets/images/bat.svg';
import defaultPlayerImg from '../../../assets/images/hero.svg';
import classes from './Avatar.module.css';
import { ParticipantType } from '../../ParticipantTemplates/ParticipantTemplates';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Avatar = ({
  field, // { name, value, onChange, onBlur }
  form,
  ...props
}) => {
  const [avatarUrl, setAvatarUrl] = useState(field.value);
  const isMonster = form.values.type === ParticipantType.Monster;
  const onAvatarChanged = props.onAvatarChanged || (() => {});

  const avatarUploadedHandler = url => {
    setAvatarUrl(url);
    
    onAvatarChanged(url);
    form.setFieldValue(field.name, url);
  };

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
