const JSRSASign = require("jsrsasign");
const constants = require('../constants');

const generateJWT = (claims) => {
  const header = {
    alg: 'HS512',
    typ: 'JWT'
  };

  const sHeader  = JSON.stringify(header);
  const sPayload = JSON.stringify(claims);
  const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, constants.JWT_KEY);
  return sJWT;
};

const decodeJWT = token => {
  const aJWT = token.split(".");
  // const uHeader = JSRSASign.b64utos(aJWT[0]);
  const uClaim  = JSRSASign.b64utos(aJWT[1]);
  // const pHeader = JSRSASign.jws.JWS.readSafeJSONString(uHeader);
  const pClaim  = JSRSASign.jws.JWS.readSafeJSONString(uClaim);
  return pClaim;
};

const validateJWT = (token) => {
  return JSRSASign.jws.JWS.verifyJWT(token, constants.JWT_KEY, {alg: ['HS512']});
};

module.exports = {
  generateJWT,
  decodeJWT,
  validateJWT
};