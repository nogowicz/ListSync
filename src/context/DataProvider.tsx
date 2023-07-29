import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { data } from 'data/data.json';
import { List } from 'data/types';

type DataContextType = {
  listData: List[];
  updateListData: (callback: (prevListData: List[]) => List[]) => void;
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

export function DataProvider({ children }: DataProviderProps) { // Use DataProviderProps as the type for the function parameter
  const [listData, setListData] = useState<List[]>(data);

  const updateListData = (callback: (prevListData: List[]) => List[]) => {
    setListData(callback);
  };

  const value: DataContextType = {
    listData,
    updateListData,
  };
  console.log(listData)
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
