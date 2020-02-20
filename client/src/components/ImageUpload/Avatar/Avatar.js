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
  const [avatarUrl, setAvatarUrl] = useState(null);
  const isMonster = form.values.type === ParticipantType.Monster;

  const avatarUploadedHandler = url => {
    setAvatarUrl(url);

    form.setFieldValue(field.name, url);
  };

  const avatarDeletedHandler = () => {
    setAvatarUrl(null);
    form.setFieldValue(field.name, null);
  };

  const imgSrc =
    avatarUrl || (isMonster ? defaultMonsterImg : defaultPlayerImg);
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
      {avatarUrl ? (
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
