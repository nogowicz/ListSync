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

export const successMessageTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.fetch-list-success-info',
    'Your lists has been fetched successfully',
  );
};
export const errorMessageTranslation = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.fetch-list-error-info',
    'Error occurred while fetching data',
  );
};

export const retryTranslation = (intl: IntlShape) => {
  return getTranslation(intl, 'views.authenticated.snackbar.retry', 'Retry');
};

export const creatingListError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.creating-list-error',
    'Error occurred while creating list',
  );
};

export const deletingListError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.deleting-list-error',
    'Error occurred while deleting list',
  );
};

export const updatingListError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.updating-list-error',
    'Error occurred while updating list',
  );
};

export const addingTaskError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.adding-task-error',
    'Error occurred while adding new task',
  );
};

export const deleteTaskError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.deleting-task-error',
    'Error occurred while deleting task',
  );
};

export const updateTaskError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.updating-task-error',
    'Error occurred while updating task',
  );
};

export const addingSubtaskError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.adding-subtask-error',
    'Error occurred while adding new subtask',
  );
};

export const deletingSubtaskError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.deleting-subtask-error',
    'Error occurred while deleting subtask',
  );
};

export const updatingSubtaskError = (intl: IntlShape) => {
  return getTranslation(
    intl,
    'views.authenticated.snackbar.updating-subtask-error',
    'Error occurred while updating subtask',
  );
};
