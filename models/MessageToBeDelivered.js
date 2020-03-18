var mongoose=require('mongoose');
var schema=mongoose.Schema;
var MessageToBeDelivered=new schema({
    from:String,
    to:String,
    message:String,
    imageurl:String,
    _id:String
},{
    _id:false
});
module.exports=mongoose.model('MessageToBeDelivered',MessageToBeDelivered,'MessageToBeDelivered');