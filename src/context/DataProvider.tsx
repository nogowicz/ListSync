import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ListType, TaskType } from 'data/types';
import { addListToDatabase, deleteListFromDatabase, getUserLists, updateListInDatabase, deleteCompletedTasksInDatabase, addTaskToDatabase } from 'utils/database';
import { useAuth } from './AuthContext';

type DataContextType = {
  listData: ListType[];
  updateListData: (callback: (prevListData: ListType[]) => ListType[]) => void;
  createList: () => Promise<any | ListType>;
  deleteList: (IdList: number) => Promise<void>;
  updateList: (
    IdList: number,
    listName?: string,
    iconId?: number,
    colorVariant?: number,
    canBeDeleted?: boolean,
    isShared?: boolean,
    isFavorite?: boolean,
    isArchived?: boolean,
  ) => Promise<void>;
  deleteCompletedTasks: (IdList?: number) => Promise<void>;
  addTask: (newTask: TaskType, IdList?: number) => Promise<any | number>;
};

const DataContext = createContext<DataContextType>({
  listData: [],
  updateListData: () => { },
  createList: async () => { },
  deleteList: async () => { },
  updateList: async () => { },
  deleteCompletedTasks: async () => { },
  addTask: async () => { },
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
    if (user?.ID) {
      getUserLists(user.ID)
        .then(lists => {
          setListData(lists);
        })
        .catch(error => {
          console.error('Error provider fetching user lists:', error);
        });
    }
  }, [user?.ID]);

  const updateListData = (callback: (prevListData: ListType[]) => ListType[]) => {
    setListData(prevListData => callback(prevListData));
  };


  const value: DataContextType = {
    listData,
    updateListData,
    createList: async (): Promise<ListType | undefined> => {
      try {
        const newList: ListType = {
          IdList: -1,
          listName: 'Unnamed list',
          iconId: 1,
          canBeDeleted: true,
          isShared: false,
          createdAt: new Date().toISOString(),
          isFavorite: false,
          isArchived: false,
          createdBy: user?.ID || -1,
          colorVariant: 1,
          tasks: []
        };

        const newListId = await addListToDatabase(newList);
        newList.IdList = newListId;
        updateListData(prevListData => [...prevListData, newList]);
        return newList;
      } catch (error) {
        console.error("Error occurred while adding list to db:", error);
        throw error;
      }
    },
    deleteList: async (IdList: number): Promise<void> => {
      const updatedNewListData: ListType[] = listData.filter((list) => list.IdList !== IdList || !list.canBeDeleted);
      updateListData(() => updatedNewListData);
      try {
        await deleteListFromDatabase(IdList);
      } catch (error) {
        console.error("Error occurred while deleting list from db:", error);
        throw error;
      }
    },
    updateList: async (
      IdList: number,
      listName?: string,
      iconId?: number,
      colorVariant?: number,
      canBeDeleted?: boolean,
      isShared?: boolean,
      isFavorite?: boolean,
      isArchived?: boolean,
    ): Promise<void> => {
      const updatedListData = listData.map((list) => {
        if (list.IdList === IdList) {
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
          IdList,
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
    deleteCompletedTasks: async (IdList?: number): Promise<void> => {
      const updatedListData = listData.map((list) => {
        if (list.IdList === IdList) {
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
        await deleteCompletedTasksInDatabase(IdList);

      } catch (error) {
        console.error("Error occurred while deleting completed tasks from db:", error);
        throw error;
      }
    },
    addTask: async (
      newTask: TaskType,
      IdList?: number,
    ): Promise<number | undefined> => {
      try {
        const taskId = await addTaskToDatabase(newTask, IdList || -1);
        if (taskId !== null) {
          newTask.IdTask = taskId;

          const newListData = listData.map((list) => {
            if (list.IdList === IdList) {
              return {
                ...list,
                tasks: [...list.tasks, newTask],
              };
            } else if (list.IdList === 1 && IdList !== 1) {
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
    }
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
