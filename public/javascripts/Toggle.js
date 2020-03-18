var count=0;
var category=document.getElementsByClassName('category');
var subcategory=document.getElementsByClassName('subcategory');
function toggle(){
    if(count%2==0){
       for(var i=0;i<category.length;i++)
         category[i].style.display='none';
        for(var i=0;i<subcategory.length;i++)
          subcategory[i].style.display='block';
        count++;
}else{
    for(var i=0;i<category.length;i++)
        category[i].style.display='block';
    for(var i=0;i<subcategory.length;i++)
        subcategory[i].style.display='none';
       count--;
}
}

function read(url){
  window.open(url,'_blank');
}