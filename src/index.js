const fs = require('fs');
const redis = require("redis");
const server = require('./server.js');


const client = redis.createClient({
    port: 10547,               // replace with your port
    host: 'redis-10547.c80.us-east-1-2.ec2.cloud.redislabs.com',        // replace with your hostanme or IP address
    password: 'P7XOZmP8pNU79AtJPWrHxTqzB2gsR1wi'
});

client.on("error", function (error) {
    console.error(error);
});
let countValue;

server.parseJson();
server.start();

server.apiPost('/track', (req, res) => {
    saveLog(req);
    res.send('Saved!');
    if (req.body.hasOwnProperty('count')) {
        client.get("count", function (err, reply) {
            countValue = Number(reply);
            countValue += req.body.count;
            client.set("count", countValue, redis.print);
        });
    }
});

server.apiPost('/reset', (req, res) => {
    countValue = 0;
    client.set("count", countValue, redis.print);
    res.send("Value was cleared")
});

server.apiGet('/count', (req, res) => {
    client.get("count", function (err, reply) {
        res.send("Current count value is: " + reply);
    })
});


function saveLog(req) {
    const log = fs.createWriteStream('log.txt', {flags: 'a'});
    log.write(`${new Date().toLocaleString()}, Request body:${JSON.stringify(req.body)}\n`);
    log.end();

    log.on('error', function (err) {
        console.log(err);
    })
}