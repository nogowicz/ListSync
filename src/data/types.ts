export interface SubtaskType {
  idSubtask: number;
  title: string;
  isCompleted: boolean;
  addedBy: number;
  createdAt: string;
  idTask: number;
}

export interface TaskType {
  idTask: number;
  title: string;
  isCompleted: boolean;
  deadline: string | null;
  importance: string;
  effort: string;
  note: string;
  addedBy: number;
  assignedTo: number | null;
  createdAt: string;
  notificationTime: string | null;
  subtasks: SubtaskType[];
}

export interface ListType {
  idList: number;
  listName: string;
  iconId: number;
  canBeDeleted: boolean;
  isShared: boolean;
  createdAt: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdBy: number;
  colorVariant: number;
  tasks: TaskType[];
}
