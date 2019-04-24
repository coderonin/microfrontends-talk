const express = require('express');
const path = require('path');
const app = express();
const routes = require('./mockdata/routes');

app.use(express.json());
app.use('/node_modules', express.static(__dirname+'/node_modules'))
app.use('/src', express.static(__dirname+'/src'))
app.use('/api', routes);
app.use('/imgs', express.static(__dirname+'/mockdata/imgs'));
app.use((req, res) => res.status(200).sendFile(path.join(__dirname+'/index.html')));

app.listen(3000);

console.log('app running on port ', 3000);