/**
 * Validates a string if it's in email format.
 * @param {String} email
 * @return Boolean
 */
const ValidateEmail = (email) => {
  const reg = /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  if (reg.test(email) === false) { // if invalid email format
    return false;
  }
  return true;
};

export default ValidateEmail;
