const prodConstants = {
  refreshDataTimeout: 4 * 60 * 60 * 1000, // 4h,
  serverUrl: "https://initiative-react.herokuapp.com"
};

const devConstants = {
  refreshDataTimeout: 4 * 60 * 60 * 1000, // 4h,
  serverUrl: "${constants.serverUrl}"
};

const constants = process.env.NODE_ENV === 'production' ? prodConstants : devConstants;

export default constants;