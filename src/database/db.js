import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('budget.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        montant REAL NOT NULL,
        type TEXT NOT NULL,
        categorie TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL UNIQUE,
        couleur TEXT,
        icone TEXT
      );
    `);
  } catch (error) {
    console.error('Erreur initialisation DB :', error);
    throw error;
  }
};

export default db;
