import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ListType, SubtaskType, TaskType } from 'data/types';
import { useAuth } from './AuthContext';
import { API_URL } from '@env';
import Snackbar from 'react-native-snackbar';
import { useIntl } from 'react-intl';
import { useTheme } from 'navigation/utils/ThemeProvider';
import { infoTranslation } from '.';
import subTask from 'components/sub-task';

type DataContextType = {
  isLoadingData: boolean;
  listData: ListType[];
  updateListData: (callback: (prevListData: ListType[]) => ListType[]) => void;
  fetchUserLists: () => Promise<any>;
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
  deleteCompletedTasksInList: (idList: number) => Promise<void>;
  deleteCompletedTasks: (idList: number) => Promise<void>;
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
  isLoadingData: true,
  listData: [],
  updateListData: () => { },
  fetchUserLists: async () => { },
  createList: async () => { },
  deleteList: async () => { },
  updateList: async () => { },
  deleteCompletedTasksInList: async () => { },
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { user } = useAuth();
  const intl = useIntl();
  const theme = useTheme();

  async function fetchUserLists() {
    try {
      setIsLoadingData(true);
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
          setIsLoadingData(false);
          console.log(responseData);
          // Show a Snackbar message with an error and retry action
          Snackbar.show({
            text: infoTranslation.errorMessageTranslation(intl),
            duration: Snackbar.LENGTH_LONG,
            action: {
              text: infoTranslation.retryTranslation(intl),
              textColor: theme.PRIMARY,
              onPress: () => fetchUserLists() // Retry the function on action press
            }
          });
        } else {
          // Show a Snackbar message for a successful response
          Snackbar.show({
            text: infoTranslation.successMessageTranslation(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
          setIsLoadingData(false);
        }

        // Set the list data to the retrieved data
        setListData(responseData);
      }
    } catch (error: any) {
      console.log(error);
      setIsLoadingData(false);
      // Show a Snackbar message with an error and retry action
      Snackbar.show({
        text: infoTranslation.errorMessageTranslation(intl),
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: infoTranslation.retryTranslation(intl),
          textColor: theme.PRIMARY,
          onPress: () => fetchUserLists() // Retry the function on action press
        }
      });
    }
  }

  useEffect(() => {
    fetchUserLists();
  }, [user?.id]);

  const updateListData = (callback: (prevListData: ListType[]) => ListType[]) => {
    setListData(prevListData => callback(prevListData));
  };


  const value: DataContextType = {
    isLoadingData,
    listData,
    updateListData,
    fetchUserLists,
    createList: async (): Promise<number | undefined> => {
      try {
        if (user) {
          setIsLoadingData(true);
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
              text: infoTranslation.creatingListError(intl),
              duration: Snackbar.LENGTH_SHORT,
            });
          }

          // Updating the list's ID with the data from the server
          newList.idList = Number(responseData);

          // Updating the list data in the local temporary storage
          updateListData((prevListData) => [...prevListData, newList]);

          setIsLoadingData(false);
          // Returning the ID of the newly created list
          return newList.idList;
        }
      } catch (error: any) {
        console.log("Error occurred while adding list to db:", error);
        Snackbar.show({
          text: infoTranslation.creatingListError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
        setIsLoadingData(false);
      }
    },
    deleteList: async (idList: number): Promise<void> => {
      try {
        // Filtering the list data
        const updatedNewListData: ListType[] = listData.filter(
          (list) => list.idList !== idList || !list.canBeDeleted
        );

        // Sending an HTTP request to remove the list by its ID
        const response = await fetch(`${API_URL}/remove_list?idList=${idList}`, {
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
            text: infoTranslation.deletingListError(intl),
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
          text: infoTranslation.deletingListError(intl),
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
              text: infoTranslation.updatingListError(intl),
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
          text: infoTranslation.updatingListError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });

      }
    },
    deleteCompletedTasksInList: async (idList: number): Promise<void> => {
      console.log(idList)
      try {
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


        const response = await fetch(`${API_URL}/remove_completed_tasks`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
          body: JSON.stringify({
            "idList": idList
          })
        });

        const responseData = await response.text();
        if (!response.ok) {
          console.log(responseData);
          // Show a Snackbar message for updating list error
          Snackbar.show({
            text: infoTranslation.deleteTaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          updateListData(() => updatedListData);
          console.log(responseData);
        }

      } catch (error) {
        console.log("Error occurred while deleting completed tasks from db:", error);
        Snackbar.show({
          text: infoTranslation.deleteTaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    deleteCompletedTasks: async (idUser: number): Promise<void> => {
      try {
        const updatedListData = listData.map((list) => {
          const updatedTasks = list.tasks.filter((task) => !task.isCompleted);
          return {
            ...list,
            tasks: updatedTasks,
          };
        });



        const response = await fetch(`${API_URL}/remove_completed_tasks`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
          body: JSON.stringify({
            "idUser": idUser
          })
        });

        const responseData = await response.text();
        if (!response.ok) {
          console.log(responseData);
          // Show a Snackbar message for updating list error
          Snackbar.show({
            text: infoTranslation.deleteTaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          updateListData(() => updatedListData);
          console.log(responseData);
        }

      } catch (error) {
        console.log("Error occurred while deleting completed tasks from db:", error);
        Snackbar.show({
          text: infoTranslation.deleteTaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    addTask: async (newTask: TaskType, idList?: number): Promise<number | undefined> => {
      try {
        // Update local state
        if (idList !== undefined) {
          const updatedListData = listData.map((list) => {
            if (list.idList === idList || list.idList === 1) {
              return {
                ...list,
                tasks: [...list.tasks, newTask],
              };
            }
            return list;
          });

          updateListData(() => updatedListData);
        }

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

        // Check if the response is not OK
        if (!response.ok) {
          console.log(responseData);
          Snackbar.show({
            text: infoTranslation.addingTaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });

          // Delete the task from the list data if it was not added successfully
          if (idList !== undefined) {
            const revertedListData = listData.map((list) => {
              if (list.idList === idList || list.idList === 1) {
                return {
                  ...list,
                  tasks: list.tasks.filter((task) => task.idTask !== newTask.idTask),
                };
              }
              return list;
            });

            updateListData(() => revertedListData);
          }

        } else {
          console.log(responseData);
        }

        // Extract the task ID from the response data
        const taskId = responseData;

        // Check if the taskId is not null
        if (taskId !== null) {
          // Update the newTask object with the task ID
          newTask.idTask = Number(taskId);

          // Return the task ID as a number
          return Number(taskId);
        }
      } catch (error) {
        console.log("Error occurred while adding a task to the database:", error);
        Snackbar.show({
          text: infoTranslation.addingTaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });

        // Delete the task from the list data if it was not added successfully
        if (idList !== undefined) {
          const revertedListData = listData.map((list) => {
            if (list.idList === idList || list.idList === 1) {
              return {
                ...list,
                tasks: list.tasks.filter((task) => task.idTask !== newTask.idTask),
              };
            }
            return list;
          });

          updateListData(() => revertedListData);
        }
      }
    },
    deleteTask: async (idTask: number, idList: number): Promise<void> => {
      try {
        // Update local state
        const updatedListData = listData.map((list) => {
          if (list.idList === idList) {
            // Filter out the task with the specified idTask
            const updatedTasks = list.tasks.filter((listTask) => listTask.idTask !== idTask);
            return {
              ...list,
              tasks: updatedTasks,
            };
          }
          return list;
        });

        // Update the list data in the application
        updateListData(() => updatedListData);

        // Send an HTTP request to remove the task by its idTask
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

        // Get the response data from the server
        const responseData = await response.text();

        // Check if the response is not OK
        if (!response.ok) {
          console.log(responseData);

          // Revert the local state update if the server request fails
          updateListData(() => listData);

          // Show a Snackbar message for the delete task error
          Snackbar.show({
            text: infoTranslation.deleteTaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.log("Error occurred while deleting task from the database:", error);

        // Revert the local state update if an error occurs
        updateListData(() => listData);

        // Show a Snackbar message for the delete task error
        Snackbar.show({
          text: infoTranslation.deleteTaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    completeTask: async (updatedTask: TaskType): Promise<void> => {
      try {
        // Toggle the task completion status
        const updatedIsCompleted = !updatedTask.isCompleted;
        const updatedNotificationTime = null;

        // Update the list data in the application
        updateListData((prevListData: ListType[]) => {
          // Map and update the lists with the updated task completion status
          const updatedLists = prevListData.map((list: ListType) => {
            // Map and update the tasks within each list
            const updatedTasks = list.tasks.map((task: TaskType) =>
              task.idTask === updatedTask.idTask ? { ...task, isCompleted: updatedIsCompleted } : task
            );

            return { ...list, tasks: updatedTasks };
          });

          return updatedLists;
        });

        // Send an HTTP request to update the task's completion status and notification time
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

        // Get the response data from the server
        const responseData = await response.text();

        // Check if the response is not OK and log a warning
        if (!response.ok) {
          console.log(responseData);

          // Show a Snackbar message for the update task error
          Snackbar.show({
            text: infoTranslation.updateTaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          console.log(responseData);
        }


      } catch (error) {
        console.log("Error occurred while completing the task in the database:", error);

        // Show a Snackbar message for the update task error
        Snackbar.show({
          text: infoTranslation.updateTaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    updateTask: async (updatedTask: TaskType): Promise<void> => {
      try {
        // Update the list data in the application
        updateListData((prevListData: ListType[]) => {
          // Map and update the lists with the updated task
          const updatedLists = prevListData.map((list: ListType) => {
            // Map and update the tasks within each list
            const updatedTasks = list.tasks.map((task: TaskType) =>
              task.idTask === updatedTask.idTask ? updatedTask : task
            );

            return { ...list, tasks: updatedTasks };
          });

          return updatedLists;
        });
        // Send an HTTP request to update the task with new data
        const response = await fetch(`${API_URL}/change_in_task`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
          body: JSON.stringify({
            "idTask": updatedTask.idTask,
            "isCompleted": Number(updatedTask.isCompleted),
            "title": updatedTask.title,
            "deadline": updatedTask.deadline,
            "importance": updatedTask.importance,
            "effort": updatedTask.effort,
            "note": updatedTask.note,
            "assignedTo": updatedTask.assignedTo,
            "notificationTime": updatedTask.notificationTime
          })
        });

        // Get the response data from the server
        const responseData = await response.text();

        // Check if the response is not OK and log a warning
        if (!response.ok) {
          console.log(responseData);

          // Show a Snackbar message for the update task error
          Snackbar.show({
            text: infoTranslation.updateTaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.log("Error occurred while updating the task in the database:", error);

        // Show a Snackbar message for the update task error
        Snackbar.show({
          text: infoTranslation.updateTaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
      }

    },
    addSubtask: async (
      newSubtask: SubtaskType,
      idTask: number,
      idList: number,
    ): Promise<number | undefined> => {
      try {
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
        // Send an HTTP request to add a new task
        const response = await fetch(`${API_URL}/add_subtask`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
          body: JSON.stringify({
            "idTask": idTask,
            "title": newSubtask.title,
            "addedBy": newSubtask.addedBy,
          })
        });

        // Get the response data from the server
        const responseData = await response.text();

        // Check if the response is not OK
        if (!response.ok) {
          console.log(responseData);
          updateListData(() => listData);
          Snackbar.show({
            text: infoTranslation.addingSubtaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          const idSubtask = Number(responseData);
          if (idSubtask !== undefined) {
            newSubtask.idSubtask = idSubtask;
            return idSubtask;
          } else {
            console.log('Error adding subtask: Subtask ID is undefined.');
            Snackbar.show({
              text: infoTranslation.addingSubtaskError(intl),
              duration: Snackbar.LENGTH_SHORT,
            });
            return undefined;
          }
        }

      } catch (error) {
        console.log("Error occurred while adding subtask to db:", error);
        updateListData(() => listData);
        Snackbar.show({
          text: infoTranslation.addingSubtaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    deleteSubtask: async (idSubtask: number, idTask: number, idList: number): Promise<void> => {
      try {
        const updatedListData = listData.map((list) => {
          if (list.idList === idList) {
            const updatedTasks = list.tasks.map((task) => {
              if (task.idTask === idTask) {
                const updatedSubtasks = task.subtasks.filter((subtask) => subtask.idSubtask !== idSubtask);
                console.log(updatedSubtasks)
                return {
                  ...task,
                  subtasks: updatedSubtasks,
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
        updateListData(() => updatedListData);

        const response = await fetch(`${API_URL}/remove_subtask?idSubtask=${idSubtask}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
        });

        // Get the response data from the server
        const responseData = await response.text();

        // Check if the response is not OK
        if (!response.ok) {
          console.log(responseData);

          // Revert the local state update if the server request fails
          updateListData(() => listData);

          // Show a Snackbar message for the delete subtask error
          Snackbar.show({
            text: infoTranslation.deletingSubtaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.log("Error occurred while deleting subtask from the database:", error);

        // Revert the local state update if an error occurs
        updateListData(() => listData);


        // Show a Snackbar message for the delete subtask error
        Snackbar.show({
          text: infoTranslation.deletingSubtaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
    completeSubtask: async (updatedSubtask: SubtaskType): Promise<void> => {
      try {
        const updatedIsCompleted = !updatedSubtask.isCompleted;
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

        const response = await fetch(`${API_URL}/change_in_subtask`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
          body: JSON.stringify({
            "idSubtask": updatedSubtask.idSubtask,
            "title": updatedSubtask.title,
            "isCompleted": updatedIsCompleted
          })
        });

        // Get the response data from the server
        const responseData = await response.text();

        // Check if the response is not OK and log a warning
        if (!response.ok) {
          console.log(responseData);

          // Show a Snackbar message for the update task error
          Snackbar.show({
            text: infoTranslation.updatingSubtaskError(intl),
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.log("Error occurred while updating subtask in db:", error);
        Snackbar.show({
          text: infoTranslation.updatingSubtaskError(intl),
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
