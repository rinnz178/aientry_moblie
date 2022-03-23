/**
 * Validate the form if it has an empty field.
 * @param {Object} data forms filled up
 * @return Boolean
 */
const ValidateForm = (data) => {
  let hasEmptyField = false;
  Object.keys(data).forEach((key) => {
    if (data[key] === '' || data[key] === null) {
      hasEmptyField = true;
    }
  });
  return hasEmptyField;
};

export default ValidateForm;
