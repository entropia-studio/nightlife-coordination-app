const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const path = require('path');


// Avoid CORS problems
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","GET, DELETE, OPTIONS")
    next();
});


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/nightlife-coordination-app'));

//Connect to DB
// setup our datastore
var datastore = require("./datastore");
datastore.connect();


app.get('/api/data',(req,res) => {    
    try{
        datastore.getStocks()
            .then(response => {                
                res.json(response);
            })
    }catch(e){
        handleError(e,res);
    }    
})


app.post('/api/company/add',(req,response) => {
    try{        
        datastore.addCompany(req.body,response)
            .then(res => {
                response.json(res); 
                wss.broadcast('{"action" : "add"}');                       
            },error => {
                handleError(error,response);
            });       
    }catch(e){
        handleError(e,response);
    }
})

app.delete('/api/company/delete/:codeCompany',(req,response) => {
    try{        
        datastore.deleteCompany(req.params.codeCompany)
            .then(res => {
                wss.broadcast('{"action" : "delete"}');
                response.json(res);                        
            },error => {
                handleError(error,response);
            });       
    }catch(e){
        handleError(e,response);
    }
})

app.get('/*', function(req,res) {    
    res.sendFile(path.join(__dirname+'/dist/nightlife-coordination-app/index.html'));
});


// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

function handleError(err, response) {  
    response.status(500);  
    response.send(
      "<html><head><title>Internal Server Error!</title></head><body><pre>"
      + JSON.stringify(err, null, 2) + "</pre></body></pre>"
    );
  }