import moment from 'moment';
import trans from '../Translations/Trans';
import { getTime, toTwelveHourFormat } from './DateHelpers';
/**
 * Evaluates the attendance. Will return
 * 'Late', 'No Time In' and 'No Time Out'
 *
 * @param {Object} time
 * @return {String} remarks
 */
const getAttendanceRemarks = (time) => {
  /* eslint-disable */
  const {
    date_time_in, date_time_out, schedule_start_time,
  } = time;
  const timeIn = getTime(date_time_in);
  const schedStartTime = toTwelveHourFormat(schedule_start_time);
  let remarks = '-';

  const timeFormat = 'h:mm:ss A';
  // late
  if (moment(timeIn, timeFormat).isAfter(moment(schedStartTime, timeFormat), 'seconds')) {
    remarks = trans('late');
  }
  // no time in
  if (date_time_in === '' && date_time_out !== '') {
    remarks = trans('noTimeIn');
  }
  // no time out
  if (date_time_in !== '' && date_time_out === '') {
    remarks = trans('noTimeOut');
  }
  return remarks;
  /* eslint-enable */
};

export default getAttendanceRemarks;
