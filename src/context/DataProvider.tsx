import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ListType, SubtaskType, TaskType } from 'data/types';
import { deleteCompletedTasksInDatabase, addSubtaskToDatabase, deleteSubtaskFromDatabase, updateSubtaskInDatabase } from 'utils/database';
import { useAuth } from './AuthContext';
import { API_URL } from '@env';
import Snackbar from 'react-native-snackbar';
import { useIntl } from 'react-intl';
import { useTheme } from 'navigation/utils/ThemeProvider';

type DataContextType = {
  listData: ListType[];
  updateListData: (callback: (prevListData: ListType[]) => ListType[]) => void;
  createList: () => Promise<any | ListType>;
  deleteList: (idList: number) => Promise<void>;
  updateList: (
    idList: number,
    listName?: string,
    iconId?: number,
    colorVariant?: number,
    canBeDeleted?: boolean,
    isShared?: boolean,
    isFavorite?: boolean,
    isArchived?: boolean,
  ) => Promise<void>;
  deleteCompletedTasks: (idList?: number) => Promise<void>;
  addTask: (newTask: TaskType, idList?: number) => Promise<number | undefined>;
  deleteTask: (idTask: number, idList: number) => Promise<void>;
  updateTask: (updatedTask: TaskType) => Promise<void>;
  completeTask: (updatedTask: TaskType) => Promise<void>;
  addSubtask: (
    newSubtask: SubtaskType,
    idTask: number,
    idList: number,
  ) => Promise<number | undefined>;
  deleteSubtask: (
    idSubtask: number,
    idTask: number,
    idList: number,
  ) => Promise<void>;
  completeSubtask: (updatedSubtask: SubtaskType) => Promise<void>;
};

const DataContext = createContext<DataContextType>({
  listData: [],
  updateListData: () => { },
  createList: async () => { },
  deleteList: async () => { },
  updateList: async () => { },
  deleteCompletedTasks: async () => { },
  addTask: async () => {
    return -1;

  },
  deleteTask: async () => { },
  completeTask: async () => { },
  updateTask: async () => { },
  addSubtask: async () => {
    return -1;
  },
  deleteSubtask: async () => { },
  completeSubtask: async () => { },
});

type DataProviderProps = {
  children: ReactNode;
}


export function useListContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useListContext must be used within a ListProvider');
  }
  return context;
}

export function DataProvider({ children }: DataProviderProps) {
  const [listData, setListData] = useState<ListType[]>([]);
  const { user } = useAuth();
  const intl = useIntl();
  const theme = useTheme();

  //translations:
  const successMessageTranslation = intl.formatMessage({
    id: "views.authenticated.snackbar.fetch-list-success-info",
    defaultMessage: "Your lists has been fetched successfully"
  });
  const errorMessageTranslation = intl.formatMessage({
    id: "views.authenticated.snackbar.fetch-list-error-info",
    defaultMessage: "Error occurred while fetching data"
  });
  const retryTranslation = intl.formatMessage({
    id: "views.authenticated.snackbar.retry",
    defaultMessage: "Retry"
  });
  const creatingListError = intl.formatMessage({
    id: "views.authenticated.snackbar.creating-list-error",
    defaultMessage: "Error occurred while creating list"
  });
  const deletingListError = intl.formatMessage({
    id: "views.authenticated.snackbar.deleting-list-error",
    defaultMessage: "Error occurred while deleting list"
  });
  const updatingListError = intl.formatMessage({
    id: "views.authenticated.snackbar.updating-list-error",
    defaultMessage: "Error occurred while updating list"
  });
  const addingTaskError = intl.formatMessage({
    id: "views.authenticated.snackbar.adding-task-error",
    defaultMessage: "Error occurred while adding new task"
  });



  useEffect(() => {
    async function fetchUserLists() {
      try {
        if (user?.id) {
          // Send an HTTP request to fetch all lists for the user
          const response = await fetch(`${API_URL}/get_all_lists?userId=${user.id}`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "accept": "text/plain"
            },
          });

          // Get the JSON response data
          const responseData = await response.json();

          // Check if the response is not OK
          if (!response.ok) {
            console.log(responseData);

            // Show a Snackbar message with an error and retry action
            Snackbar.show({
              text: errorMessageTranslation,
              duration: Snackbar.LENGTH_LONG,
              action: {
                text: retryTranslation,
                textColor: theme.PRIMARY,
                onPress: () => fetchUserLists() // Retry the function on action press
              }
            });
          } else {
            // Show a Snackbar message for a successful response
            Snackbar.show({
              text: successMessageTranslation,
              duration: Snackbar.LENGTH_SHORT,
            });
          }

          // Set the list data to the retrieved data
          setListData(responseData);
        }
      } catch (error: any) {
        console.log(error);

        // Show a Snackbar message with an error and retry action
        Snackbar.show({
          text: errorMessageTranslation,
          duration: Snackbar.LENGTH_LONG,
          action: {
            text: retryTranslation,
            textColor: theme.PRIMARY,
            onPress: () => fetchUserLists() // Retry the function on action press
          }
        });
      }
    }

    fetchUserLists();
  }, [user?.id]);

  const updateListData = (callback: (prevListData: ListType[]) => ListType[]) => {
    setListData(prevListData => callback(prevListData));
  };


  const value: DataContextType = {
    listData,
    updateListData,
    createList: async (): Promise<number | undefined> => {
      try {
        if (user) {
          // Creating a new list with default values
          const newList: ListType = {
            idList: -1,
            listName: 'Unnamed list',
            iconId: 0,
            canBeDeleted: true,
            isShared: false,
            createdAt: new Date().toISOString(),
            isFavorite: false,
            isArchived: false,
            createdBy: user.id,
            colorVariant: 0,
            tasks: [],
          };

          // Sending an HTTP request to add a new list
          const response = await fetch(`${API_URL}/add_list`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              accept: 'text/plain',
            },
            body: JSON.stringify({
              listName: newList.listName,
              iconId: newList.iconId,
              isShared: newList.isShared,
              colorVariant: newList.colorVariant,
              createdBy: newList.createdBy,
            }),
          });

          // Getting the response from the server
          const responseData = await response.text();

          // Displaying a warning if the response is not OK
          if (!response.ok) {
            console.log(responseData);
            Snackbar.show({
              text: creatingListError,
              duration: Snackbar.LENGTH_SHORT,
            });
          }

          // Updating the list's ID with the data from the server
          newList.idList = Number(responseData);

          // Updating the list data in the local temporary storage
          updateListData((prevListData) => [...prevListData, newList]);

          // Returning the ID of the newly created list
          return newList.idList;
        }
      } catch (error: any) {
        console.log("Error occurred while adding list to db:", error);
        Snackbar.show({
          text: creatingListError,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    deleteList: async (idList: number): Promise<void> => {
      try {
        // Filtering the list data
        const updatedNewListData: ListType[] = listData.filter(
          (list) => list.idList !== idList || !list.canBeDeleted
        );

        // Sending an HTTP request to remove the list by its ID
        const response = await fetch(`${API_URL}/remove_list?IdList=${idList}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'text/plain',
          },
        });

        // Getting the response from the server
        const responseData = await response.text();

        // Checking if the response is not OK and displaying a warning
        if (!response.ok) {
          console.log(responseData);
          Snackbar.show({
            text: deletingListError,
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          // Updating the list data in the application
          updateListData(() => updatedNewListData);
          console.log(responseData);
        }
      } catch (error) {
        console.log('Error occurred while deleting list from the database:', error);
        Snackbar.show({
          text: deletingListError,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    updateList: async (
      idList: number,
      listName?: string,
      iconId?: number,
      colorVariant?: number,
      canBeDeleted?: boolean,
      isShared?: boolean,
      isFavorite?: boolean,
      isArchived?: boolean,
    ): Promise<void> => {
      try {
        // Map and update the list data
        const updatedListData = listData.map((list) => {
          if (list.idList === idList) {
            return {
              ...list,
              listName: listName ?? list.listName,
              iconId: iconId ?? list.iconId,
              colorVariant: colorVariant ?? list.colorVariant,
              canBeDeleted: canBeDeleted ?? list.canBeDeleted,
              isShared: isShared ?? list.isShared,
              isFavorite: isFavorite ?? list.isFavorite,
              isArchived: isArchived ?? list.isArchived,
            };
          }
          return list;
        });

        // Update the list data in the application
        updateListData(() => updatedListData);

        // Find the updated list by ID
        const updatedList: ListType | undefined = updatedListData.find((list) => idList === list.idList);

        if (updatedList) {
          const response = await fetch(`${API_URL}/change_in_list`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "accept": "text/plain"
            },
            body: JSON.stringify({
              "id": idList,
              "listName": listName ?? updatedList.listName,
              "iconId": iconId ?? updatedList.iconId,
              "isShared": isShared ?? updatedList.isShared,
              "isFavorite": isFavorite ?? updatedList.isFavorite,
              "isArchived": isArchived ?? updatedList.isArchived,
              "colorVariant": colorVariant ?? updatedList.colorVariant
            })
          });

          const responseData = await response.text();
          if (!response.ok) {
            console.log(responseData);
            // Show a Snackbar message for updating list error
            Snackbar.show({
              text: updatingListError,
              duration: Snackbar.LENGTH_SHORT,
            });
          } else {
            console.log(responseData);
          }
        }
      } catch (error) {
        console.log("Error occurred while updating list in db:", error);
        // Show a Snackbar message for updating list error
        Snackbar.show({
          text: updatingListError,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    //TODO:
    deleteCompletedTasks: async (idList?: number): Promise<void> => {
      const updatedListData = listData.map((list) => {
        if (list.idList === idList) {
          const updatedTasks = list.tasks.filter((task) => !task.isCompleted);
          return {
            ...list,
            tasks: updatedTasks,
          };
        }
        return list;
      });

      updateListData(() => updatedListData);
      try {
        await deleteCompletedTasksInDatabase(idList);

      } catch (error) {
        console.error("Error occurred while deleting completed tasks from db:", error);
        throw error;
      }
    },
    addTask: async (
      newTask: TaskType,
      idList?: number,
    ): Promise<number | undefined> => {
      try {
        // Send an HTTP request to add a new task
        const response = await fetch(`${API_URL}/add_task`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
          body: JSON.stringify({
            "idList": idList,
            "title": newTask.title,
            "deadline": newTask.deadline,
            "importance": newTask.importance,
            "effort": newTask.effort,
            "note": newTask.note,
            "addedBy": newTask.addedBy,
            "assignedTo": newTask.assignedTo,
            "notificationTime": newTask.notificationTime
          })
        });

        // Get the response data from the server
        const responseData = await response.text();

        // Check if the response is not OK and log a warning
        if (!response.ok) {
          console.log(responseData);
          Snackbar.show({
            text: addingTaskError,
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          console.log(responseData);
        }

        // Extract the task ID from the response data
        const taskId = responseData;

        // Check if the taskId is not null
        if (taskId !== null) {
          // Update the newTask object with the task ID
          newTask.idTask = Number(taskId);

          // Map and update the list data to include the new task
          const newListData = listData.map((list) => {
            if (list.idList === idList) {
              return {
                ...list,
                tasks: [...list.tasks, newTask],
              };
            } else if (list.idList === 1 && idList !== 1) {
              return {
                ...list,
                tasks: [...list.tasks, newTask],
              };
            } else {
              return list;
            }
          });

          // Update the list data in the application
          updateListData(() => newListData);

          // Return the task ID as a number
          return Number(taskId);
        }
      } catch (error) {
        console.log("Error occurred while adding a task to the database:", error);
        Snackbar.show({
          text: addingTaskError,
          duration: Snackbar.LENGTH_SHORT,
        });
      }

    },
    deleteTask: async (idTask: number, idList: number): Promise<void> => {
      const updatedListData = listData.map((list) => {
        if (list.idList === idList) {
          const updatedTasks = list.tasks.filter((listTask) => listTask.idTask !== idTask);
          return {
            ...list,
            tasks: updatedTasks,
          };
        }
        return list;
      });

      updateListData(() => updatedListData);
      try {
        const response = await fetch(`${API_URL}/remove_task`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
          body: JSON.stringify({
            "id": idTask,
          })
        });

        const responseData = await response.text();
        if (!response.ok) {
          console.warn(responseData);
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.error("Error occurred while deleting task from db:", error);
        throw error;
      }
    },
    completeTask: async (updatedTask: TaskType): Promise<void> => {
      const updatedIsCompleted = !updatedTask.isCompleted;
      const updatedNotificationTime = null;
      const response = await fetch(`${API_URL}/change_in_task`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "accept": "text/plain"
        },
        body: JSON.stringify({
          "idTask": updatedTask.idTask,
          "isCompleted": Number(updatedIsCompleted),
          "notificationTime": updatedNotificationTime
        })
      });

      const responseData = await response.text();
      if (!response.ok) {
        console.warn(responseData);
      } else {
        console.log(responseData);
      }

      updateListData((prevListData: ListType[]) => {
        const updatedLists = prevListData.map((list: ListType) => {
          const updatedTasks = list.tasks.map((task: TaskType) =>
            task.idTask === updatedTask.idTask ? { ...task, isCompleted: updatedIsCompleted } : task
          );

          return { ...list, tasks: updatedTasks };
        });

        return updatedLists;
      });


    },
    updateTask: async (updatedTask: TaskType): Promise<void> => {
      const response = await fetch(`${API_URL}/change_in_task`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "accept": "text/plain"
        },
        body: JSON.stringify({
          "idTask": updatedTask.idTask,
          "isCompleted": updatedTask.isCompleted,
          "title": updatedTask.title,
          "deadline": updatedTask.deadline,
          "importance": updatedTask.importance,
          "effort": updatedTask.effort,
          "note": updatedTask.note,
          "assignedTo": updatedTask.assignedTo,
          "notificationTime": updatedTask.notificationTime
        })
      });

      const responseData = await response.text();
      if (!response.ok) {
        console.warn(responseData);
      } else {
        console.log(responseData);
      }

      updateListData((prevListData: ListType[]) => {
        const updatedLists = prevListData.map((list: ListType) => {
          const updatedTasks = list.tasks.map((task: TaskType) =>
            task.idTask === updatedTask.idTask ? updatedTask : task
          );

          return { ...list, tasks: updatedTasks };
        });

        return updatedLists;
      });
    },

    addSubtask: async (
      newSubtask: SubtaskType,
      idTask: number,
      idList: number,
    ): Promise<number | undefined> => {
      try {
        const idSubtask = await addSubtaskToDatabase(
          newSubtask,
          idTask
        );
        if (idSubtask !== undefined) {
          newSubtask.idSubtask = idSubtask;

          const newListData = listData.map((list) => {
            if (list.idList === idList) {
              const updatedTasks = list.tasks.map((task) => {
                if (task.idTask === idTask) {
                  return {
                    ...task,
                    subtasks: [...task.subtasks, newSubtask],
                  };
                }
                return task;
              });

              return {
                ...list,
                tasks: updatedTasks,
              };
            }
            return list;
          });
          updateListData(() => newListData);
          return idSubtask;
        } else {
          console.error('Error adding subtask: Subtask ID is undefined.');
          return undefined;
        }
      } catch (error) {
        console.error("Error occurred while adding subtask to db:", error);
        throw error;
      }
    },
    deleteSubtask: async (idSubtask: number, idTask: number, idList: number): Promise<void> => {
      const updatedListData = listData.map((list) => {
        if (list.idList === idList) {
          const updatedTasks = list.tasks.map((task) => {
            if (task.idTask === idTask) {
              const updatedSubtasks = task.subtasks.filter((subtask) => subtask.idSubtask !== idSubtask);
              return {
                ...task,
                subtasks: updatedSubtasks,
              }
            }
            return task;
          });

          return {
            ...list,
            tasks: updatedTasks,
          };
        }
        return list;
      });

      updateListData(() => updatedListData);
      try {
        await deleteSubtaskFromDatabase(idSubtask);
      } catch (error) {
        console.error("Error occurred while deleting task from db:", error);
        throw error;
      }
    },
    completeSubtask: async (updatedSubtask: SubtaskType): Promise<void> => {
      const updatedIsCompleted = !updatedSubtask.isCompleted;
      await updateSubtaskInDatabase(
        updatedSubtask.idSubtask,
        updatedSubtask.title,
        updatedIsCompleted,
      )
      updateListData((prevListData: ListType[]) => {
        const updatedLists = prevListData.map((list: ListType) => {
          const updatedTasks = list.tasks.map((task: TaskType) => {
            const updatedSubtasks = task.subtasks.map((subtask: SubtaskType) =>
              subtask.idSubtask === updatedSubtask.idSubtask ? { ...subtask, isCompleted: updatedIsCompleted } : subtask
            );
            return { ...task, subtasks: updatedSubtasks };
          }
          );
          return { ...list, tasks: updatedTasks };

        });

        return updatedLists;
      });

    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
