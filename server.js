const express = require('express'),
  server = express(),
  bodyParser = require('body-parser');

server.use(bodyParser.json()); // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

// Serve all from public
server.use(express.static('public'));
server.use(express.static('js'));
server.use(express.static('components'));
server.use(express.static(__dirname + '../public'));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});


server.get('/ping', (req, res) => {
  res.send({
    'msg': `I'm Alive`
  })
});

server.listen(process.env.PORT || 7288, () => {
  console.log('Are You Positive now listening on port', process.env.PORT || 7288);
});