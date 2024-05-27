const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

// Proxy for the user service
app.use('/user', createProxyMiddleware({
    target: 'http://container_user:3000', 
    changeOrigin: true,
    pathRewrite: {
        '^/user': '', // Remove /user prefix when forwarding
    },
}));

// Proxy for the task service
app.use('/task', createProxyMiddleware({
    target: 'http://container_task:3000', 
    changeOrigin: true,
    pathRewrite: {
        '^/task': '/task', // Keep /task prefix when forwarding
    },
}));

app.listen(port, () => {
    console.log(`Orchestrator app listening on port ${port}`);
});
