/*
 * Starting point for uptime monitor API server
 */

// Dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

// Server responds to all requests with a string
var server = http.createServer(function(req, resp){
  // parse url
  let parsedUrl = url.parse(req.url, true);
 
  // get path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // get query string as an object
  let queryStringObject = parsedUrl.query;
 
  // get http method
  let method = req.method.toLowerCase();

  // get headers as object
  let headers = req.headers;

  // get request payload if present
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data){
    buffer += decoder.write(data)
  });
  req.on('end', function(){
    buffer += decoder.end();

    // send response
    resp.end('Hello, World!\n');

    // log request path
    console.log(`Received ${method} request for path ${trimmedPath} with query params:`);
    console.log(queryStringObject);
    console.log('and headers:');
    console.log(headers);
    console.log(`with payload: \"${buffer}\"`);
  });
});

// Start the server, listen on port 3000
server.listen(3000, function(){
  console.log("Server listening on port 3000.");
});

