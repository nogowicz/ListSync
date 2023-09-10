import { ListType, TaskType } from 'data/types';

export type RootStackParamList = {
  [key: string]:
    | undefined
    | {
        data?: ListType;
        isModalVisibleOnStart?: boolean;
        isNewList?: boolean;
        task?: TaskType;
        color?: string;
      };
};
