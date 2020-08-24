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


app.use(express.json());

app.post('/track', (req, res) => {
    fs.appendFile('log.txt', JSON.stringify(req.body), function (err) {
        if (err) throw err;
        res.send('Saved!');
        if (req.body.hasOwnProperty('count')) {
            client.set("count", req.body.count, redis.print);
        }
    });
});

app.get('/count', (req, res) => {
    /*Zde je třeba zavolat redis, aby vrátil hodnotu klíče count*/
    let countValue = client.get("count", redis.print);
    res.send(countValue);
});
app.listen(3000, () => console.log('Listening on port 3000...'));