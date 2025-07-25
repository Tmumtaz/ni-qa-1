const express = require('express');
const router = express.Router();

// GET /api/id - Get all users (matching original endpoint)
router.get('/id', async (req, res) => {
  try {
    const users = await req.db.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/id/:id - Get user by ID (matching original endpoint)
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.db.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Sometimes return array for consistency testing
    if (Math.random() > 0.7) {
      res.json([user]);
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/save - Create or update user (matching original endpoint)
router.post('/save', async (req, res) => {
  try {
    const { id, ...userData } = req.body;
    
    let result;
    if (id) {
      // Update existing user
      result = await req.db.updateUser(id, userData);
    } else {
      // Create new user
      result = await req.db.createUser(userData);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error saving user:', error);
    if (error.message.includes('Missing required fields')) {
      res.status(400).json({ err: 'Missing information' });
    } else if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ err: 'Email already exists' });
    } else {
      res.status(500).json({ err: 'Something went wrong when uploading the information' });
    }
  }
});

// DELETE /api/user/:userId - Delete user (matching frontend expectation)
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await req.db.deleteUser(userId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.message.includes('User not found')) {
      res.status(404).json({ err: 'User not found' });
    } else {
      res.status(500).json({ err: 'Failed to delete user' });
    }
  }
});

// DELETE /api/id/:id - Delete user (alternative endpoint matching original)
router.delete('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.db.deleteUser(id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.message.includes('User not found')) {
      res.status(404).json({ err: 'User not found' });
    } else {
      res.status(500).json({ err: 'Failed to delete user' });
    }
  }
});

// OPTIONS handler for CORS (matching original AllowOptions.js)
router.options('*', (req, res) => {
  res.status(200).json('CORS pass');
});

module.exports = router;
