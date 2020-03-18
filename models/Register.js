var mongoose=require('mongoose');
var schema=mongoose.Schema;
var Register=new schema({
    username:String,
    password:String,
    email:String,
    mobile:String,
    Friendslist:String,
    Country:String,
    ReadLater:String
});
module.exports=mongoose.model('Register',Register,'Register');