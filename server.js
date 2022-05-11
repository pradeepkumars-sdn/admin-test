const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
var morgan = require('morgan')
const port = 3000;
require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));


var accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), {flags: 'a'}
);
// setup the logger 
app.use(morgan('combined', {stream: accessLogStream}));
const routes = require('./routes/userRoutes');

app.use('/api', routes)

var url = "mongodb://localhost:27017/mydb";
mongoose.connect(url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Database Connected successfully");
});




app.listen(port, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", port);
})