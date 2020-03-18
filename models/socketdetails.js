var mongoose=require('mongoose');
var schema=mongoose.Schema;
var details=new schema({
    username:String,
    socketobject:Object
});
module.exports=mongoose.model('Socket',details,'Socketdetails');