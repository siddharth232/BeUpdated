var mongoose=require('mongoose');
var schema=mongoose.Schema;
var ReadLater=new schema({
    username:String,
    title:String,
    _id:String
},{
    _id:false
});
module.exports=mongoose.model('ReadLater',ReadLater,'ReadLater');