var path=require("path");
var http=require("http");
var express=require("express");//needs to be downloaded
var socketIO=require("socket.io");//also needs download
//need way to see errors of nodejs
//need somewhere to install libraries

var publicPath=path.join(__dirname,'../client');//merges 2 paths together
var port=process.env.PORT||2010;//port server is using on computer
var app=express();
var server=http.createServer(app);//create server on app(express library)
var io=socketIO(server);//connecting socket.io library to server
app.use(express.static(publicPath));//sends client folder to each client who connects

//run server and make sure it started on port
server.listen(port, function(){
    console.log("Server started on port: "+port);
});

/*
function prin(anyString, callBack){
    console.log(anyString);
    callBack();
}
prin("LOL", function(){
    console.log("done");
});//*/

//stores client info in socket parameter
io.on('connection', function(socket){
    console.log('someone connected, ID: '+socket.id);
    socket.on('message', function(data){
        console.log(data);
    });
    socket.emit('messageFromServer', 'You are connected.');
})