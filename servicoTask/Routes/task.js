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
    const { id_user, title, description, startDate, dueDate, status,} = req.body;

        // Insert the user with the hashed password 
        const sqlInsertTask = `INSERT INTO task (id_user, title, description, startDate, dueDate, status, createdAt, updatedAt) 
                               VALUES (?, ?, ?, ?, ?, ?, CURDATE(), CURDATE())`;
  
        db.query(sqlInsertTask, [id_user, title, description, startDate, dueDate, status], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error inserting task' });
          }
          res.status(201).json({ message: 'Task registered successfully'});
        });
      });

// Route to edit a task by its ID
router.patch('/:id', (req, res) => {
  //variavel global database
  const db = global.db;
  const taskId = req.params.id;
  const { id_user, title, description, startDate, dueDate, status } = req.body;

  // Check if taskId is a valid integer
  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  // Update task in the database
  const sql = `
    UPDATE task 
    SET 
      id_user = ?,
      title = ?,
      description = ?,
      startDate = ?,
      dueDate = ?,
      status = ?,
      updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?`;
  db.query(
    sql,
    [id_user, title, description, startDate, dueDate, status, taskId],(error, results, fields) => {
      if (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      // Check if any rows were affected (task with given ID exists)
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      // Task updated successfully
      res.status(200).json({ message: 'Task updated successfully' });
    }
  );
});

// Route to delete a task by its ID
router.delete('/:id', (req, res) => {

  //variavel global database
  const db = global.db;
  const taskId = req.params.id;

  // Check if taskId is a valid integer
  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  // Delete task from the database
  const sql = 'DELETE FROM task WHERE id = ?';
  db.query(sql, [taskId], (error, results, fields) => {
    if (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Check if any rows were affected (task with given ID exists)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    // Task deleted successfully
    res.status(200).json({ message: 'Task deleted successfully' });
  });
});
// Exports the routes to server.js
module.exports = router;