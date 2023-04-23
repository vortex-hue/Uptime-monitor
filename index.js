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

    req.on('end', function(){
        buffer += decoder.end();

        // choose a path from trimpath if not found, just 
        var choosenPath = typeof routes[trimmedUrl] !== "undefined" ? routes[trimmedUrl] : handler.notFound;
    
        // pass the data on the request
        var data = {
            'trimmedurl' : trimmedUrl,
            'headers':headers,
            'querySetSelector': querySetSelector,
            'method': method,
            'payload':buffer
        };
    
        // handler function for chosenpath
        choosenPath(data,function(statusCode, Payload) {
            // get the status code or route to undefined
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // get the paylaod 
            Payload = typeof(Payload) == 'object' ? Payload : {};

            // convert the payload to string
            var payloadString = JSON.stringify(Payload);

            //  return response
            res.writeHead(statusCode);
            res.end(payloadString);

            // output to the user as text
                // Out the path received
            console.log("Returning this response: ",statusCode, payloadString);
        });
        // req.on('end', function(end){
        
        // });

    });

    
  
    
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
};