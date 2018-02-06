/**
 dex.js
 * - All our useful JS goes here, awesome!
 */
$(document).ready(function(){
  var defaultTime=5;
  var flag=0; //0-stop; 1-working; 2-break
  var second=defaultTime*60;//the seconds
  var counter=null;
  var restCounter=null;
  var restTime=0;
  var percent=0;
$("#session-plus").on("click",function(){
  if (flag==1 || flag==2){return;}
  defaultTime++;
  $("#session-length").html(defaultTime);
  second=defaultTime*60;
  conver(defaultTime);
  $("#dy").css('height',0);
});

  
$("#session-minus").on("click",function(){
  if (flag===1 || flag===2){return;}
  if (defaultTime>0){
      defaultTime--;
      }
  
  $("#session-length").html(defaultTime);
  second=defaultTime*60;
  conver(defaultTime);
  $("#dy").css('height',0);
});


$(".stop").on("click", function(){
    flag=0; //0-stop, 2-pause
    defaultTime=5;
    second=defaultTime*60;
    percent=0;
    restTime=0;
   $("#hour").html("00");
   $("#minu").html("00");
   $("#seco").html("00");
   $("#break-length1").html("00");
   $("#break-length2").html("00");
   $("#break-length3").html("00");
   $("#session-length").html(defaultTime);
   $("#dy").css('height',percent+"%");
  
   
  
});
  
 $(".clock").on("click", function(){
  
  if (flag===0 || flag===2){
    flag=1;
    //0-stop, 2-pause
  }else if(flag===1){ // if flag=1
    flag=2;
  clearInterval(restCounter);
  restCounter=setInterval(rest,1000);
  }
  
  
  clearInterval(counter);
  counter=setInterval(duration,1000);

  
});
  


//function convert duriation in min to hr/min/sec and show it in the box

function conver(defaultTime){  //stats
   
     
   var hour=Math.floor(defaultTime/60);
   var minu=defaultTime-hour*60;
   if (hour<10){hour="0"+hour;}
   if (minu<10){minu="0"+minu;}
   $("#hour").html(hour);
   $("#minu").html(minu);
   $("#seco").html("00");
 }


function duration(){
   
   if (second<0){
     flag=0;
     return;
   }
   if (flag===0 || flag===2){ 
     //not counting
     
     return; 
   }
   var hour=0;
   var minu=0;
   var seco=0;
  var test=0;
   
   hour=Math.floor(second/3600);
   minu=Math.floor((second-hour*3600)/60);
   seco=second-hour*3600-minu*60;
   if (hour<10){hour="0"+hour;}
   if (minu<10){minu="0"+minu;}
   if (seco<10){seco="0"+seco;}
   $("#hour").html(hour);
   $("#minu").html(minu);
   $("#seco").html(seco);
   percent = (defaultTime*60-second)/(defaultTime*60)*100;
   $("#dy").css('height',percent+"%");
   second--;
   
        
      
            
            
         


 }
 
function rest(){
   
   if (flag===1 || flag===0){ 
     //not counting
     
     return; 
   }
   var hour=0;
   var minu=0;
   var seco=0;
   var test=0;
   
   hour=Math.floor(restTime/3600);
   minu=Math.floor((restTime-hour*3600)/60);
   seco=restTime-hour*3600-minu*60;
   if (hour<10){hour="0"+hour;}
   if (minu<10){minu="0"+minu;}
   if (seco<10){seco="0"+seco;}
   $("#break-length1").html(hour);
   $("#break-length2").html(minu);
   $("#break-length3").html(seco);
   restTime++; 

 }

  

});
