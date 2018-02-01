

var express = require('express');
var app = express();
var bodyParser= require("body-parser");


app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());

var mongoClient = require('mongodb').MongoClient;
var url='mongodb://localhost:27017/messagesdb';
var ObjectId=require('mongodb').ObjectID;

var server=app.listen(8080);
var io=require('socket.io').listen(server);

var screenNum=' ';



//send all the massages





//send the screenId by sockets
io.sockets.on('connection',function (socket) {
    socket.on('get screen num',function(){
        io.sockets.emit('load screen num',screenNum);
    });

    socket.on('get all messages',function(){
        // Use connect method to connect to the Server
        mongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            }


            db.db('messagesdb').collection('messages').find('').toArray(function (err, doc) {
                if (err) {
                    console.log("error while loading messages from collection");
                }
                else {
                    io.sockets.emit('load all messages', doc);


                }
                db.close();
            });
        })
    })
    socket.on('get messages', function (screenId) {

        // Use connect method to connect to the Server
        mongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            }
            var query=function(screenId){
                if(screenId==''){ return '';}
                return "{screenId :"+screenId+"}" ;
            }
            console.log(query(screenId));
            db.db('messagesdb').collection('messages').find(query(screenId)).toArray(function (err, doc) {
                if (err) {
                    console.log("error while loading messages from collection");
                }
                else {
                    io.sockets.emit('load messages socket', doc);


                }
                db.close();
            });
        })
    })
});


/**
 * get the data messages from db and sent to the page  without Sockets.
 */
app.get ('/loadMessagesId', function (req,res) {
    //var screenId=parseInt(req.params.id);

    // Use connect method to connect to the Server
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }

         db.db('messagesdb').collection('messages').find().toArray(function (err,doc)
        {
            if(err)
            {
                console.log("error while loading messages from collection");
            }
            else
            {
               res.send(doc);


            }
            db.close();
        });



    })
})
/**
 * post message to the DB
 */
app.post('/loadMessagesId' , function (req , res) {
    console.log(req.body);
    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        try {
            db.db('messagesdb').collection('messages').insertOne(req.body,function (err,doc) {
                res.json(doc);
            });

        }catch(e){
        console.log("cannot add to db "+e)
        }
    });


});

/**
 * delete message from DB
 */
app.delete('/loadMessagesId/:id' , function (req,res) {
    var id= req.params.id;
    console.log(id);

    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        try {
            db.db('messagesdb').collection('messages').deleteOne({"_id" : ObjectId(id) },function (err,doc) {
                res.json(doc);
            });

        }catch(e){
            console.log("cannot delete msg from db "+e)
        }
    });

});

/**
 * get specific msg by id from the DB
 */
app.get('/loadMessagesId/:id' , function (req, res) {
    var id = req.params.id;
    console.log(id);

    mongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        try {
            db.db('messagesdb').collection('messages').findOne({"_id": ObjectId(id)}, function (err, doc) {
                res.json(doc);
            });

        } catch (e) {
            console.log("cannot get the cuurent msg from db " + e)
        }
    });

})
/**
 * update the msg in the DB
 */
app.put('/loadMessagesId/:id' , function(req,res){
    var id= req.params.id;
    console.log(req.body.name);


    mongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        try {
            db.db('messagesdb').collection('messages').findOneAndUpdate({"_id" : ObjectId(id) }, {$set: {"name" : req.body.name,
          "text" : req.body.text , "img" : req.body.img , "template" : req.body.template ,"time" : req.body.time , "dates" : req.body.dates}}
                , function (err, doc) {
                res.json(doc);
                })


        }catch(e){
            console.log("cannot Update the cuurent msg from db "+e)
        }
    });



})

/**
 * get the screen id and open the index.html
 */
    app.get('/screen=:id', function (req, res) {
   screenNum=req.params.id;

   // console.log(screenId);
    res.sendFile(__dirname + '/public/index.html');

});

//////////////////////////////
app.get ('/managment', function (req,res){
    res.sendFile(__dirname + '/public/views/managment.html');
});
app.get ('/displayByFilter', function (req,res){
    res.sendFile(__dirname + '/public/views/displayByFilter.html');
});