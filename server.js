
require(`dotenv`).config();
const express = require('express')
const app     = express();
const PORT    = process.env.PORT || 3000;
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
//listen for request
app.listen(PORT, () => {
    console.log(`CONNECT_SERVER: Connected, server started listening on port : ${PORT}`);
  });
