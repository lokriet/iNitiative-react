const prodConstants = {
  refreshDataTimeout: 4 * 60 * 60 * 1000, // 4h
};

const devConstants = {
  refreshDataTimeout: 4 * 60 * 60 * 1000, // 4h
  noAvatarImgUrl: ''
};

const constants = process.env.NODE_ENV === 'production' ? prodConstants : devConstants;

export default constants;