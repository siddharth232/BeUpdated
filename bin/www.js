
var app = require('../app');
var debug = require('debug')('final:server');
var http = require('http');
var userlist={};
var mongoose=require('mongoose');
var chatdetails=require('../models/Chatdetails');
var postdetails=require('../models/PostDetails');
var Newsapi=require('newsapi');
var NewsAPI=new Newsapi('6ae4cd0b3aae48cc9f1c59fe752e6252');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io=require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
  socket.on('user image',function(data){
   
    if(userlist[data.to]){
    userlist[data.to].emit('add image',{image:data.image,from:data.from,to:data.to});
    userlist[data.from].emit('add image',{image:data.image,from:data.from,to:data.to});
    var details=new chatdetails({
      from:data.from,
      to:data.to,
      usercopy:data.from,
      message:'',
      imageurl:data.image,
      Read:true,
      post:false,
      news:false,
      score:false,
      title:'',
      _id:new mongoose.Types.ObjectId().toHexString(),
    });
    details.save();
    var details=new chatdetails({
      from:data.from,
      to:data.to,
      usercopy:data.to,
      message:'',
      imageurl:data.image,
      Read:true,
      post:false,
      news:false,
      score:false,
      title:'',
      _id:new mongoose.Types.ObjectId().toHexString()
    });
    details.save();
    }
    else{
    userlist[data.from].emit('Warning',data.to+' went offline');
    var details=new chatdetails({
      from:data.from,
      to:data.to,
      usercopy:data.from,
      message:'',
      imageurl:data.image,
      Read:false,
      score:false,
      post:false,
      news:false,
      title:'',
      _id:new mongoose.Types.ObjectId().toHexString(),
    });
    details.save();
    var details=new chatdetails({
      from:data.from,
      to:data.to,
      usercopy:data.to,
      message:'',
      score:false,
      imageurl:data.image,
      Read:false,
      post:false,
      news:false,
      title:'',
      _id:new mongoose.Types.ObjectId().toHexString()
    });
    details.save();
    }
   })
  socket.on("send message",function(data){
  
   
   if(userlist[data.to]){
   
   userlist[data.to].emit('new message',{message:data.message,from:data.from});
   userlist[data.from].emit('new message',{message:data.message,from:data.from});
   var details=new chatdetails({
     from:data.from,
     to:data.to,
     usercopy:data.from,
     message:data.message,
     imageurl:'',
     score:false,
     Read:true,
     _id:new mongoose.Types.ObjectId().toHexString(),
       post:false,
       news:false,
       title:false,
   })
   details.save();
   var details=new chatdetails({
    from:data.from,
    to:data.to,
    usercopy:data.to,
    message:data.message,
    imageurl:'',
    Read:true,
    _id:new mongoose.Types.ObjectId().toHexString(),
      post:false,
      score:false,
      news:false,
      title:false,
  })
  details.save();
  }
   else{
    userlist[data.from].emit('Warning', data.to+' went Offline!!');
    userlist[data.from].emit('new message',{message:data.message,from:data.from})
     var details=new chatdetails({
       from:data.from,
       to:data.to,
       score:false,
       message:data.message,
       imageurl:'',
       Read:false,
       _id:new mongoose.Types.ObjectId().toHexString(),
       post:false,
       news:false,
       title:false,
       usercopy:data.from,
     });
     details.save();
     var details=new chatdetails({
      from:data.from,
      to:data.to,
      score:false,
      message:data.message,
      imageurl:'',
      Read:false,
      _id:new mongoose.Types.ObjectId().toHexString(),
      post:false,
      news:false,
      title:false,
      usercopy:data.to,
    });
    details.save();
   }
  })
  socket.on('new user',function(data){
    socket.nickname=data;
    userlist[socket.nickname]=socket;
    console.log(socket.nickname);
   
  })
  socket.on('Share Post',function(data){
    
    postdetails.findOne({_id:data.id}).exec(function(err,doc){
        JSON.parse(data.list).forEach(element => {
          if(userlist[element]){
            userlist[element].emit('Shared Post',{message:JSON.stringify(doc),to:element,from:data.from});
            userlist[data.from].emit('Shared Post',{message:JSON.stringify(doc),to:element,from:data.from});
            var details=new chatdetails({
              from:data.from,
              to:element,
              usercopy:data.from,
              message:doc.caption+'|%|'+doc.likes+'|%|'+doc.comments+'|%|'+doc._id,
              imageurl:doc.Imageurl,
              title:doc.username,
              score:false,
              
              post:true,
              news:false,
              Read:true,
              _id:new mongoose.Types.ObjectId().toHexString()});
            details.save();
            var details=new chatdetails({
              from:data.from,
              to:element,
              score:false,
              usercopy:element,
              message:doc.caption+'|%|'+doc.likes+'|%|'+doc.comments+'|%|'+doc._id,
              imageurl:doc.Imageurl,
              title:doc.username,
              
              post:true,
              news:false,
              Read:true,
              _id:new mongoose.Types.ObjectId().toHexString()});
            details.save();
          }else{
            var details=new chatdetails({
              from:data.from,
              to:element,
              score:false,
              usercopy:data.from,
              message:doc.caption+'|%|'+doc.likes+'|%|'+doc.comments+'|%|'+doc._id,
              imageurl:doc.Imageurl,
              title:doc.username,
              
              post:true,
              news:false,
              Read:false,
              _id:new mongoose.Types.ObjectId().toHexString()});
            details.save();
            var details=new chatdetails({
              from:data.from,
              to:element,
              usercopy:element,
              message:doc.caption+'|%|'+doc.likes+'|%|'+doc.comments+'|%|'+doc._id,
              imageurl:doc.Imageurl,
              title:doc.username,
              
              post:true,
              news:false,
              score:false,
              Read:false,
              _id:new mongoose.Types.ObjectId().toHexString()});
            details.save();
          }
        });
    })
  })
  socket.on('Share News',function(data){
    NewsAPI.v2.everything({
      qInTitle:data.title,
      language:'en'
    })
  .then(function(response){
    
    var array=JSON.parse(data.list);
    array.forEach(function(element){
      if(userlist[element]){
      userlist[element].emit('Shared News',{content:JSON.stringify(response.articles[0]),to:element,from:data.from});
      userlist[data.from].emit('Shared News',{content:JSON.stringify(response.articles[0]),to:element,from:data.from})
      var details=new chatdetails({
        from:data.from,
        to:element,
        score:false,
        usercopy:data.from,
        message:JSON.stringify(response.articles[0]),
        imageurl:'',
        title:'',
        
        post:false,
        news:true,
        Read:true,
        _id:new mongoose.Types.ObjectId().toHexString()});
      details.save();
      var details=new chatdetails({
        from:data.from,
        to:element,
        score:false,
        usercopy:element,
        message:JSON.stringify(response.articles[0]),
        imageurl:'',
        title:'',
        
        post:false,
        news:true,
        Read:true,
        _id:new mongoose.Types.ObjectId().toHexString()});
      details.save();
    }else{
      var details=new chatdetails({
        from:data.from,
        to:element,
        score:false,
        usercopy:data.from,
        message:JSON.stringify(response.articles[0]),
        imageurl:'',
        title:'',
        
        post:false,
        news:true,
        Read:false,
        _id:new mongoose.Types.ObjectId().toHexString()});
      details.save();
      var details=new chatdetails({
        from:data.from,
        to:element,
        usercopy:element,
        message:JSON.stringify(response.articles[0]),
        imageurl:'',
        score:false,
        title:'',
        post:false,
        news:true,
        Read:false,
        _id:new mongoose.Types.ObjectId().toHexString()});
      details.save();
    }
  });
})
})
    socket.on('Share Score',function(data){
      console.log('In backend emitting');
      //console.log(userlist['Sid']);
      //console.log(userlist['Ram']);
     var arr=data.list.split(',');
     arr.forEach(function(element){
       console.log(element);
       console.log(element)
       console.log(userlistelement);
       //console.log(userlist['Sid']);
       console.log(userlist['Ram']);
       if(userlist[element]){
        userlist[element].emit('Share Score',{content:data.src,to:element,from:data.from});
        userlist[data.from].emit('Share Score',{content:data.src,to:element,from:data.from});
        var details=new chatdetails({
          from:data.from,
          to:element,
          score:true,
          usercopy:data.from,
          message:'',
          imageurl:data.src,
          title:'',
          
          post:false,
          news:false,
          Read:true,
          _id:new mongoose.Types.ObjectId().toHexString()});
        details.save();
        var details=new chatdetails({
          from:data.from,
          to:element,
          score:true,
          usercopy:element,
          message:'',
          imageurl:data.src,
          title:'',
          
          post:false,
          news:false,
          Read:true,
          _id:new mongoose.Types.ObjectId().toHexString()});
        details.save();
      }else{
        var details=new chatdetails({
          from:data.from,
          to:element,
          score:true,
          usercopy:data.from,
          message:'',
          imageurl:data.src,
          title:'',
          
          post:false,
          news:false,
          Read:false,
          _id:new mongoose.Types.ObjectId().toHexString()});
        details.save();
        var details=new chatdetails({
          from:data.from,
          to:element,
          usercopy:element,
          message:'',
          imageurl:data.src,
          score:true,
          title:'',
          post:false,
          news:false,
          Read:false,
          _id:new mongoose.Types.ObjectId().toHexString()});
        details.save();
      }
       
    });
    })
  
  
  socket.on('disconnect',function(data){
    delete userlist[socket.nickname];
   
  })
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
