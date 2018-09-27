require('dotenv').config();
const request = require('request');
const mongoose = require('mongoose');

var MONGODB_URI = 'mongodb://'+process.env.USER_DB+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

var companyStockSchema = mongoose.Schema({      
    name: {type: String, required: true, unique: true},
    code: {type: String, required: true, unique: true}    
  })
  
const Company = mongoose.model('Company',companyStockSchema);  

function connect(){
    return new Promise((resolve,reject) => {
      try{
        mongoose.connect(MONGODB_URI);
      }catch(e){
        reject(new DataStoreUnknowException("connect",null,e))
      }
    })
  }

  function addCompany(req,res){        
    return new Promise((resolve,reject) => {
      try{  
        const companyCode = req.code;
        const urlStocksApi = 'https://api.iextrading.com/1.0/stock/'+ companyCode +'/batch?types=quote';        
        
        // Call the api to check if the company exists
        request(urlStocksApi, { json: true }, (err, res, body) => {
          if (err) { reject(new DataStoreUnknowException('GET',args,"Invalida API call"))}
          
          // If exists
          if (res.statusCode !== 404){                
            const companyName = res.body.quote.companyName;
            companyExists(companyCode).then(exists => {
              if (exists) reject(new DataStoreFieldValidationException(companyCode,`Company ${companyCode} code already exists`))
              let company = new Company(
                                {
                                 name: companyName,
                                 code: companyCode                             
                                })
            
              company.save((error, result) => {
                if (error) reject (new DataStoreUnknowException("insert",companyCode,error))
                resolve(result);
              })
            })    
          }else{ // Company doesn't exist       
            reject(new DataStoreFieldValidationException(companyCode,`Company ${companyCode} code doesn't exist`))
          }              
        });        
      }catch(e){
        reject(new DataStoreUnknowException("insert",companyCode,e));
      }
    })
  }

  function deleteCompany(companyCode){
    return new Promise((resolve,reject) => {
      try{        
        Company.deleteOne({code: companyCode})
            .exec((error,result) => {            
               if (error) reject(error);
               resolve({'log' : `Company ${companyCode} deleted`});
            }
        )
      }catch(e){
        reject(new DataStoreUnknowException("delete",companyCode,e));
      }
    })
  }

  // Check if the company code exists on the DB
  function companyExists(companyCode){
    return new Promise((resolve, reject)=>{
      try{      

        Company.find({code: companyCode})
            .exec((error,result) => {            
               if (error) reject(error);
               resolve(result.length > 0 ? true : false);
        })
      }catch(e){
        reject(new DataStoreFieldValidationException("company",companyCode,e));
      }
    })
  }

  function getStocks(){
      return new Promise((resolve,reject) => {
        try{
            Company.find({})
            .exec((error,result) => {
                if (error) reject(error);
                resolve(result);
            })
        }catch(e){
            reject(new DataStoreUnknowException ("GET",args,e));
        }        
      })
  }
  

  // Exception objects

  function DataStoreUnknowException (method,args,error) {
    this.type = this.constructor.name;
    this.description = 'Error happening during operation: ' + method;
    this.method = method;
    this.args = args;
    this.error = error;
  }
  function DataStoreFieldValidationException(field, error) {
    this.type = this.constructor.name;
    this.description = 'Error during proccesing field: ' + field;  
    this.error = error;
  }


  module.exports = {
    connect,
    addCompany,    
    getStocks,
    deleteCompany
  }