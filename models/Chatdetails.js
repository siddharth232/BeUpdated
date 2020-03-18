var mongoose=require('mongoose');
var schema=mongoose.Schema;
var Chatdetails=new schema({
    from:String,
    usercopy:String,
    to:String,
    message:String,
    imageurl:String,
    Read:Boolean,
    _id:String,
    post:Boolean,
    news:Boolean,
    score:Boolean,
    title:String
},{
    _id:false
});
module.exports=mongoose.model('Chatdetails',Chatdetails,'Chatdetails');