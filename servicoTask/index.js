const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// task 
const taskRoute = require("./Routes/task");

app.use('/task', taskRoute);

//CODE FOR CONNECTION TO DATABASE
const db = mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    database:"adm_task",
    });
    
    db.connect(function(err){
    if(err)throw err;
    
    console.log("Database Connected!");
    
    });

    //Global variable for the mysql connection
    global.db = db;
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })