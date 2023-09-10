import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ListType } from 'data/types';
import { addListToDatabase, deleteListFromDatabase, getUserLists } from 'utils/database';
import { useAuth } from './AuthContext';

type DataContextType = {
  listData: ListType[];
  updateListData: (callback: (prevListData: ListType[]) => ListType[]) => void;
  createList: () => Promise<any | ListType>;
  deleteList: (IdList: number) => Promise<void>;
};

const DataContext = createContext<DataContextType>({
  listData: [],
  updateListData: () => { },
  createList: async () => { },
  deleteList: async (IdList: number) => { }
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
    }

  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
