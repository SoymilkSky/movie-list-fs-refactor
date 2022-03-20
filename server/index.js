const express = require('express');
const db = require('./db');
const router = require('./routes.js');

const app = express();

app.set('port', 3000);

app.use(express.json());
app.use('/api', router);
app.use(express.static('client/dist'));

app.listen(3000, () => {console.log('listening on port 3000')});
