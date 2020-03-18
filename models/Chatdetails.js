var mongoose=require('mongoose');
var schema=mongoose.Schema;
var Chatdetails=new schema({
    from:String,
    to:String,
    message:String,
    imageurl:String,
    Read:Boolean,
    _id:String
},{
    _id:false
});
module.exports=mongoose.model('Chatdetails',Chatdetails,'Chatdetails');