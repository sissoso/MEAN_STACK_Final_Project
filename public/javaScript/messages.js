
var i=0;

var screenIdUrl;
var messagesArray=new Array();
var socket=io();
var dateFromCustom;
var hourFromCustom;
var screenFromCustom;
function start() {
    socket.emit('get screen num');
}
socket.on('load screen num',function(data){
   screenIdUrl=data;
    socket.emit('get messages',screenIdUrl);
});

socket.on('load messages socket', function (data) {
    messagesArray=(data);
    manageMessages(messagesArray);
});
function customStart(date,hour,screen){

    socket.emit('get all messages');
    dateFromCustom=date;
    hourFromCustom=hour.toString();
    screenFromCustom=screen.toString();
}
socket.on('load all messages', function (data) {
    messagesArray=(data);
    showMsgCustom(dateFromCustom,hourFromCustom,screenFromCustom,data);

});


/**
 * check if can display msg according to screenId in url
 * @param msg
 * @returns {boolean}
 */
function checkScreenId(msg) {

    if (msg.screenId.includes(screenIdUrl)){
        return true;
    }
    else
        return false;

}

/**
 * get the data messages from the page
 */
function getMessagesFromDb(){

    $.get('/loadMessagesId' , function (data,status){
        messagesArray= JSON.parse(data);
        manageMessages(messagesArray);
        console.log(status);
        }
    )

}

/**
function displayMsg(name){
    var day= new Date();
    switch(name){
        case "msg1" :
            if((day.getDay()==2 || day.getDay()==3) && (day.getFullYear()==2017) && (day.getHours()<=11 && day.getHours()>=5))
                return true ;
        case "msg2":
            if((day.getDay()==2 || day.getDay()==3) && (day.getFullYear()==2017) && (day.getHours()<=15&& day.getHours()>=9))
                return true ;
        case "msg3":
            if((day.getFullYear()==2017) && (day.getHours()<=21&& day.getHours()>=7) )
                return true ;
        case "msg4":
            if((day.getFullYear()==2017))
                return true ;
        case "msg5":
            if((day.getFullYear()==2017))
                return true ;


    }

}
**/
/**
 * check if can display the msg according to date
 * @param msg
 * @returns {boolean}
 */

function displayMsg(msg){
    //return the current date
   var day= new Date();
   if (msg.dates.day.includes(day.getDay().toString())
	   &&(msg.dates.year.includes(day.getFullYear()).toString())
		   &&(msg.dates.hours.includes(day.getHours().toString())))
    {
        return true;
    }

    return false;
}
//
function displayMsgCustom(customDate,hour,msg) {
    var day= new Date(customDate);

    if (msg.dates.day.includes(day.getDay().toString())
        &&(msg.dates.year.includes(day.getFullYear()).toString())
        &&(msg.dates.hours.includes(hour)))
    {
        return true;
    }

    return false;

}



function loadMsgWithTemplate(msg)
{
    console.log(msg.template);
    $("#result").load("./templates/"+msg.template , function (){


        $.each(msg.text , function(key,value)
        {
            $("#text"+(key+1)).append(value);
        })

        $.each(msg.img , function(key,value)
        {
            $("#img"+(key+1)).append('<img src="'+value+'"/> ');
        })


    });


}


/**
 *the recursive function. play the messages ;
 */
function manageMessages(messages){

    //if the index size is the array length=>i=0
    i=(messages.length==i)? 0 : i ;

    if (displayMsg(messages[i]) && checkScreenId(messages[i])) {
        loadMsgWithTemplate(messages[i]);
        timeoutForMsg(messages[i]);

    }

    else
    {
        i++;
        manageMessages(messages);

    }

}


/**
 * set the timeout according to the next msg
 */
function timeoutForMsgCustom(date,hour,screen,msg){
    i++;
    setTimeout(function(){
        showMsgCustom(date,hour,screen,messagesArray)

    },msg.time*1000)
}

function timeoutForMsg(msg){
    i++;
    setTimeout(function(){
        manageMessages(messagesArray)

    },msg.time*1000)
}

function showMsgCustom(date,hour,screen,messages){


    i=(messages.length==i)? 0 : i ;

    if (displayMsgCustom(date,hour,messages[i]) && messages[i].screenId.includes(screen)) {
        loadMsgWithTemplate(messages[i]);
        timeoutForMsgCustom(date,hour,screen,messages[i]);

    }

    else
    {
        i++;
        showMsgCustom(date,hour,screen,messages);

    }

}

