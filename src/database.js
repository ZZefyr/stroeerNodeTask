const redis = require("redis");

const client = redis.createClient({
    port: 10547,
    host: 'redis-10547.c80.us-east-1-2.ec2.cloud.redislabs.com',
    password: 'P7XOZmP8pNU79AtJPWrHxTqzB2gsR1wi'
});

client.on("error", (error) => {
    console.error(error);
});


module.exports = {
    clearRedisValue: (req, res) => {
        const key = req.params.key;
        const resetValue = 0;
        client.get(key, (err, reply) => {
            if (reply) {
                client.set(key, resetValue, function (err, success) {
                    if (success)
                        res.send(`Value was cleared`);
                    else
                        res.send(`Value wasn't cleared ${err}`);
                });
            }
            else res.send(`Key ${key} doesn't exist`);
        })
    },

    increaseRedisValue: (key, req, res) => {
        if (req.body.hasOwnProperty(key)) {
            client.get(key, (err, reply) => {
                let reqCountValue = Number(req.body[key]);
                let countValue = Number(reply);
                countValue += reqCountValue;
                client.set(key, countValue, redis.print);
                res.send(`Value was increased by ${reqCountValue}`);
            });
        }
    },

    getRedisValue: (key, res) => {
        client.get(key, (err, reply) => {
            res.send("Current count value is: " + reply);
        })
    },
};