export interface SubtaskType {
  idSubtask: number;
  title: string;
  isCompleted: boolean;
  addedBy: string;
  createdAt: string;
  Task_idTask: number;
}

export interface TaskType {
  IdTask: number;
  title: string;
  isCompleted: boolean;
  deadline?: string | null;
  importance: string;
  effort: string;
  note: string;
  addedBy: string;
  assignedTo: number | null;
  createdAt: string;
  List_idList: number;
  subtasks: SubtaskType[];
}

export interface ListType {
  IdList: number;
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
