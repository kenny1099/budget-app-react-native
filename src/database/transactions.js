import db from './db';

export const ajouterTransaction = async (description, montant, type, categorie, date) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO transactions (description, montant, type, categorie, date) VALUES (?, ?, ?, ?, ?);`,
      [description, montant, type, categorie, date]
    );
    return result;
  } catch (error) {
    console.error('Erreur ajouterTransaction:', error);
    throw error;
  }
};

export const lireTransactions = async () => {
  try {
    const rows = await db.getAllAsync(`SELECT * FROM transactions ORDER BY date DESC;`);
    return rows;
  } catch (error) {
    console.error('Erreur lireTransactions:', error);
    throw error;
  }
};

export const calculerSolde = async () => {
  try {
    const row = await db.getFirstAsync(`
      SELECT 
        SUM(CASE WHEN type = 'revenu' THEN montant ELSE 0 END) AS total_revenus,
        SUM(CASE WHEN type = 'depense' THEN montant ELSE 0 END) AS total_depenses
      FROM transactions;
    `);
    return row || { total_revenus: 0, total_depenses: 0 };
  } catch (error) {
    console.error('Erreur calculerSolde:', error);
    throw error;
  }
};

export const supprimerTransaction = async (id) => {
  try {
    const result = await db.runAsync(`DELETE FROM transactions WHERE id = ?;`, [id]);
    return result;
  } catch (error) {
    console.error('Erreur supprimerTransaction:', error);
    throw error;
  }
};
