const fs = require('fs');
const redis = require("redis");
const server = require('./server.js');


const client = redis.createClient({
    port      : 10547,               // replace with your port
    host      : 'redis-10547.c80.us-east-1-2.ec2.cloud.redislabs.com',        // replace with your hostanme or IP address
    password : 'P7XOZmP8pNU79AtJPWrHxTqzB2gsR1wi'
});

client.on("error", function(error) {
    console.error(error);
});
let countValue = 0;

server.parseJson();
server.start();

server.apiPost('/track', (req, res) => {
    fs.appendFile('log.txt', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        res.send('Saved!');
        if (req.body.hasOwnProperty('count')) {
            countValue +=req.body.count
            client.set("count", countValue, redis.print);
        }
    });
});

server.apiGet('/count', (req, res) => {
   client.get("count", function(err, reply) {
       res.send("Current count value is: " + reply);
    })
});
