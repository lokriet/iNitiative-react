module.exports.generateIdentificator = () => {
  const result = (Date.now() + Math.floor(Math.random() * 8000000000)).toString(36);
  return result;
};