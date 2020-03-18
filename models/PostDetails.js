var mongoose=require('mongoose');
var schema=mongoose.Schema;
var PostDetails=new schema({
    username:String,
    caption:String,
    _id:String,
    likes:String,
    comments:String,
    Imageurl:String
},{
    _id:false
});
module.exports=mongoose.model('PostDetails',PostDetails,'PostDetails');