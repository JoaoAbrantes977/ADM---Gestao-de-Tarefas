const express = require('express');
const router = express.Router();

// Route to get all tasks
router.get('/', (req, res) =>{

//variavel global database
 const db = global.db;

 // SQL query to retrieve all tasks
 const query = ` SELECT * FROM task `;

 // Execute the SQL query with the inspection ID as a parameter
 db.query(query, (error, results, fields) => {
   if (error) {
     console.error('Error retrieving task:', error);
     res.status(500).send("Error retrieving task");
     return;
   }
   console.log('Task retrieved successfully');
   res.status(200).json(results); 
 });
});

// Route to get a specific task(s) by user id
router.get('/:id', (req, res) =>{

     //variavel global database
  const db = global.db;
  const userId = req.params.id;

  // SQL query to retrieve tasks information by user ID
  const query = ` SELECT * FROM task where id_user = ? `;

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

// Route to insert a task 
router.post('/', (req, res) => {

    //variavel global database
    const db = global.db;
    const { id_user, title, description, status,} = req.body;

        // Insert the user with the hashed password 
        const sqlInsertTask = `INSERT INTO task (id_user, title, description, status, createdAt, updatedAt) 
                               VALUES (?, ?, ?, ?, CURDATE(), CURDATE())`;
  
        db.query(sqlInsertTask, [id_user, title, description, status], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error inserting task' });
          }
          res.status(201).json({ message: 'Task registered successfully'});
        });
      });

// Route to edit a task by it's id
router.patch('/:id', (req, res) =>{


});

// Route to delete a task by it's id
router.delete('/:id', (req, res) =>{


});

// Exports the routes to server.js
module.exports = router;