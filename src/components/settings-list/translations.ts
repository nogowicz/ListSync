import { IntlShape } from 'react-intl';

export const getTranslation = (
  intl: IntlShape,
  id: string,
  defaultMessage: string,
) => {
  return intl.formatMessage({
    id,
    defaultMessage,
  });
};

export const languageTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.profile.language',
    'Language',
  );
};

export const themeTranslation = (intl: IntlShape) => {
  return getTranslation(intl, 'views.authenticated.profile.theme', 'Theme');
};

export const favoriteListTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.profile.favorite-list',
    'Favorite List',
  );
};

export const notificationSoundTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.profile.notification-sound',
    'Notification sound',
  );
};

export const tagsTranslation = (intl: IntlShape) => {
  return getTranslation(intl, 'views.authenticated.profile.tags', 'Tags');
};

export const completedTasksTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.profile.completed-tasks',
    'Completed tasks',
  );
};

export const logoutTranslation = (intl: IntlShape) => {
  return getTranslation(intl, 'views.authenticated.profile.logout', 'Logout');
};

export const aboutAppTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.profile.about-app',
    'About app',
  );
};

export const preferencesTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.profile.preferences',
    'Preferences',
  );
};

export const tasksTranslation = (intl: IntlShape) => {
  return getTranslation(intl, 'views.authenticated.profile.tasks', 'Tasks');
};

export const listSyncTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.profile.list-sync',
    'ListSync',
  );
};
