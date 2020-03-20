import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ImageTools from '../../util/image-tools';
import { connect } from 'react-redux';
import Error from '../UI/Errors/Error/Error';
import classes from './ImageUpload.module.css';
import ItemsRow from '../UI/ItemsRow/ItemsRow';
import Popup from 'reactjs-popup';

const ImageUpload = ({
  buttonClassName,
  maxWidth,
  maxHeight,
  maxFileSize, //kb,
  showFileName,
  onUploadFailed,
  onUploadFinished,
  firebase,
  children
}) => {
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [fileName, setFileName] = useState(null);

  const uploadFailedHandler = onUploadFailed || (() => {});

  const startUploadImageHandler = useCallback(
    event => {
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
            const uploadTask = firebase.doUploadImage(blob, file.name);
            setIsUploading(true);
            setStatusMessage('Uploading...');
            setErrorMessage(null);

            uploadTask.on(
              'state_changed',
              snapshot => {
                setProgress(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // switch (snapshot.state) {
                //   case 'paused':
                //     setStatusMessage('Upload is paused');
                //     break;
                //   case 'running':
                //     setStatusMessage('Uploading...');
                //     break;
                //   default:
                // do nothing
                // }
              },

              error => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                  case 'storage/unauthenticated':
                    setErrorMessage('You are not logged in');
                    break;

                  case 'storage/unauthorized':
                    setErrorMessage('Permission denied');
                    break;

                  case 'storage/canceled':
                    setErrorMessage('Upload cancelled');
                    break;

                  case 'storage/unknown':
                  default:
                    setErrorMessage('Image upload failed');
                }
                setStatusMessage(null);
                setIsUploading(false);
                setProgress(null);
                uploadFailedHandler();
              },

              () => {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then(function(downloadURL) {
                    setIsUploading(false);
                    setStatusMessage(null);
                    setErrorMessage(null);
                    setProgress(null);
                    setFileName(file.name);
                    onUploadFinished(downloadURL, newSize);
                  });
              }
            );
          }
        );
      } catch (error) {
        console.log(error);
        setErrorMessage('Image upload failed');
        setStatusMessage(null);
        setIsUploading(false);
        setProgress(null);
        uploadFailedHandler();
      }
    },
    [
      firebase,
      maxHeight,
      maxWidth,
      maxFileSize,
      onUploadFinished,
      uploadFailedHandler
    ]
  );

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
            contentStyle={{width: 'auto'}}
            offsetY={10}
            trigger={<span className={classes.FileName}> {fileName}</span>}
          >
            <div>{fileName}</div>
          </Popup>
        ) : null}
      </ItemsRow>
      {statusMessage || errorMessage || isUploading ? (
        <div className={classes.Details}>
          {statusMessage ? <div>{statusMessage}</div> : null}
          {errorMessage ? <Error>{errorMessage}</Error> : null}
          {isUploading ? <progress value={progress} max="100" /> : null}
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

const mapStateToProps = state => {
  return {
    firebase: state.auth.firebase
  };
};

export default connect(mapStateToProps)(ImageUpload);
