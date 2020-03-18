var express = require('express');
var router = express.Router();
var Request=require('../models/PendingRequest');
var Register=require('../models/Register');
var PostDetails=require('../models/PostDetails');
var Chatdetails=require('../models/Chatdetails');
var ReadLater=require('../models/ReadLater');
var multer=require('multer');
var url=require('url');
var mongoose=require('mongoose');
var HomeContent=[];
var fileUrl;
var Friendslist=[];
var ReadLaterlist=[];
var Newsapi=require('newsapi');
var NewsAPI=new Newsapi('6ae4cd0b3aae48cc9f1c59fe752e6252');
var socketdetails={};
var msgtobedelivered=require('../models/MessageToBeDelivered');
var Chatdetails=require('../models/Chatdetails');
var onlinelist=[];
var app=require('../app');
var storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'C:/Users/siddh/Desktop/BeUpdated/public/images/PostUploads');
  },
  filename:function(req,file,cb){
    cb(null,file.originalname);
    fileUrl=file.originalname;
  }
});
var fileFilter=function(req,file,cb){
  if(file.mimetype=='image/jpeg'||file.mimetype=='image/png'){
    cb(null,true);
  }else{
    cb(null,false);
  }
}
var upload=multer({
  storage:storage,
  fileFilter:fileFilter
});

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true);
  }
   
    return (false);
}
/* GET home page. */

router.get('/register',function(req,res,next){
  res.render('SignUp');
});
router.post('/register',function(req,res,next){
 if(req.body.pass==req.body.cpass){
   if(ValidateEmail(req.body.email)){
     var details=new Register({
       username:req.body.uname,
       password:req.body.pass,
       email:req.body.email,
       mobile:req.body.mobile,
       Country:req.body.country
     });
     Register.findOne({username:req.body.uname}).exec(function(err,docs){
       if(docs){
         res.render('SignUp',{javascript:'Already Username Exist'});
       }else{
         details.save();
         res.render('LogIn',{javascript:'Successfully Registered.Log In To Continue'});
       }
     })
   }else{
     res.render('SignUp',{javascript:'Invalid Email'})
   }

 }else{
   res.render('SignUp',{javascript:'Password must be same'});
 }
})

router.get('/Home',function(req,res,next){
if(req.session.username){
  Register.findOne({username:req.session.username}).exec(function(err,docs){
    Friendslist=docs.Friendslist.split(',');
    Request.find({to:req.session.username}).exec(function(err,doc){
      Request.find({from:req.session.username}).exec(function(err,docum){
        PostDetails.find({}).exec(function(err,docs){
          docs.forEach(element => {
            if(Friendslist.indexOf(element.username)!=-1){
              HomeContent.push(element);
            } });
        
           res.render('Home',{HomeContent:JSON.stringify(HomeContent),Friendslist:JSON.stringify(Friendslist),toastcontent:JSON.stringify(doc),rec:JSON.stringify(docum)});
          })
         
        })
      
      

    //  res.send(JSON.stringify(HomeContent)+JSON.stringify(Friendslist));
     
    
    HomeContent=[];  
  })
  })
  }
  else{
  res.redirect('/');
  }
})
router.get('/logout',function(req,res,next){
  req.session.username=null;
  res.redirect('/');
})
router.post('/login',function(req,res,next){

  Register.findOne({username:req.body.username}).exec(function(err,doc){
    
    if(doc){
      
    if(doc.password==req.body.password)
    {
      
      req.session.username=req.body.username;
      res.redirect('/Home');
    }
    else{
      res.render('LogIn',{javascript:'Invalid Password'});
      
    }
  }else{
    res.render('LogIn',{javascript:'Ivalid Username'})
  }
  })
})
router.post('/PostDetails',upload.single('PostImage'),function(req,res,next){
  
  if(req.session.username){
    if(fileUrl){
    var Details=new PostDetails({
      username:req.session.username,
      caption:req.body.Caption,
      _id:new mongoose.Types.ObjectId().toHexString(),
      comments:'',
      likes:'',
      Imageurl:fileUrl
    });
    Details.save();
    fileUrl=null;
  }else{
    var Details=new PostDetails({
      username:req.session.username,
      caption:req.body.Caption,
      _id:new mongoose.Types.ObjectId().toHexString(),
      comments:'',
      likes:'',
      Imageurl:''
    });
    Details.save();
  
  }
    res.send('Sid');
}else{
    res.redirect('/');
  }
})
router.get('/DeletePending',function(req,res,next){
  if(req.session.username){
  Request.find({from:req.session.username,seen:true}).exec(function(err,doc){
     doc.forEach(element => {
       element.remove();
     });
  })}
  else{
    res.redirect('/');
  }
})
router.get('/Editlikes/:id',function (req,res,next) {
  if(req.session.username){
  var id=req.params.id;
  console.log(id);
  PostDetails.findOne({_id:id}).exec(function(err,docs) {
    console.log(docs);
    if(docs.likes)
    docs.likes=docs.likes+req.session.username+',';
    else
    docs.likes=req.session.username+',';
    docs.save();
  });
  res.send('Dislike');
}
else{
  res.redirect('/');
}
})
router.get('/AddComments/:id/:comment',function(req,res,next) {
  if(req.session.username){
  var username=req.session.username;
  var id=req.params.id;
  var comment=req.params.comment;
  PostDetails.findOne({_id:id}).exec(function(err,docs){
    if(docs.comments){
    var obj=JSON.parse(docs.comments);}else{
      var obj={};
    }
    obj[username]=comment;
   docs.comments=JSON.stringify(obj);
   docs.save();
  });
  PostDetails.findOne({_id:id}).exec(function(err,docs){
    if(docs.comments){
    var obj=JSON.parse(docs.comments);
    var string='';
    for(x in obj){
      string+='<p>'+x+":"+obj[x]+"</p>" ;
    }
    res.send(string);
  string='';}else{
      var string='No comments Found';
      res.send(string);
    }
  })
}
else{
  res.redirect('/');
}
});
var Newsapi=require('newsapi');
var NewsAPI=new Newsapi('6ae4cd0b3aae48cc9f1c59fe752e6252');
router.get('/News',function(req,res,next){
  if(req.session.username){
  NewsAPI.v2.topHeadlines({
   language:'en',

 }).then(function(response){
   req.session.username='Sid'; //change
   Register.findOne({username:req.session.username}).exec(function(err,docs){
   console.log(response.articles);
   res.render('NewsHome',{content:JSON.stringify(response.articles),ReadLater:docs.ReadLater,Friendslist:docs.Friendslist});
   })
 }); }
 else{
   res.redirect('/');
 }
 
  });
router.get('/News/country',function(req,res,next){
  if(req.session.username){
  Register.findOne({username:req.session.username}).exec(function(err,docs){
    
    NewsAPI.v2.topHeadlines({
      language:'en',
      country:docs.Country
   
    }).then(function(response){
    Register.findOne({username:req.session.username}).exec(function(err,docs){
    res.render('NewsHome',{content:JSON.stringify(response.articles),Friendslist:docs.Friendslist});});
   // res.send(docs.Country);
    });
    
  })}
  else{
    res.redirect('/');
  }
});
 router.get('/News/category/:category',function(req,res,next){
  if(req.session.username){
  NewsAPI.v2.everything({
    category:req.params.category,
    language:'en'
 
  }).then(function(response){
   // res.render('NewsHome',{content:JSON.stringify(response.articles)});
   Register.findOne({username:req.session.username}).exec(function(err,docs){
   res.send(JSON.stringify(response.articles))});
  });
}else{
  res.redirect('/');
}
 });
 router.get('/News/AddReadLater/:title',function(req,res,next){
if(req.session.username){
   Register.findOne({username:req.session.username}).exec(function(err,docs){
     docs.ReadLater+="|%|"+req.params.id;
     docs.save();
   })
   res.redirect('/News');
  }else{
    res.redirect('/');
  }
 })
router.get('/News/ReadLater',function(req,res,next){
  if(req.session.username){
  Register.findOne({username:req.session.username}).exec(function(err,docs){
    var titlearray=docs.ReadLater.split(',');
    for(var i=1;i<titlearray.length;i++){
      NewsAPI.v2.everything({
        qInTitle:titlearray[0],
        language:'en'
     
      }).then(function(response){
       // res.render('NewsHome',{content:JSON.stringify(response.articles)});
        ReadLaterlist.push(response.articles[0]);
        res.render('ReadLater',{content:JSON.stringify(ReadLaterlist),Friendslist:docs.Friendslist});
      });
    }
  })}
  else{
    res.redirect('/');
  }
})
router.get('/Chat',function(req,res,next){
  if(req.session.username){
  var username=req.session.username;
Register.findOne({username:username}).exec(function(er,docs){
  res.render("Chat",{listcontent:docs.Friendslist,chatcontent:'No Username is selected',username:username});
 
})

  }else{
    res.redirect('/');
  }
  
 
})
router.get('/Chat/:uname',function(req,res,next){
  if(req.session.username){
  var to=req.params.uname;
  var from=req.session.username;
  Chatdetails.find({usercopy:from}).exec(function(err,docs){
  if(docs){
    Register.findOne({username:from}).exec(function(err,doc){
    res.render('ChatRoom',{Friendslist:doc.Friendslist,content:JSON.stringify(docs),tousername:to,fromusername:from});
  
 })}else{
    Register.findOne({username:from}).exec(function(err,doc){
      res.render('ChatRoom',{Friendslist:doc.Friendslist,info:'Say Hi To Start The Conversation',tousername:to,fromusername:from});
     
    })
   }
  })}
  else{
    res.redirect('/');
  }
 
})

router.get('/',function(req,res,next){
  res.render('LogIn');
})

router.post('/SharePost',function(req,res,next){
 res.send(req.body.friends);
})
router.post('/PostNews/:title',function(req,res,next){
var title=req.params.title;
NewsAPI.v2.everything({
  language:'en',
  qInTitle:title
}).then(function(response){
  var details=new PostDetails({
    username:req.session.username,
    caption:response.articles[0].url,
    _id:new mongoose.Types.ObjectId().toHexString(),
    likes:'',
    comments:'',
    Imageurl:response.articles[0].urlTOImage
  });
  details.save();
})
res.send('Successfully Posted');
});
router.get('/Profile',function(req,res,next){
  if(req.session.username){
  PostDetails.find({username:req.session.username}).exec(function(err,docs){
    res.render('/Profile',{content:JSON.stringify(docs),username:req.session.username});
  })}
  else{
    res.redirect('/');
  }
})
router.get('/SearchProfile/:username',function(req,res,next){
  if(req.session.username){
  PostDetails.find({username:req.params.username}).exec(function(err,docs){
    console.log(JSON.stringify(docs));
    Register.findOne({username:req.params.username}).exec(function(err,doc){
      Register.findOne({username:req.session.username}).exec(function(err,doct){
        Request.find({from:req.session.username}).exec(function(err,docm){
          res.render('SearchProfile',{contents:JSON.stringify(docs),username:req.session.username,ucontent:JSON.stringify(doc),to:req.params.username,friends:JSON.stringify(doct.Friendslist),pending:JSON.stringify(docm)});
        })
        
      })
      
    })
   
  })}else{
    res.redirect('/');
  }
})
router.get('/Delete/:id',function(req,res,next){
  if(req.session.username){
  PostDetails.findOneAndRemove({_id:req.params.id});
  res.send('Succesfully Deleted');
  }else{
    res.redirect('/');
  }
})
router.get('/Profile/SavedArticles',function(req,res,next){
  if(req.session.username){
  Register.findOne({username:req.session.username}).exec(function(err,doc){
    var content=[];
    var titlearray=doc.ReadLater.split(',');
    for(var i=0;i<titlearray.length;i++){
      NewsAPI.v2.everything({
        language:'en',
        qInTitle:titlearray[i]
      }).then(function(Response){
        content.push(Response[0].articles);
        if(i==titlearray.length-1){
          res.render('ProfileSavedArticles',{content:JSON.stringify(content),Friendslist:docs.Friendslist});
        }
      })
    }
    
  })}else{
    res.redirect('/');
  }
})
router.get('/Game',function(req,res,next){
  if(req.session.username){
    console.log(req.session.username);
  Register.findOne({username:req.session.username}).exec(function(err,doc){
    console.log(doc.Friendslist);
    res.render('Game',{Friendslist:doc.Friendslist});
  })
}else{
  res.redirect('/');
}
})
router.get('/FriendsList/:value',function(req,res,next){
  if(req.session.username){
  var list='<ul>';
  var enteredvalue=req.params.value.toUpperCase();
  Register.find({}).exec(function(err,docs){
     for(var i=0;i<docs.length;i++){
       if(docs[i].username.toUpperCase().indexOf(enteredvalue)>-1){
         list+="<li onclick='window.location.href=\"/SearchProfile/"+docs[i].username+"\"'>"+docs[i].username+'</li>';
       }
     }
     list+='</ul>';
     console.log(list+'change');
     res.send(list);
  })}
  else{
    res.redirect('/');
  }
})
router.get('/Request/:from/:to',function(req,res,next){
  if(req.session.username){
 var details=new Request({
   from:req.params.from,
   to:req.params.to,
   seen:false,
   _id:new mongoose.Types.ObjectId().toHexString()
 })
 details.save();
 res.send('<h2 id="sinfo">Request Already Sent</h2>');
}else{
  res.redirect('/');
}
})
router.get('accept/:id',function(req,res,next){
  if(req.session.username){
  Request.find({_id:req.params.id}).exec(function(err,doc){
    doc.seen=true;
    doc.save();
    Register.findOne({username:req.session.username}).exec(function(err,docs){
      var arr=docs.Friendslist.split(',');
      arr.push(doc.from);
      var string=arr.toString();
      docs.Friendslist=string;
      docs.save();
      Register.findOne({username:doc.from}).exec(function(err,d){
        var arr=d.Friendslist.split(',');
        arr.push(req.session.username);
        var string=arr.toString();
        d.Friendslist=string;
        d.save();
        res.send('Accepted Your Friend\'s Request');
      })
    })
  })}
  else{
    res.redirect('/');
  }
})
router.get('/Deleterequest/:id',function(req,res,next){
  if(req.session.username){
  Request.findByIdAndRemove({_id:req.params.id}).exec(function(err,doc){
    doc.remove();
    res.send('Deleted Your Friends Request');
  })}
  else{
    res.redirect('/');
  }
})


module.exports = router;
