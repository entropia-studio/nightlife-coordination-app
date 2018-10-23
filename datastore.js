require('dotenv').config();
const moment = require('moment');
const mongoose = require('mongoose');

var MONGODB_URI = 'mongodb://'+process.env.USER_DB+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;

var meetingSchema = mongoose.Schema({      
    placeId    : {type: String, required: true, unique: false},
    userId     : {type: String, required: true, unique: false},
    locationId : {type: String, required: true, unique: false},
    date       : {type: Date, required: true, unique: false}
  })
  
const Meeting = mongoose.model('Meeting',meetingSchema);  

function connect(){
    return new Promise((resolve,reject) => {
      try{
        mongoose.connect(MONGODB_URI);
      }catch(e){
        reject(new DataStoreUnknowException("connect",null,e))
      }
    })
  }

  function addMeeting(req,res){        
    return new Promise((resolve,reject) => {
      try{  
        let meeting = new Meeting(req);
        meeting.save((error,result) => {
          if (error) reject (new DataStoreUnknowException("insert",companyCode,error))
                resolve(result);
        })
      }catch(e){
        reject(new DataStoreUnknowException("insert",companyCode,e));
      }
    })
  }

  function deleteMeeting(_id){
    return new Promise((resolve,reject) => {
      try{        
        Meeting.deleteOne({_id: _id})
            .exec((error,result) => {            
               if (error) reject(error);
               resolve({'log' : `Meeting ${_id} deleted`});
            }
        )
      }catch(e){
        reject(new DataStoreUnknowException("delete",companyCode,e));
      }
    })
  }  

  function getMeetings(){
      return new Promise((resolve,reject) => {
        try{            
            let today = moment().startOf('day');            
            Meeting.find({"date": {"$gte": new Date(today.toDate())}})
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
    addMeeting,    
    getMeetings,
    deleteMeeting
  }