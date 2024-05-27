const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require("cors")
app.use(cors({
  origin: 'http://localhost:3000',
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// task
const taskRoute = require("./Routes/task");

app.use('/task', taskRoute);

// CODE FOR CONNECTION TO DATABASE
const db = mysql.createConnection({
    host: "mysql_task",        // Change this to match the Docker service name
    port: "3306",          // MySQL default port
    user: "root",
    password: "root",      // Add the password field if it is required
    database: "adm_task"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

// Global variable for the mysql connection
global.db = db;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

