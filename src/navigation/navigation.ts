import { ListType, TaskType } from 'data/types';

export type RootStackParamList = {
  [key: string]:
    | undefined
    | {
        isModalVisibleOnStart?: boolean;
        isNewList?: boolean;
        task?: TaskType;
        color?: string;
        currentListId?: number;
      };
};
