/*
 * Starting point for uptime monitor API server
 */

// Dependencies
const http = require('http');
const url = require('url');
const { URL } = require('url');

// Server responds to all requests with a string
var server = http.createServer(function(req, resp){
  // parse url
  console.log("----" + req.url);
  let parsedUrl = new URL(req.url);
 
  // get path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // send response
  resp.end('Hello, World!\n');

  // log request path
  console.log('Request received for path ' + trimmedPath);
});

// Start the server, listen on port 3000
server.listen(3000, function(){
  console.log("Server listening on port 3000.");
});

