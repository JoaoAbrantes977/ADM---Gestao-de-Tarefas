const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  
const router = express.Router();

// Generate JWT token for the registered user
const secretKey = "twerwdsr";

// Route to get all tasks
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
        const sqlInsertUser = `INSERT INTO user (name, password, email, createdOn, updatedOn) 
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
    req.userId = decoded.id;
    next();
  });
}

// Protected Route Example
router.get('/profile', verifyToken, (req, res) => {

  // Global variable database
  const db = global.db;
  const userId = req.userId;
  // Fetch user profile from database using userId
  db.query('SELECT * FROM user WHERE id_user = ?', userId, (err, results) => {
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
router.patch('/edit', verifyToken, (req, res) => {
  // Extract user ID from the JWT token
  const userId = req.userId;

  // Extract updated user information from the request body
  const { name, email } = req.body;

  // Update user information in the database
  db.query('UPDATE user SET name=?, email=?, updatedOn = CURDATE() WHERE id_user=?',
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

// Exports the routes to server.js
module.exports = router;
