import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ListType, SubtaskType, TaskType } from 'data/types';
import { deleteCompletedTasksInDatabase, addSubtaskToDatabase, deleteSubtaskFromDatabase, updateSubtaskInDatabase } from 'utils/database';
import { useAuth } from './AuthContext';
import { API_URL } from '@env';

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

  useEffect(() => {
    async function fetchUserLists() {
      if (user?.id) {
        const response = await fetch(`${API_URL}/get_all_lists?userId=${user.id}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
        });
        const responseData = await response.json();
        if (!response.ok) {
          console.warn(responseData)
        }
        setListData(responseData)
        console.log(responseData);
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
        const newList: ListType = {
          idList: -1,
          listName: 'Unnamed list',
          iconId: 1,
          canBeDeleted: true,
          isShared: false,
          createdAt: new Date().toISOString(),
          isFavorite: false,
          isArchived: false,
          createdBy: user?.id || -1,
          colorVariant: 1,
          tasks: []
        };

        const response = await fetch(`${API_URL}/add_list`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
          body: JSON.stringify({
            "listName": newList.listName,
            "iconId": newList.iconId,
            "isShared": newList.isShared,
            "colorVariant": newList.colorVariant,
            "createdBy": newList.createdBy
          })
        });

        const responseData = await response.text();
        if (!response.ok) {
          console.warn(responseData);
        }
        console.log(responseData)
        newList.idList = Number(responseData);
        updateListData(prevListData => [...prevListData, newList]);
        return newList.idList;
      } catch (error) {
        console.error("Error occurred while adding list to db:", error);
        throw error;
      }
    },
    deleteList: async (idList: number): Promise<void> => {
      const updatedNewListData: ListType[] = listData.filter((list) => list.idList !== idList || !list.canBeDeleted);
      updateListData(() => updatedNewListData);
      try {
        const response = await fetch(`${API_URL}/remove_list?IdList=${idList}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "accept": "text/plain"
          },
        });

        const responseData = await response.text();
        if (!response.ok) {
          console.warn(responseData);
        } else {
          console.log(responseData);
        }
      } catch (error) {
        console.error("Error occurred while deleting list from db:", error);
        throw error;
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
      const updatedListData = listData.map((list) => {
        if (list.idList === idList) {
          return {
            ...list,
            listName: listName !== undefined ? listName : list.listName,
            iconId: iconId !== undefined ? iconId : list.iconId,
            colorVariant: colorVariant !== undefined ? colorVariant : list.colorVariant,
            canBeDeleted: canBeDeleted !== undefined ? canBeDeleted : list.canBeDeleted,
            isShared: isShared !== undefined ? isShared : list.isShared,
            isFavorite: isFavorite !== undefined ? isFavorite : list.isFavorite,
            isArchived: isArchived !== undefined ? isArchived : list.isArchived,
          };
        }
        return list;
      });

      updateListData(() => updatedListData);
      const updatedList: ListType | undefined = listData.find((list) => idList === list.idList);
      try {
        if (updatedList) {
          console.log(
            "id", idList,
            "listName", listName ?? updatedList.listName,
            "iconId", iconId ?? updatedList.iconId,
            "isShared", isShared ?? updatedList.isShared,
            "isFavorite", isFavorite ?? updatedList.isFavorite,
            "isArchived", isArchived ?? updatedList.isArchived,
            "colorVariant", colorVariant ?? updatedList.colorVariant
          )
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
            console.warn(responseData);
          }

          console.log(responseData);
        }
      } catch (error) {
        console.error("Error occurred while updating list in db:", error);
        throw error;
      }
    },
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
        console.log(newTask, idList)
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
            "effort": newTask.importance,
            "note": newTask.note,
            "addedBy": newTask.addedBy,
            "assignedTo": newTask.assignedTo,
            "notificationTime": newTask.notificationTime
          })
        });

        const responseData = await response.text();
        if (!response.ok) {
          console.warn(responseData);
        } else {
          console.log(responseData)
        }
        const taskId = responseData;
        if (taskId !== null) {
          newTask.idTask = Number(taskId);
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

          updateListData(() => newListData);
          return Number(taskId);
        }
      } catch (error) {
        console.error("Error occurred while adding task to db:", error);
        throw error;
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
