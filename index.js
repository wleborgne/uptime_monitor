/*
 * Starting point for uptime monitor API server */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

// Define HTTP server
const httpServer = http.createServer(function(req, resp){
  unifiedServer(req, resp)
});
  
// Define HTTPS options and server
const httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, function(req, resp){
  unifiedServer(req, resp)
});

// Start the HTTP server
httpServer.listen(config.httpPort, function(){
  console.log(`Server listening in ${config.envName} mode on port ${config.httpPort}.`);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function(){
  console.log(`Server listening in ${config.envName} mode on port ${config.httpsPort}.`);
});
  
const unifiedServer = function(req, resp){
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
      resp.setHeader('Content-Type', 'application/json');
      resp.writeHead(statusCode);
      resp.end(payloadString);

      // log response data
      console.log(`Sent response with status code ${statusCode}`)
      console.log(`and payload ${payloadString}`);
    });
  });
};


let handlers = {};

handlers.ping = function(data, callback) {
  callback(200);
}

handlers.notFound = function(data, callback) {
  callback(404)
};

const router = {
  'ping' : handlers.ping
};

const logRequestData = function(data) {
  console.log(`Received ${data.method} request for path ${data.reqPath}`);
  console.log('with query params: ', data.query);
  console.log('and headers: ', data.headers);
  console.log('and payload: ', data.payload);
};

