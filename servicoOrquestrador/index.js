const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;


//#############   USERS    ###############//

// Get all users
app.use('/user', async (req, res) => {
    const resp = await fetch("http://container_user:3000/user")

    console.log(resp)

    const data = await resp.json()

    console.log(11111, data)

    res.json(data)
});

// Get user by id (GET)
app.use('/userId/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const resp = await fetch(`http://container_user:3000/user/${userId}`);
        const data = await resp.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching user by id:', error);
        res.status(500).send("Error fetching user by id");
    }
});

// Register a user (POST)
app.use('/userInsert', async (req, res) => {
    try {
        const userData = req.body;
        
        const response = await fetch('http://container_user:3000/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send("Error user task");
    }
});

// login (POST)
app.use('/userLogin', async (req, res) => {
    try {
        const userData = req.body;
        
        const response = await fetch('http://container_user:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send("Error user task");
    }
});

// Edit a user by it's id (PATCH)
app.use('/userEdit/:id', async (req, res) =>{

    const userId = req.params.id;

    try {
        const userData = req.body;
        
        const response = await fetch(`http://container_user:3000/user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send("Error updating user");
    }
});

//Deleting a user by it's id (DELETE)
app.use('/userDelete/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const response = await fetch(`http://container_user:3000/user/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            let errorData;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                errorData = { message: response.statusText };
            }
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        res.status(200).send({ message: `User with ID ${userId} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send(`Error deleting user: ${error.message}`);
    }
});

//#############   TASKS    ###############//

// Get all task from the db (GET)
app.use('/task', async (req, res) => {
    const resp = await fetch("http://container_task:3000/task")
    const data = await resp.json()

    res.json(data)
});

// Get task by user id (GET)
app.use('/taskId/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const resp = await fetch(`http://container_task:3000/task/${taskId}`);
        const data = await resp.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching task by id:', error);
        res.status(500).send("Error fetching task by id");
    }
});

// Post a task (POST)
app.use('/taskInsert', async (req, res) => {
    try {
        const taskData = req.body;
        
        const response = await fetch('http://container_task:3000/task/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).send("Error creating task");
    }
});

// Edit a task by it's id (PATCH)
app.use('/taskEdit/:id', async (req, res) =>{

    const taskId = req.params.id;

    try {
        const taskData = req.body;
        
        const response = await fetch(`http://container_task:3000/task/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send("Error updating task");
    }
});

//Deleting a task by it's id (DELETE)
app.use('/taskDelete/:id', async (req, res) => {
    const taskId = req.params.id;

    try {
        const response = await fetch(`http://container_task:3000/task/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            let errorData;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                errorData = { message: response.statusText };
            }
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        res.status(200).send({ message: `Task with ID ${taskId} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send(`Error deleting task: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Orchestrator app listening on port ${port}`);
});
