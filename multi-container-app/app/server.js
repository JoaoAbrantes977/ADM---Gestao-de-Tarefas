const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const express = require('express');
const app = express();
const moment = require('moment');

// Live Reload configuration
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

// Fontend route
const FrontRouter = require('./routes/front');

// Use Live Reload middleware
app.use(connectLiveReload());

// Middleware para analisar o corpo das requisições como URL-encoded e JSON
app.use(bodyParser.json()); // Adicionado para parsear JSON

app.locals.moment = moment;

// Database connection
const db = require('./config/keys').mongoProdURI;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Mongodb Connected`))
    .catch(error => console.log(error));

// Use rotas
app.use(FrontRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
