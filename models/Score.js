var mongoose=require('mongoose');
var schema=mongoose.Schema;
var Score=new schema({
    username:String,
    score:String
})
module.exports=mongoose.model('Score',Score,'Score');