const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

// Proxy for the user service
app.use('/user', async (req, res) => {
    const resp = await fetch("http://container_user:3000/user")

    console.log(resp)

    const data = await resp.json()

    console.log(11111, data)

    res.json(data)
});

// Proxy for the task service
app.use('/task', async (req, res) => {
    const resp = await fetch("http://container_task:3000/task")

    console.log(resp)

    const data = await resp.json()

    console.log(11111, data)

    res.json(data)
});

app.listen(port, () => {
    console.log(`Orchestrator app listening on port ${port}`);
});
