/*
 * Starting point for uptime monitor API server
 */

// Dependencies
const http = require('http');

// Server responds to all requests with a string
var server = http.createServer(function(req, resp){
	resp.end('Hello, world!\n');
})
// Start the server, listen on port 3000
server.listen(3000, function(){
  console.log("Server listening on port 3000.");
});

