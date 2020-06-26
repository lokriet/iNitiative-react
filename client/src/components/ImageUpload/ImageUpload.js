import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageTools from './image-tools';
import { useSelector, useDispatch } from 'react-redux';
import Error from '../UI/Errors/Error/Error';
import classes from './ImageUpload.module.css';
import ItemsRow from '../UI/ItemsRow/ItemsRow';
import Popup from 'reactjs-popup';
import {firebaseUploadImage} from '../../store/firebase/firebaseMiddleware';

const ImageUpload = ({
  buttonClassName,
  maxWidth,
  maxHeight,
  maxFileSize, //kb,
  showFileName,
  onUploadFailed,
  onUploadFinished,
  children
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [newFileSize, setNewFileSize] = useState(null);
  const [waitingForResult, setWaitingForResult] = useState(false);

  const { loading, progress, error: firebaseErrorMessage, downloadUrl } = useSelector(
    (state) => state.firebase.image
  );

  const uploadFailedHandler = onUploadFailed || (() => {});

  const dispatch = useDispatch();

  const startUploadImageHandler = useCallback((event) => {
    const file = event.target.files[0];

    if (file == null) {
      return;
    }

    if (maxFileSize != null) {
      const fileSize = file.size / 1024;
      if (fileSize > maxFileSize) {
        const maxFileSizeString =
          maxFileSize > 1024
            ? (maxFileSize / 1024).toFixed(2) + 'M'
            : maxFileSize.toFixed(0) + 'K';
        setErrorMessage(`File size should be less than ${maxFileSizeString}`);
        uploadFailedHandler();
        return;
      }
    }

    try {
      ImageTools.resize(
        file,
        {
          width: maxWidth,
          height: maxHeight
        },
        (blob, didItResize, newSize) => {
          dispatch(firebaseUploadImage({filename: file.name, imageFile: blob}));
          setFileName(file.name);
          setNewFileSize(newSize);
          setWaitingForResult(true);
        });
    } catch(error) {
      setErrorMessage('Image upload failed');
      uploadFailedHandler();
    }
  }, [dispatch, maxHeight, maxWidth, maxFileSize, uploadFailedHandler]);

  useEffect(() => {
    if (downloadUrl && waitingForResult) {
      onUploadFinished(downloadUrl, newFileSize);
      console.log('call upload finished', downloadUrl);
      setWaitingForResult(false);
    }
  }, [downloadUrl, onUploadFinished, waitingForResult, newFileSize]);

  useEffect(() => {
    if (firebaseErrorMessage) {
      uploadFailedHandler();
    }
  }, [firebaseErrorMessage, uploadFailedHandler]);

  return (
    <div>
      <ItemsRow alignCentered>
        <input
          type="file"
          id="file"
          name="file"
          className={classes.HiddenInput}
          onChange={startUploadImageHandler}
        />
        <label
          htmlFor="file"
          className={buttonClassName || classes.UploadButton}
        >
          {children || 'Choose file'}
        </label>
        {showFileName && fileName && !progress ? (
          <Popup
            on="hover"
            arrow={false}
            contentStyle={{ width: 'auto' }}
            offsetY={10}
            trigger={<span className={classes.FileName}> {fileName}</span>}
          >
            <div>{fileName}</div>
          </Popup>
        ) : null}
      </ItemsRow>
      {errorMessage || firebaseErrorMessage || loading ? (
        <div className={classes.Details}>
          {loading ? <div>Uploading...</div> : null}
          {errorMessage || firebaseErrorMessage ? <Error>{errorMessage || firebaseErrorMessage}</Error> : null}
          {loading ? <progress value={progress} max="100" /> : null}
        </div>
      ) : null}
    </div>
  );
};

ImageUpload.propTypes = {
  buttonClassName: PropTypes.string,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  maxFileSize: PropTypes.number, //kb,
  onUploadFailed: PropTypes.func,
  onUploadFinished: PropTypes.func.isRequired,
  showFileName: PropTypes.bool
};

export default ImageUpload;
