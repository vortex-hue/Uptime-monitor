/*
* Primary script for our uptime API
*
*/

// Dependencies
var http = require('http');
var https = require('https');
var fs = require('fs');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');


// Create a http server object that listens on a port
var Httpserver = http.createServer(function(req, res){
    uniFiedServer(req, res);
    
})

// Alert us that server is running
Httpserver.listen(config.httpport, function(){
    port = config.httpport;
    envName = config.envName;
    // console.log(port);
    console.log("The server is listening on port "+ port + " in " + envName + " Mode ")
});


// Server options
HttpsServerOption = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}
// Instantiate HTTPS Server
var Httpsserver = https.createServer(HttpsServerOption,function(req, res){
    uniFiedServer(req, res);
    
})

// Start a https server 
Httpsserver.listen(config.httpsport, function(){
    port = config.httpsport;
    envName = config.envName;
    // console.log(port);
    console.log("The server is listening on port "+ port + " in " + envName + " Mode ")
});


// Unified Server Function
var uniFiedServer = function(req,res){

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
 
             //set content type to json
             res.setHeader('Content-Type', 'application/json');
             res.writeHead(statusCode);
             res.end(payloadString);
 
             // output to the user as text
                 // Out the path received
             console.log("Returning this response: ",statusCode, payloadString);
         });
         // req.on('end', function(end){
         
         // });
 
     });
};


// Handler function
var handler = {};

// Sample handler
// handler.sample = function(data, callback){
// // callback a status code and a payload
//     callback(200, {'name': "Hello world of sample test feactures"});
// };
//

// Ping handler to check uptime
handler.ping = function(data, callback){
    callback(200);
};


// Not found handler
handler.notFound= function(data, callback){
    callback(404);
};

// home handler
handler.home = function(data, callback){
    callback(200, {'name': 'Hello world!!, you\'re in hoome page'});
}
// Define the route 
var routes = {
    'ping': handler.ping,
    '': handler.home,
};