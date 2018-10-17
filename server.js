var express = require('express');
var app = express();

app.use('/', express.static('public'));

// When testing locally the server will listen on port 8080.
// Otherwise Heroku will dynamically assign a port through 'process.env.PORT'.
app.listen(process.env.PORT || 8080); 