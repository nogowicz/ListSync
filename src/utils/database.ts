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
export function createTable() {
  database.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ' +
        'users ' +
        '(ID INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, email TEXT UNIQUE, password TEXT, firstName TEXT, lastName TEXT);',
    );
  });
}

export function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  onSuccess: () => void,
  onError: (error: Error) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    database.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)',
        [email, password, firstName, lastName],
        (_, result) => {
          // Handle success
          resolve();
        },
        (_, error) => {
          // Handle error
          reject(error);
        },
      );
    });
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
      'SELECT * FROM users WHERE email = ? AND password = ?',
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
