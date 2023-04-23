/*
* Primary script for our uptime API
*
*/

// Dependencies
var http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

// Create a server object that listens on a port
var server = http.createServer(function(req, res){

    // Get and parse the url
    var parsedUrl = url.parse(req.url, true);

    // Get the path and Trim the url using regex
    var path = parsedUrl.pathname;
    var trimmedUrl = path.replace(/^\/+|\/+$/g,'');

    // Get the request method
    var method = req.method.toUpperCase();

    // Get requests headers
    var headers = req.headers;
    // Get the querySetSelector

    var querySetSelector = parsedUrl.query;
    // Log a message to the user

    //  Payload if any
    var decoder = new stringDecoder;
    var buffer = '';

    // on emit function
    req.on('data', function(data){
        buffer += decoder.write(data);
    })

    req.on('end', function(end){
        res.end('Hello World, you\'re in path: ' +trimmedUrl + " " + "with method: " + method);

        // Out the path received
        console.log("The  request payloads are: ",buffer);
    })
  
    
})

// Alert us that server is running
server.listen(3000, function(){
    console.log("The server is listening on port 3000")
});

// Handler function
var handler = {};

// Sample handler
handler.sample = function(data, callback){
// callback a status code and a payload
    callback(200, {'name': "Hello world of sample test feactures"});
};

// Not found handler
handler.notFound= function(data, callback){
    callback(404);
};


// Define the route 
var routes = {
    'sample': handler.sample
}