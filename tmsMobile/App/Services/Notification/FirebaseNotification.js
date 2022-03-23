import { Platform, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import moment from 'moment';

/**
 *
 * @param {Object} siteData
 *
 *  siteData.start_time = KYT start time
 *  siteData.weekdays = KYT week day schedules
 *
 *  Set Notification Schedule 5 minutes before the start time
 *  Set Notification Schedule on start time
 */
export function setReminder(siteData) {
  const format = 'h:m:ss';
  // get 5 minutes before the start time
  const difference = moment(siteData.start_time, format).diff(moment('00:05:00', format));
  const result = moment.duration(difference);
  const concatResult = `${result.hours()}:${result.minutes()}:${result.seconds()}`;

  const beforeStartTime = moment(concatResult, format).format('LT'); // 5 minutes before start time
  const onStartTime = moment(siteData.start_time, format).format('LT'); // start time
  const weekDays = siteData.weekdays;

  for (let i = 0; i < weekDays.length; i += 1) {
    for (let x = 0; x < 7; x += 1) {
      const date = moment().add(x, 'days').format('MMMM D YYYY');
      const day = moment().add(x, 'days').format('dddd'); // extract the week day ex: Wednesday
      if (weekDays[i] === day.toLowerCase()) {
        const notificationBody = `${siteData.name} Schedule Today at ${onStartTime}`;
        // set schedule 5 minutes before the start time
        let dateAndTime = `${day} ${date} ${beforeStartTime}`;
        let unix = moment(new Date(dateAndTime)).format('x');
        scheduleNotification(notificationBody, unix); // set reminder
        dateAndTime = '';

        // set schedule on start time
        dateAndTime = `${day} ${date} ${onStartTime}`;
        unix = moment(new Date(dateAndTime)).format('x');
        scheduleNotification(notificationBody, unix); // set reminder
      }
    }
  }
}

export function createNotificationChannel() {
  // Build a android notification channel
  const channel = new firebase.notifications.Android.Channel(
    'reminder', // channelId
    'Reminders Channel', // channel name
    firebase.notifications.Android.Importance.High // channel importance
  ).setDescription('Used for getting reminder notification'); // channel description
  // Create the android notification channel
  firebase.notifications().android.createChannel(channel);
}

export async function checkPermission() {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
    // We've the permission
    this.notificationListener = firebase
      .notifications()
      .onNotification(async (notification) => {
        // Display your notification
        await firebase.notifications().displayNotification(notification);
      });
  } else {
    // user doesn't have permission
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      Alert.alert(
        'Unable to access the Notification permission. Please enable the Notification Permission from the settings'
      );
    }
  }
}

function scheduleNotification(body, date) {
  firebase.notifications().scheduleNotification(buildNotification(body), {
    fireDate: parseInt(date, 10),
    repeatInterval: 'week',
    exact: true,
  });
}

function buildNotification(body) {
  const title = Platform.OS === 'android' ? 'Daily Reminder' : '';
  const notification = new firebase.notifications.Notification()
    .setNotificationId((1 + Math.random() * 100).toString()) // Any random ID
    .setTitle(title) // Title of the notification
    .setBody(body) // body of notification
    .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
    .android.setChannelId('reminder') // should be the same when creating channel for Android
    .android.setAutoCancel(true); // To remove notification when tapped on it
  return notification;
}
