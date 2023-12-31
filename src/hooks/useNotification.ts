import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
  AuthorizationStatus,
  AndroidAction,
} from '@notifee/react-native';

export const useNotification = () => {
  async function displayNotification(title: string, body: string) {
    // Create a channel required for Android Notifications
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Required for iOS
    // See https://notifee.app/react-native/docs/ios/permissions
    await notifee.requestPermission();

    // Display a notification
    const notificationId = notifee.displayNotification({
      // id: "string" | updates Notification instead if provided id already exists
      title: title,
      body: body,
      android: {
        channelId,
        /* smallIcon: "smallIcon" | defaults to 'ic_launcher', respectively your app icon. */
      },
    });
    return notificationId;
  }

  async function displayTriggerNotification(
    title: string,
    body: string,
    timestamp: number,
    taskId: number,
    action: AndroidAction,
    repeatFrequency: RepeatFrequency | undefined = undefined,
  ) {
    // Create a channel required for Android Notifications
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: timestamp, // fire at the provided date
      repeatFrequency: repeatFrequency, // repeat the notification on a hourly/daily/weekly basis
    };
    // Please note, for iOS, a repeating trigger does not work the same as Android - the initial trigger cannot be delayed
    // See https://notifee.app/react-native/docs/triggers

    // You can also use Intervall triggers
    /*
    const trigger: IntervalTrigger = {
      type: TriggerType.INTERVAL,
      interval: 30
      timeUnit: TimeUnit.MINUTES
    };
    */

    // Create a trigger notification
    const triggerNotificationId = await notifee.createTriggerNotification(
      {
        id: String(taskId),
        title: title,
        body: body,
        android: {
          channelId,
          actions: [action],
        },
        data: { taskId },
      },
      trigger, // use displayNotification to update triggerNotifications which trigger already fired
    );

    return triggerNotificationId;
  }

  // get all trigger notifications
  async function getTriggerNotificationIds() {
    const triggerNotificationIds = await notifee.getTriggerNotificationIds();
    return triggerNotificationIds;
  }

  // cancel all or specific trigger notifications
  async function cancelTriggerNotifications(
    notificationIds: string[] | undefined,
  ) {
    await notifee.cancelTriggerNotifications(notificationIds);
  }

  // cancel all notifications
  async function cancelAllNotifications(): Promise<void> {
    await notifee.cancelAllNotifications();
  }

  // cancel notification via notificationId or tag
  async function cancelNotification(
    notificationId: string,
    tag: string | undefined = undefined,
  ) {
    await notifee.cancelNotification(notificationId, tag);
  }

  // There are way more methods I didn't cover here that can help you in various scenarios
  // See https://notifee.app/react-native/reference

  async function checkNotificationPermission() {
    const settings = await notifee.getNotificationSettings();

    if (
      settings.authorizationStatus == AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus == AuthorizationStatus.PROVISIONAL
    ) {
      console.log('Notification permissions have been authorized');
    } else if (
      settings.authorizationStatus == AuthorizationStatus.DENIED ||
      settings.authorizationStatus == AuthorizationStatus.NOT_DETERMINED
    ) {
      console.log('Notification permissions have been denied');
      await notifee.requestPermission();
    }
  }

  return {
    displayNotification,
    displayTriggerNotification,
    getTriggerNotificationIds,
    cancelTriggerNotifications,
    cancelAllNotifications,
    cancelNotification,
    checkNotificationPermission,
  };
};
