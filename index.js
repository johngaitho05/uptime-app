/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var https = require('https')
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder
var config  = require("./config")
var fs = require('fs')

// Instantiate the  http server
var httpServer = http.createServer(function(req,res){
    unifiedServer(req, res)
});

// Start the http server
httpServer.listen(config.httpPort,function(){
    console.log("The server is up and running on port "+config.httpPort);
});

// Instantiate the  https server
var httpsServerOptions =  {
    'key':fs.readFileSync('./https/key.pem'),
    'cert':fs.readFileSync('./https/cert.pem'),
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req, res)
});

// Start the https server
httpsServer.listen(config.httpsPort,function(){
    console.log("The server is up and running on port "+config.httpsPort);
});

// All the server logic for bot http and https server
var unifiedServer = function(req, res){
    // Parse the url
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    //Get headers
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8')
    var buffer = ''
    req.on('data',function(data){
        buffer += decoder.write(data);
    })
    req.on('end', function(){
        buffer += decoder.end();

        // chose the hander that the request should go to. If one does not exist then default to notFound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        //Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer,
        }
        chosenHandler(data,function(statusCode,payload){
            //use the status code called back by the handler, or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200
            //use the payload called back by the handler or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {}

            //convert the payload to a string
            var payloadString = JSON.stringify(payload)

            //set content type and status code
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode)

            // Return the response
            res.end(payloadString)

        })
    })
}

// Define handlers
var handlers = {}

// Ping handler
handlers.ping = function(data,callback){
    callback(200);
}

//Not found handler
handlers.notFound = function (data, callback){
    callback(404);
}

//Define a request router
var router = {
    "ping":handlers.ping
}

// Running the app in production: NODE_ENV=production node index.js