const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  
const router = express.Router();

// Generate JWT token for the registered user
const secretKey = "twerwdsr";

// Route to get all users
router.get('/', (req, res) =>{

  //variavel global database
   const db = global.db;
 // SQL query to retrieve all tasks
 const query = ` SELECT * FROM user `;

 // Execute the SQL query with the inspection ID as a parameter
 db.query(query, (error, results, fields) => {
   if (error) {
     console.error('Error retrieving users:', error);
     res.status(500).send("Error retrieving users");
     return;
   }
   console.log('Users retrieved successfully');
   res.status(200).json(results); 
 });
});

// Route to get a user by it's id
router.get('/:id', (req, res) =>{

  //variavel global database
const db = global.db;
const userId = req.params.id;

// SQL query to retrieve user information by it's id
const query = ` SELECT * FROM user where id = ? `;

// Execute the SQL query with the inspection ID as a parameter
db.query(query, [userId], (error, results, fields) => {
 if (error) {
   console.error('Error retrieving task:', error);
   res.status(500).send("Error retrieving task");
   return;
 }
 console.log('Task retrieved successfully');
 res.status(200).json(results); 
});
});

// Route to handle user registration
router.post('/register', (req, res) => {

    // Global variable database
    const db = global.db;
    const { name, password, email } = req.body;
    // Generate salt and hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error hashing password' });
      }
  
        // Insert the user with the hashed password 
        const sqlInsertUser = `INSERT INTO user (name, password, email, createdAt, updatedAt) 
                               VALUES (?, ?, ?, CURDATE(), CURDATE())`;
  
        db.query(sqlInsertUser, [name, hashedPassword, email], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error registering user' });
          }
          const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
          res.status(201).json({ message: 'User registered successfully', token });
        });
      });
    });
    
// Login Endpoint
router.post('/login', (req, res) => {
  const db = global.db;
  const { email, password } = req.body;
  
  // Check if user exists
  db.query('SELECT * FROM user WHERE email = ?', email, (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error logging in' });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = results[0];

      // Compare hashed passwords
      bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Error comparing passwords' });
          }

          if (!isMatch) {
              return res.status(401).json({ message: 'Invalid email or password' });
          }

          // Passwords match, generate JWT token
          const token = jwt.sign({ id: user.id_user, email: user.email }, secretKey);
          res.json({ token });
      });
  });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.id = decoded.id;
    next();
  });
}

// Protected Route Example
router.get('/profile', verifyToken, (req, res) => {

  // Global variable database
  const db = global.db;
  const userId = req.userId;
  // Fetch user profile from database using userId
  db.query('SELECT * FROM user WHERE id = ?', userId, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching profile' });
    } else {
      const user = results[0];
      res.json({ user });
    }
  });
});

// Edits the User
router.patch('/edit/:id', verifyToken, (req, res) => {
  
  const userId = req.params.id;

  // Extract updated user information from the request body
  const { name, email } = req.body;

  // Update user information in the database
  db.query('UPDATE user SET name=?, email=?, updatedAt = CURRENT_TIMESTAMP WHERE id=?',
      [name, email, userId],
      (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Error updating user information' });
          }
          res.status(200).json({ message: 'User information updated successfully' });
      }
  );
});

// Route to delete a user by its ID
router.delete('/:id', (req, res) => {

  //variavel global database
  const db = global.db;
  const userId = req.params.id;

  // Check if taskId is a valid integer
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Delete task from the database
  const sql = 'DELETE FROM user WHERE id = ?';
  db.query(sql, [userId], (error, results, fields) => {
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Check if any rows were affected (User with given ID exists)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Task deleted successfully
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

// Exports the routes to server.js
module.exports = router;
