const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, 'users.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table ready');
        this.seedData();
      }
    });
  }

  seedData() {
    // Check if data already exists
    this.db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        console.error('Error checking existing data:', err.message);
        return;
      }

      if (row.count === 0) {
        // Insert some initial data
        const sampleUsers = [
          ['John Doe', 'john@example.com', '123456789'],
          ['Jane Doe', 'jane@example.com', '987654321'],
          ['Bob Smith', 'bob@example.com', '555123456']
        ];

        const insertUser = this.db.prepare(`
          INSERT INTO users (fullName, email, phone) VALUES (?, ?, ?)
        `);

        sampleUsers.forEach(user => {
          insertUser.run(user, (err) => {
            if (err) {
              console.error('Error seeding data:', err.message);
            }
          });
        });

        insertUser.finalize();
        console.log('Sample data inserted');
      }
    });
  }

  // Get all users
  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM users ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Convert to match MongoDB format expected by frontend
          const users = rows.map(row => ({
            _id: row.id.toString(),
            fullName: row.fullName,
            email: row.email,
            phone: row.phone,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
          }));
          resolve(users);
        }
      });
    });
  }

  // Get user by ID
  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          // Convert to match MongoDB format expected by frontend
          const user = {
            _id: row.id.toString(),
            fullName: row.fullName,
            fname: row.fullName,
            email: row.email,
            phone: row.phone,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
          };
          resolve(user);
        }
      });
    });
  }

  // Create user
  createUser(userData) {
    return new Promise((resolve, reject) => {
      const { fullName, fname, email, phone } = userData;
      const name = fullName || fname; // Handle both field names
      
      if (!name || !email || !phone) {
        return reject(new Error('Missing required fields: name, email, phone'));
      }

      const sql = `
        INSERT INTO users (fullName, email, phone) 
        VALUES (?, ?, ?)
      `;

      this.db.run(sql, [name, email, phone], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            _id: this.lastID.toString(),
            fullName: name,
            email,
            phone,
            createdAt: new Date().toISOString()
          });
        }
      });
    });
  }

  // Update user
  updateUser(id, userData) {
    return new Promise((resolve, reject) => {
      const { fullName, fname, email, phone } = userData;
      const name = fullName || fname;

      if (!name || !email || !phone) {
        return reject(new Error('Missing required fields: name, email, phone'));
      }

      const sql = `
        UPDATE users 
        SET fullName = ?, email = ?, phone = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      this.db.run(sql, [name, email, phone, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('User not found'));
        } else {
          resolve({
            _id: id.toString(),
            fullName: name,
            email,
            phone,
            updatedAt: new Date().toISOString()
          });
        }
      });
    });
  }

  // Delete user
  deleteUser(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('User not found'));
        } else {
          resolve({ deletedCount: this.changes });
        }
      });
    });
  }

  // Close database connection
  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}

module.exports = Database;
