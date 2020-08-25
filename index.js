const express = require('express');
const app = express();
const fs = require('fs');
const redis = require("redis");


const client = redis.createClient({
    port      : 10547,               // replace with your port
    host      : 'redis-10547.c80.us-east-1-2.ec2.cloud.redislabs.com',        // replace with your hostanme or IP address
    password : 'P7XOZmP8pNU79AtJPWrHxTqzB2gsR1wi'
});

client.on("error", function(error) {
    console.error(error);
});
let countValue = 0;

app.use(express.json());

app.post('/track', (req, res) => {
    fs.appendFile('log.txt', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        res.send('Saved!');
        if (req.body.hasOwnProperty('count')) {
            countValue +=req.body.count
            client.set("count", countValue, redis.print);
        }
    });
});

function showValue(value){
    return value;
}

app.get('/count', (req, res) => {
    /*Zde je třeba zavolat redis, aby vrátil hodnotu klíče count*/
   client.get("count", function(err, reply) {
       res.send("Count value is: " + showValue(reply));
    })
});
app.listen(3000, () => console.log('Listening on port 3000...'));