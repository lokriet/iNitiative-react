export const isEmpty = (string) => string == null || string === '';

export const generateInitiative = () => Math.ceil(Math.random() * 20);

export const formatDate = date => {
  const dateObject = new Date(date);
  return `${dateObject.getDate()}.${dateObject.getMonth() + 1}.${dateObject.getFullYear()}`;
};

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);