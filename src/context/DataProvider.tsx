import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ListType, SubtaskType, TaskType } from 'data/types';
import { deleteListFromDatabase, updateListInDatabase, deleteCompletedTasksInDatabase, addTaskToDatabase, deleteTaskFromDatabase, addSubtaskToDatabase, deleteSubtaskFromDatabase, updateTaskInDatabase, updateSubtaskInDatabase } from 'utils/database';
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

    // getUserLists(user.id)
    //   .then(lists => {
    //     setListData(lists);
    //   })
    //   .catch(error => {
    //     console.error('Error provider fetching user lists:', error);
    //   });

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
        await deleteListFromDatabase(idList);
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
      try {
        await updateListInDatabase(
          idList,
          listName,
          iconId,
          colorVariant,
          canBeDeleted,
          isShared,
          isFavorite,
          isArchived
        );
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
        const taskId = await addTaskToDatabase(newTask, idList || -1);
        if (taskId !== null) {
          newTask.IdTask = taskId;
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
          return taskId;
        }
      } catch (error) {
        console.error("Error occurred while adding task to db:", error);
        throw error;
      }
    },
    deleteTask: async (IdTask: number, idList: number): Promise<void> => {
      const updatedListData = listData.map((list) => {
        if (list.idList === idList) {
          const updatedTasks = list.tasks.filter((listTask) => listTask.IdTask !== IdTask);
          return {
            ...list,
            tasks: updatedTasks,
          };
        }
        return list;
      });

      updateListData(() => updatedListData);
      try {
        await deleteTaskFromDatabase(IdTask);
      } catch (error) {
        console.error("Error occurred while deleting task from db:", error);
        throw error;
      }
    },
    completeTask: async (updatedTask: TaskType): Promise<void> => {
      const updatedIsCompleted = !updatedTask.isCompleted;
      const updatedNotificationTime = null;
      await updateTaskInDatabase(
        updatedTask.IdTask,
        updatedTask.title,
        updatedIsCompleted,
        updatedTask.deadline,
        updatedTask.importance,
        updatedTask.effort,
        updatedTask.note,
        updatedTask.assignedTo,
        updatedNotificationTime
      )
      updateListData((prevListData: ListType[]) => {
        const updatedLists = prevListData.map((list: ListType) => {
          const updatedTasks = list.tasks.map((task: TaskType) =>
            task.IdTask === updatedTask.IdTask ? { ...task, isCompleted: updatedIsCompleted } : task
          );

          return { ...list, tasks: updatedTasks };
        });

        return updatedLists;
      });


    },
    updateTask: async (updatedTask: TaskType): Promise<void> => {
      await updateTaskInDatabase(
        updatedTask.IdTask,
        updatedTask.title,
        updatedTask.isCompleted,
        updatedTask.deadline,
        updatedTask.importance,
        updatedTask.effort,
        updatedTask.note,
        updatedTask.assignedTo,
        updatedTask.notificationTime
      );

      updateListData((prevListData: ListType[]) => {
        const updatedLists = prevListData.map((list: ListType) => {
          const updatedTasks = list.tasks.map((task: TaskType) =>
            task.IdTask === updatedTask.IdTask ? updatedTask : task
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
                if (task.IdTask === idTask) {
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
            if (task.IdTask === idTask) {
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
