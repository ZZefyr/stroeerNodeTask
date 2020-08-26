const redis = require("redis");

const client = redis.createClient({
/*ToDo Vytáhnout do env*/
    port: 10547,
    host: 'redis-10547.c80.us-east-1-2.ec2.cloud.redislabs.com',
    password: 'P7XOZmP8pNU79AtJPWrHxTqzB2gsR1wi'
});

client.on("error", (error) => {
    console.error(error);
});


module.exports = {
    clearRedisValue: async (req, res) => {
        const key = req.params.key;
        const resetValue = 0;
        await client.get(key, (err, reply) => {
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

    increaseRedisValue: async (key, req, res) => {
        if (req.body.hasOwnProperty(key)) {
            await client.get(key, (err, reply) => {
                if (err) throw new Error(err);
                else {
                    const reqCountValue = Number(req.body[key]);
                    let countValue = Number(reply);
                    countValue += reqCountValue;
                    client.set(key, countValue, redis.print);
                    res.send(`Value was increased by ${reqCountValue}`);
                }
            });
        }
        else {
            res.send(`Saved`);
        }
    },

    getRedisValue: async (key, res) => {
        let getRedisValue = new Promise ((resolve, reject)=> {
            client.get(key, (err, reply) => {
                if(reply)
                resolve(reply);
                else
                reject(`Key "${key}" does not exist`)
            })
        });
        let result = await getRedisValue;
        if (result){
        res.send(`Current "${key}" value is: ${result}`)
        }
    },
};