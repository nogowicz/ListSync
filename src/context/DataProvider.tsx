import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { data } from 'data/data.json';
import { ListType } from 'data/types';
import { getUserLists } from 'utils/database';
import { useAuth } from './AuthContext';

type DataContextType = {
  listData: ListType[];
  updateListData: (callback: (prevListData: ListType[]) => ListType[]) => void;
};

const DataContext = createContext<DataContextType>({
  listData: [],
  updateListData: () => { },
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
          console.error('Error fetching user lists:', error);
        });
    }
  }, [user?.ID]);

  const updateListData = (callback: (prevListData: ListType[]) => ListType[]) => {
    setListData(prevListData => callback(prevListData));
  };

  const value: DataContextType = {
    listData,
    updateListData,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
