/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder

// Configure the server to respond to all requests with a string
var server = http.createServer(function(req,res){

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
        console.log("trimmedpath",trimmedPath)
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
});

// Define handlers
var handlers = {}

handlers.sample = function(data,callback){
    callback(406, {'name':"Sample handler"});
}

//Not found handler
handlers.notFound = function (data, callback){
    callback(404);
}

//Define a request router
var router = {
    "sample":handlers.sample
}


// Start the server
server.listen(3000,function(){
    console.log('The server is up and running now');
});
