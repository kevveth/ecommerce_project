// __tests__/users.test.js
const { findByUsername } = require('../db/users');
const { pool, query } = require('../db');

describe('findByUsername', () => {
  beforeAll(async () => {
    await query('BEGIN');
  });

  afterAll(async () => {
    await query('ROLLBACK');
    pool.end();
  });

  test('should find a user by username', async () => {
    // Insert a test user, but handle potential unique constraint violations
    try {
      await query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
        ['testuser', 'testuser@example.com', 'hashed_password']
      );
    } catch (err) {
      // If the user already exists (e.g., from a previous test run), ignore the error
      if (err.code !== '23505') { 
        console.error('Error inserting test user:', err);
      }
    }

    const user = await findByUsername('testuser');
    expect(user).toBeDefined();
    expect(user.username).toBe('testuser');
  });

  test('should return undefined if user not found', async () => {
    const user = await findByUsername('nonexistentuser');
    expect(user).toBeUndefined();
  });
});