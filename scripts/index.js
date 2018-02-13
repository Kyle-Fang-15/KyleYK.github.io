$(document).ready(function(){
  
  
 //real time
 function showTime(){

 
 var hours = new Date().getUTCHours();
 var minutes=new Date().getUTCMinutes();
 var pacificHours=hours-8;
 var easternHours=hours-5;
 var beijingHours=hours+8;
 if (pacificHours<0){
 	pacificHours+=24;
 }

if (pacificHours<10){
$("#pacific").html("0"+pacificHours);	
}else{
$("#pacific").html(pacificHours);	
}

 if (easternHours<0){
 	easternHours+=24;
 }
 if (easternHours<10){
$("#eastern").html("0"+easternHours);	
}else{
$("#eastern").html(easternHours);	
}

 if (beijingHours>24){
 	beijingHours-=24;
 }
if (pacificHours<10){
$("#beijing").html("0"+beijingHours);	
}else{
$("#beijing").html(beijingHours);	
}

 if (minutes<10){
   $("#times-digits-minutes1").html("0"+minutes);
   $("#times-digits-minutes2").html("0"+minutes);
   $("#times-digits-minutes3").html("0"+minutes);
}else{

$("#times-digits-minutes1").html(minutes);
$("#times-digits-minutes2").html(minutes);
$("#times-digits-minutes3").html(minutes);
   
}
setTimeout(showTime,1000);
}

showTime();



  
});