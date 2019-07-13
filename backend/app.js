const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {MONGODB_URI} = require('./util/string');
const feedRoutes = require('./routes/feed');

const app = express();
const port = 8080;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

mongoose
    .connect(MONGODB_URI, {useNewUrlParser: true, useFindAndModify: false})
    .then(() => app.listen(port, () => console.log(`Example app listening on port ${port}!`)))
    .catch(e => console.log(e));
