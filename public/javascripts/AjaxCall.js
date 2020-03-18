function like(id) {
    //console.log(id);
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
      document.getElementById('lbtn'+id).innerHTML=this.responseText;
    };
    xmlhttp.open('GET','/Editlikes/'+id,true);
    xmlhttp.send();
    }
function Addcomments(id) {
    var comment=document.getElementById('usercmt'+id).value;
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
      document.getElementById('cmtbox'+id).innerHTML=this.responseText;
    };
    xmlhttp.open('GET','AddComments/'+id+'/'+comment,true);
    xmlhttp.send();
}
function Delete(id){
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function(){
    console.log(this.responseText);
  };
  xmlhttp.open('GET','/Delete/'+id,true);
  xmlhttp.send();

}