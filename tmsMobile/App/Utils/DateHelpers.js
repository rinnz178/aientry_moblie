import moment from 'moment';

/**
 * this function receives 'YYYY-MM-DD HH:mm:ss' date format and then
 * will extract the time.
 */
export function getTime(time) {
  return time !== null && moment(time).format('h:mm:ss A');
}

/**
 * this function will return the difference between Time In and Time Out.
 *
 * Note: Function will return null if Time Out is null.
 */
export function getTimeDifference(timeIn, timeOut) {
  if (timeIn !== null && timeOut !== null) {
    const format = 'YYYY/MM/DD HH:mm:ss a';
    const difference = moment(timeOut, format).diff(moment(timeIn, format));
    const result = moment.duration(difference);

    return moment.utc(result.as('milliseconds')).format('HH:mm');
  }
  return null;
}

/**
 * this function will convert 24hr format time to 12hr format.
 */
export function toTwelveHourFormat(time) {
  return time !== null && moment(time, 'hh:mm:ss').format('h:mm:ss A');
}

/**
 * this function will return a date format using slash as separator
 * between month, day and year.
 */
export function formatDate(date) {
  return date !== null && moment(date).format('L h:mm A');
}
