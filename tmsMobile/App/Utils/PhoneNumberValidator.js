import trans from '../Translations/Trans';

/**
 * Validate the form if it has an empty field.
 * @param {Object} data forms filled up
 * @return Boolean
 */
const validatePhoneNumber = (phoneNum) => {
  const { num1, num2, num3 } = phoneNum;
  const Phone = num1 + num2 + num3;

  let errorMessage = '';

  /* eslint-disable */
  // checks if inputted number has special characters or letters
  if (isNaN(Phone)) {
    errorMessage = trans('invalidPhoneNumber');
  } else if (Phone.length < 10 || Phone.length > 11) { // length is lesser than 10 or more than 11
    errorMessage = trans('phoneNumberLengthMustBeTenOrElevenDigits');
  } else if (num1.length === 4 && num2.length > 2) { // if XXXX-XXX or XXXX-XXXX
    errorMessage = trans('invalidPhoneNumber');
  } else if (num1.length === 3 && (num2.length !== 4 || num3.length !== 4)) { // if XXX-XXX, XXX-XX, XXX-XX
    errorMessage = trans('invalidPhoneNumber');
  }
  /* eslint-enable */

  return errorMessage;
};

export default validatePhoneNumber;
