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

    // choose proper handler, or notFound
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct data object to pass to handler
    let data = {
      'reqPath' : trimmedPath,
      'headers' : headers,
      'method' : method,
      'query' : queryStringObject,
      'payload' : buffer
    };

    // log request data
    logRequestData(data);

    // send data to chosen handler
    chosenHandler(data, function(statusCode, payload) {
      // use returned status or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // use returned payload or empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // convert payload to JSON string
      payloadString = JSON.stringify(payload);

      // send response
      resp.writeHead(statusCode);
      resp.end(payloadString);

      // log response data
      console.log(`Sent response with status code ${statusCode}`)
      console.log('and payload: ' + payload);
    });
  });
});

// Start the server, listen on port 3000
server.listen(3000, function(){
  console.log("Server listening on port 3000.");
});

let handlers = {};

handlers.sample = function(data, callback) {
  // callback http status code and payload object
  callback(406, {'name' : 'sample handler'});
};

handlers.notFound = function(data, callback) {
  callback(404)
};

const router = {
  'sample' : handlers.sample
};

const logRequestData = function(data) {
  console.log(`Received ${data.method} request for path ${data.reqPath}`);
  console.log('with query params: ', data.query);
  console.log('and headers: ', data.headers);
  console.log('and payload: ', data.payload);
};

