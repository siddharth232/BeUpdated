var mongoose=require('mongoose');
var schema=mongoose.Schema;
var PendingRequest=new schema({
    from:String,
    to:String,
    seen:Boolean,
    _id:String
},{
    _id:false
});
module.exports=mongoose.model('PendingRequest',PendingRequest,'PendingRequest');