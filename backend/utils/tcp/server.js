const net = require('net');

const server = net.createServer((socket)=>{

    socket.on("data",(data)=>{
        console.log(data.toString())
        socket.write('Понг!!!')
    });
    socket.on("close",()=>{
        console.log("Connection closed.!!!")
    })
});

module.exports = server;