import { ListType, SubtaskType, TaskType } from 'data/types';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

const database: SQLiteDatabase = SQLite.openDatabase(
  {
    name: 'ListSyncDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);
export function createUserTable() {
  database.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        'users ' +
        '(ID INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, email TEXT UNIQUE, password TEXT, firstName TEXT, lastName TEXT);',
    );
  });
}

type RegistrationCallbacks = {
  onRegistrationSuccess: () => void;
  onEmailTaken: () => void;
  onOtherError: (error: Error) => void;
};

export function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  errorHandlers: RegistrationCallbacks,
) {
  database.transaction(tx => {
    tx.executeSql(
      'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)',
      [email, password, firstName, lastName],
      (_, result) => {
        errorHandlers.onRegistrationSuccess();
      },
      (_, error) => {
        if (error.code === 19) {
          errorHandlers.onEmailTaken();
        } else {
          errorHandlers.onOtherError(error as never);
        }
      },
    );
  });
}

export function loginUser(
  email: string,
  password: string,
  onSuccess: (user: any) => void,
  onError: (error: Error) => void,
) {
  database.transaction(tx => {
    tx.executeSql(
      'SELECT ID, email, password, firstName, lastName FROM users WHERE email = ? AND password = ?',
      [email, password],
      (_, resultSet) => {
        if (resultSet.rows.length > 0) {
          // User found
          const userData = resultSet.rows.item(0);
          onSuccess(userData);
        } else {
          // User not found
          onError(new Error('Invalid credentials'));
        }
      },
      (_, error) => {
        // Handle error
        onError(error as never);
      },
    );
  });
}

export function createSubtaskTable() {
  database.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        'subtasks ' +
        '(idSubtask INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, isCompleted INTEGER, addedBy TEXT, createdAt TEXT, Task_idTask INTEGER);',
    );
  });
}

export function createTaskTable() {
  database.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        'tasks ' +
        '(IdTask INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, isCompleted INTEGER, deadline TEXT, importance TEXT, effort TEXT, note TEXT, addedBy TEXT, assignedTo INTEGER, createdAt TEXT, List_idList INTEGER);',
    );
  });
}

export function createListTable() {
  database.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        'lists ' +
        '(IdList INTEGER PRIMARY KEY AUTOINCREMENT, listName TEXT, iconId INTEGER, canBeDeleted INTEGER, isShared INTEGER, createdAt TEXT, isFavorite INTEGER, isArchived INTEGER, createdBy INTEGER, colorVariant INTEGER);',
      [],
      () => {
        tx.executeSql(
          'SELECT * FROM lists WHERE listName = ?',
          ['All'],
          (_, resultSet) => {
            if (resultSet.rows.length === 0) {
              tx.executeSql(
                'INSERT INTO lists (listName, iconId, canBeDeleted, isShared, createdAt, isFavorite, isArchived, createdBy, colorVariant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                ['All', 1, 0, 0, new Date().toISOString(), 0, 0, 1, 1],
                (_, result) => {
                  console.log('Default list "All" inserted successfully.');
                },
                (_, error) => {
                  console.error('Error inserting default list "All":', error);
                },
              );
            }
          },
          (_, error) => {
            console.error('Error checking if "All" list exists:', error);
          },
        );
      },
      (_, error) => {
        console.error('Error creating lists table:', error);
      },
    );
  });
}

export function addListToDatabase(list: ListType): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO lists (listName, iconId, canBeDeleted, isShared, createdAt, isFavorite, isArchived, createdBy, colorVariant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          list.listName,
          list.iconId,
          list.canBeDeleted ? 1 : 0,
          list.isShared ? 1 : 0,
          list.createdAt,
          list.isFavorite ? 1 : 0,
          list.isArchived ? 1 : 0,
          list.createdBy,
          list.colorVariant,
        ],
        (_, result) => {
          console.log('List added to db successfully');
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function deleteList(listId: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM lists WHERE IdList = ?',
        [listId],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function updateList(
  listId: number,
  listName: string,
  iconId: number,
  canBeDeleted: boolean,
  isShared: boolean,
  isFavorite: boolean,
  isArchived: boolean,
  colorVariant: number,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'UPDATE lists SET listName = ?, iconId = ?, canBeDeleted = ?, isShared = ?, isFavorite = ?, isArchived = ?, colorVariant = ? WHERE IdList = ?',
        [
          listName,
          iconId,
          canBeDeleted ? 1 : 0,
          isShared ? 1 : 0,
          isFavorite ? 1 : 0,
          isArchived ? 1 : 0,
          colorVariant,
          listId,
        ],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function addTaskToDatabase(newTask: TaskType): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tasks (title, isCompleted, deadline, importance, effort, note, addedBy, assignedTo, createdAt, List_idList) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newTask.title,
          newTask.isCompleted ? 1 : 0,
          newTask.deadline,
          newTask.importance,
          newTask.effort,
          newTask.note,
          newTask.addedBy,
          newTask.assignedTo,
          newTask.createdAt,
          newTask.List_idList,
        ],
        (_, result) => {
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function deleteTask(taskId: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tasks WHERE IdTask = ?',
        [taskId],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function updateTask(
  taskId: number,
  title: string,
  isCompleted: boolean,
  deadline: string | null,
  importance: string,
  effort: string,
  note: string,
  assignedTo: number | null,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'UPDATE tasks SET title = ?, isCompleted = ?, deadline = ?, importance = ?, effort = ?, note = ?, assignedTo = ? WHERE IdTask = ?',
        [
          title,
          isCompleted ? 1 : 0,
          deadline,
          importance,
          effort,
          note,
          assignedTo,
          taskId,
        ],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function addSubtask(
  title: string,
  isCompleted: boolean,
  addedBy: string,
  createdAt: string,
  Task_idTask: number,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO subtasks (title, isCompleted, addedBy, createdAt, Task_idTask) VALUES (?, ?, ?, ?, ?)',
        [title, isCompleted ? 1 : 0, addedBy, createdAt, Task_idTask],
        (_, result) => {
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function deleteSubtask(subtaskId: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM subtasks WHERE idSubtask = ?',
        [subtaskId],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function updateSubtask(
  subtaskId: number,
  title: string,
  isCompleted: boolean,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'UPDATE subtasks SET title = ?, isCompleted = ? WHERE idSubtask = ?',
        [title, isCompleted ? 1 : 0, subtaskId],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function getUserLists(userId: number): Promise<ListType[]> {
  return new Promise<ListType[]>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM lists WHERE createdBy = ?',
        [userId],
        (_, resultSet) => {
          const lists: ListType[] = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            const rowData = resultSet.rows.item(i);
            const list: ListType = {
              IdList: rowData.IdList,
              listName: rowData.listName,
              iconId: rowData.iconId,
              canBeDeleted: rowData.canBeDeleted === 1,
              isShared: rowData.isShared === 1,
              createdAt: rowData.createdAt,
              isFavorite: rowData.isFavorite === 1,
              isArchived: rowData.isArchived === 1,
              createdBy: rowData.createdBy,
              colorVariant: rowData.colorVariant,
              tasks: [],
            };

            tx.executeSql(
              'SELECT * FROM tasks WHERE List_idList = ?',
              [list.IdList],
              (_, tasksResultSet) => {
                const tasks: TaskType[] = [];
                for (let j = 0; j < tasksResultSet.rows.length; j++) {
                  const taskRowData = tasksResultSet.rows.item(j);
                  const task: TaskType = {
                    IdTask: taskRowData.IdTask,
                    title: taskRowData.title,
                    isCompleted: taskRowData.isCompleted === 1,
                    deadline: taskRowData.deadline,
                    importance: taskRowData.importance,
                    effort: taskRowData.effort,
                    note: taskRowData.note,
                    addedBy: taskRowData.addedBy,
                    assignedTo: taskRowData.assignedTo,
                    createdAt: taskRowData.createdAt,
                    List_idList: taskRowData.List_idList,
                    subtasks: [],
                  };
                  tx.executeSql(
                    'SELECT * FROM subtasks WHERE Task_idTask = ?',
                    [task.IdTask],
                    (_, subtasksResultSet) => {
                      const subtasks: SubtaskType[] = [];
                      for (let k = 0; k < subtasksResultSet.rows.length; k++) {
                        const subtaskRowData = subtasksResultSet.rows.item(k);
                        const subtask: SubtaskType = {
                          idSubtask: subtaskRowData.idSubtask,
                          title: subtaskRowData.title,
                          isCompleted: subtaskRowData.isCompleted === 1,
                          addedBy: subtaskRowData.addedBy,
                          createdAt: subtaskRowData.createdAt,
                          Task_idTask: subtaskRowData.Task_idTask,
                        };
                        subtasks.push(subtask);
                      }
                      task.subtasks = subtasks;
                    },
                    (_, error) => {
                      console.error('Subtask error:', error);
                    },
                  );

                  tasks.push(task);
                }
                list.tasks = tasks;
              },
              (_, error) => {
                console.error('Task error:', error);
              },
            );

            lists.push(list);
          }
          resolve(lists);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}
