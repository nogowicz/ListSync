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
          const userData = resultSet.rows.item(0);
          onSuccess(userData);
        } else {
          onError(new Error('Invalid credentials'));
        }
      },
      (_, error) => {
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
        '(IdTask INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, isCompleted INTEGER, deadline TEXT, importance TEXT, effort TEXT, note TEXT, addedBy TEXT, assignedTo INTEGER, createdAt TEXT);',
    ),
      () => {
        console.log('created tasks_list');
      };
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

export function createTaskListTable() {
  database.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS task_lists (
        taskId INTEGER,
        listId INTEGER,
        PRIMARY KEY(taskId, listId))`,
      [],
      () => {
        console.log('Table task_lists created successfully.');
      },
      error => {
        console.error('Error creating table task_lists:', error);
      },
    );
  });
}

export function addListToDatabase(list: ListType): Promise<number> {
  return new Promise<number>((resolve, reject) => {
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
          resolve(result.insertId);
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

export function updateListInDatabase(
  listId: number,
  listName?: string,
  iconId?: number,
  colorVariant?: number,
  canBeDeleted?: boolean,
  isShared?: boolean,
  isFavorite?: boolean,
  isArchived?: boolean,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      const queryParams: any[] = [];
      let updateQuery = 'UPDATE lists SET ';

      if (listName !== undefined) {
        updateQuery += 'listName = ?, ';
        queryParams.push(listName);
      }
      if (iconId !== undefined) {
        updateQuery += 'iconId = ?, ';
        queryParams.push(iconId);
      }
      if (canBeDeleted !== undefined) {
        updateQuery += 'canBeDeleted = ?, ';
        queryParams.push(canBeDeleted ? 1 : 0);
      }
      if (isShared !== undefined) {
        updateQuery += 'isShared = ?, ';
        queryParams.push(isShared ? 1 : 0);
      }
      if (isFavorite !== undefined) {
        updateQuery += 'isFavorite = ?, ';
        queryParams.push(isFavorite ? 1 : 0);
      }
      if (isArchived !== undefined) {
        updateQuery += 'isArchived = ?, ';
        queryParams.push(isArchived ? 1 : 0);
      }
      if (colorVariant !== undefined) {
        updateQuery += 'colorVariant = ?, ';
        queryParams.push(colorVariant);
      }

      let trimmedUpdateQuery = updateQuery.slice(0, -2);

      trimmedUpdateQuery += ' WHERE IdList = ?';
      queryParams.push(listId);

      tx.executeSql(
        trimmedUpdateQuery,
        queryParams,
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

export function addTaskToDatabase(
  newTask: TaskType,
  listId: number,
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO tasks (title, isCompleted, deadline, importance, effort, note, addedBy, assignedTo, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
        ],
        (_, result) => {
          const taskId = result.insertId;
          tx.executeSql(
            'INSERT INTO task_lists (taskId, listId) VALUES (?, ?)',
            [taskId, listId],
            () => {
              if (listId !== 1) {
                tx.executeSql(
                  'INSERT INTO task_lists (taskId, listId) VALUES (?, ?)',
                  [taskId, 1],
                  () => {
                    resolve(taskId);
                  },
                  error => {
                    reject(error);
                  },
                );
              } else {
                resolve(taskId);
              }
            },
            error => {
              reject(error);
            },
          );
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

export function updateTaskInDatabase(
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

export async function getUserLists(userId: number): Promise<ListType[]> {
  return new Promise<ListType[]>(async (resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM lists WHERE createdBy = ?',
        [userId],
        (_, resultSet) => {
          const lists: ListType[] = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            const row = resultSet.rows.item(i);
            const list: ListType = {
              IdList: row.IdList,
              listName: row.listName,
              iconId: row.iconId,
              canBeDeleted: row.canBeDeleted === 1,
              isShared: row.isShared === 1,
              createdAt: row.createdAt,
              isFavorite: row.isFavorite === 1,
              isArchived: row.isArchived === 1,
              createdBy: row.createdBy,
              colorVariant: row.colorVariant,
              tasks: [],
            };
            lists.push(list);
          }

          const fetchTasksPromises = lists.map(async list => {
            const tasks = await getUserTasksForList(list.IdList);
            list.tasks = tasks;
          });

          Promise.all(fetchTasksPromises)
            .then(() => {
              resolve(lists);
            })
            .catch(error => {
              reject(error);
            });
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export async function getUserTasksForList(listId: number): Promise<TaskType[]> {
  return new Promise<TaskType[]>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        `SELECT tasks.* 
        FROM tasks 
        INNER JOIN task_lists ON tasks.IdTask = task_lists.taskId 
        WHERE task_lists.listId = ?`,
        [listId],
        (_, resultSet) => {
          const tasks: TaskType[] = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            const row = resultSet.rows.item(i);
            const task: TaskType = {
              IdTask: row.IdTask,
              title: row.title,
              isCompleted: row.isCompleted === 1,
              deadline: row.deadline,
              importance: row.importance,
              effort: row.effort,
              note: row.note,
              addedBy: row.addedBy,
              assignedTo: row.assignedTo,
              createdAt: row.createdAt,
              subtasks: [],
            };
            tasks.push(task);
          }
          const fetchSubtasksPromises = tasks.map(async task => {
            try {
              const subtasks = await fetchSubtasksForTask(task.IdTask);
              task.subtasks = subtasks;
            } catch (error) {
              console.error('Error fetching subtasks for task:', error);
            }
          });

          Promise.all(fetchSubtasksPromises)
            .then(() => {
              resolve(tasks);
            })
            .catch(error => {
              reject(error);
            });
        },
        error => {
          console.error('Database error:', error);
          reject(error);
        },
      );
    });
  });
}

export function getUserTasks(userId: number): Promise<TaskType[]> {
  return new Promise<TaskType[]>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tasks WHERE assignedTo = ?',
        [userId],
        async (_, resultSet) => {
          const tasks: TaskType[] = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            const rowData = resultSet.rows.item(i);
            const task: TaskType = {
              IdTask: rowData.IdTask,
              title: rowData.title,
              isCompleted: rowData.isCompleted === 1,
              deadline: rowData.deadline,
              importance: rowData.importance,
              effort: rowData.effort,
              note: rowData.note,
              addedBy: rowData.addedBy,
              assignedTo: rowData.assignedTo,
              createdAt: rowData.createdAt,
              subtasks: [],
            };

            const subtasks = await fetchSubtasksForTask(task.IdTask);
            task.subtasks = subtasks;

            tasks.push(task);
          }
          resolve(tasks);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function fetchSubtasksForTask(taskID: number): Promise<SubtaskType[]> {
  return new Promise<SubtaskType[]>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM subtasks WHERE Task_idTask = ?',
        [taskID],
        (_, result) => {
          const subtasks: SubtaskType[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            const subtask: SubtaskType = {
              idSubtask: row.idSubtask,
              title: row.title,
              isCompleted: row.isCompleted === 1,
              addedBy: row.addedBy,
              createdAt: row.createdAt,
              Task_idTask: row.Task_idTask,
            };
            subtasks.push(subtask);
          }
          resolve(subtasks);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}

export function deleteCompletedTasksInDatabase(listId?: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      let deleteQuery = 'DELETE FROM tasks WHERE isCompleted = 1';
      const queryParams: any[] = [];

      if (listId) {
        deleteQuery +=
          ' AND IdTask IN (SELECT taskId FROM task_lists WHERE listId = ?)';
        queryParams.push(listId);
      }

      tx.executeSql(
        deleteQuery,
        queryParams,
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

export function deleteTaskFromDatabase(taskId: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'DELETE FROM tasks WHERE IdTask = ?',
        [taskId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error(`Task with ID ${taskId} not found`));
          }
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
}
