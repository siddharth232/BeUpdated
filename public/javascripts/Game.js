var c = document.getElementById('gcanvas').getContext("2d");
var canvas=document.getElementById('gcanvas');
var screenshotURL;
var img;
var socket=io.connect('http://localhost:3000');
console.log('script');
function makeSquare(x, y, length, speed) {
  return {
    x: x,
    y: y,
    w: length,
    h:length+5,
    s: speed,
    draw: function() {
      c.fillRect(this.x, this.y, this.w, this.h);

    }
  };
}
function makeenemy(x,y,radius,speedx,speedy,strength){
  return{
    x:x,
    y:y,
    r:radius,
    sx:speedx,
    sy:speedy,
    num:strength,
    num2:strength,
    
    draw: function(){
      c.beginPath();
      c.arc(this.x,this.y,this.r,0,2*Math.PI,true);
      c.fill();
      c.fillStyle="#FFFFFF";
      c.font = '10px Arial';
      c.fillText(this.num,this.x-6,this.y+3);
    }
  }
}
function makearrayenemy(){
  if (Math.floor(Math.random() * 2)) {
    var enemyX=0;
  }else{
    var enemyX=gcanvas.width;
  }
  var enemysize=10;
  var enemyY=Math.floor(Math.random() * (3*gcanvas.height/4));
  var enemyspeedx=1;
  var enemyspeedy=1;
  var strength=Math.floor(Math.random() * 50)*2;
  enemies.push(makeenemy(enemyX,enemyY,enemysize,enemyspeedx,enemyspeedy,strength));
}
function maketank(x,y,w,h,s){
  return{
    x:x,
    y:y,
    w:w,
    h:h,
    s:s,
    draw:function(){
    c.drawImage(img,this.x,this.y,this.w,this.h);

  }
  };
}
   

  var tank=maketank(gcanvas.width/2,gcanvas.height-30,30,30,10);
 // var bullet = makeSquare(0,0, 2, 5);
  var shooting = false;
  var right = false;
  var left = false;
  var space=false;
  var enemies=[];
  var bullets=[];
  var time;
  var timegap=10000;
  var name;
  var score=0;
  var arscore=[];
  document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
 function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        left = true;
    }
    if (e.keyCode == 32) { // SPACE
         shoot();   
  }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        right = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        left = false;
    }
}
function shoot() {
 // if (!shooting) {
 //   shooting = true;
    bullets.push(makeSquare(0,0, 2, 5));
    bullets[bullets.length-1].x=tank.x+tank.w/2;
    bullets[bullets.length-1].y=tank.y+tank.h/2;

 //   bullet.x = tank.x + tank.w/2;
 //   bullet.y = tank.y + tank.h/2 ;

//  }
}

function isWithin(a, b, c) {
  return (a > b && a < c);
}
function isColliding(a, b) {
  var result = false;
  if (isWithin(a.x, (b.x-b.r), (b.x + b.r)) || isWithin(a.x + a.w, (b.x-b.r), (b.x + b.r))) {
    if (isWithin(a.y, b.y-b.r, b.y + b.r) || isWithin(a.y + a.h, b.y-b.r, b.y + b.r)) {
      result = true;
    }
  }
  return result;
}

function draw(){ 
   
  var gameover=false;
  c.clearRect(0,0,gcanvas.width,gcanvas.height);
  enemies.forEach(function(enemy){
    enemy.x+=enemy.sx;
    enemy.y+=enemy.sy;
    if (enemy.x<0||enemy.x>(enemy.r+gcanvas.width)) {
      enemy.sx=-enemy.sx;
    }
    if (enemy.y<0||enemy.y>(enemy.r+gcanvas.height) ){
      enemy.sy=-enemy.sy;
    }
      c.fillStyle = '#00FF00';
      enemy.draw();
  });
  enemies.forEach(function(enemy, i) {
    if (isColliding(tank,enemy)) {
      gameover = true;
        
          var arr=[];
          arr.push({sc:score});
          localStorage.setItem('sta', JSON.stringify(arr));
            
    }
  });
  if(right){
    tank.x+=tank.s;
    console.log("sid");
  }
  if(left){
    tank.x-=tank.s;
    console.log("sid");
  }
  if (tank.x<0) {
    tank.x=0;
  }
  if(tank.x>(gcanvas.width-tank.w)){
    tank.x=gcanvas.width-tank.w;
  }
  c.fillStyle="#000000";
  tank.draw();

    bullets.forEach(function(bullet,i1){ 
    bullet.y-=bullet.s;
    enemies.forEach(function(enemy,i){
      if(isColliding(bullet,enemy)){
          if(enemy.num>1){enemy.num--;
             //     bullet.splice(i,1);  
          }
          else{
           
               var enemyX=enemy.x;
               var enemyspeedx=1;
               var enemyY=enemy.y;
               var enemyspeedy=1;
               var enemysize=10;
               if(enemy.num%2==0){
               var strength=enemy.num2/2;}
               else{
                var strength=(enemy.num2-1)/2;
               }
               if(strength!=0){
              enemies.push(makeenemy(enemyX,enemyY,enemysize,enemyspeedx,enemyspeedy,strength));
              enemies.push(makeenemy(enemyX,enemyY,enemysize,-enemyspeedx,enemyspeedy,strength));
              }
            enemies.splice(i,1);
            
            }
       //   shooting=false;
          score++;
          bullet.s+=0.25;
          bullets.splice(i1,1);
      }
    });
  
   // if (bullet.y < 0 ) {
   //   shooting = false;
 //   } 
    c.fillStyle="#000000";
    bullet.draw();
}); 
  c.fillStyle = '#000000';
  c.font = '10px Bradley Hand ITC';
  c.textAlign = 'left';
  c.fillText('Score: ' + score, 1, 7);
  if(gameover){
    gameover1();
  }
  else{
     window.requestAnimationFrame(draw);
  }
}

function startgame(){
     time= setInterval(makearrayenemy, timegap);
     draw();
}
function gameover1(){
   c.clearRect(0,0,gcanvas.width,gcanvas.height);
   clearInterval(time);
    c.font="30px Bradley Hand ITC";
  c.fillStyle="#000000";
   c.fillText("Game Over!",70,40);
   c.font="20px Bradley Hand ITC"
   c.fillText("Scorboard",100,60);
  
  c.font="15px Bradley Hand ITC";
   arscore=JSON.parse(localStorage.getItem('sta'));
  
  
    x=80;
    dx=12.5;
  
    c.fillText("You Have Scored :"+arscore[0].sc,90,x);
    localStorage.clear();
    screenshotURL=canvas.toDataURL();
    console.log(screenshotURL);
    document.getElementById('gshare').style.display='inline-block';
  
}
function start(){
  img = new Image();
  img.src="/images/tanks.png";
  console.log('first loop');
  img.onload=function()
  {   
   document.getElementById("gindex").style.display="none";
    document.getElementById("gcanvas").style.display="inline-block";
    console.log('second loop');
    startgame();
   }
 
}
function Senderlist(){
  var friendsarray=document.getElementsByName('friends');
  var array=[];
  friendsarray.forEach(function(e){
    if(e.checked){
      array.push(e.value);
    }
  })
  if(array.length!=0){
  socket.emit('Share Score',{list:JSON.stringify(array),from:username,src:screenshotURL})
  console.log('in emiting');
  }else{
    alert('No Friends are Selected');
  }
}

console.log('last')
gcanvas.focus();
