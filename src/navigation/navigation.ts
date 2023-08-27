import { ListType } from 'data/types';

export type RootStackParamList = {
  [key: string]:
    | undefined
    | { data: ListType; isModalVisibleOnStart?: boolean };
};
