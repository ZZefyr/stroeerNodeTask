const redis = require("redis");

const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PW =  process.env.REDIS_PW;

const client = redis.createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PW
});

client.on("error", (error) => {
    console.error(error);
});

module.exports = {
    clearRedisValue: (req, res) => {
        const key = req.params.key;
        getRedisValue(key)
            .then(() => {
                clearRedisValue(key,0).then(()=>{res.send(`"${key}" value was cleared`)})
            }).catch((error) => {
                res.send(error)
            })
            .catch((error) => {
                res.send(error)
            });
        },

    increaseRedisValue:  (key, req, res) => {
        if (req.body.hasOwnProperty(key)) {
            getRedisValue(key)
                .then((redisValue) => {
                    increaseRedisValue(key, redisValue, Number(req.body[key])).then((value) => {
                        res.send(`Value was increased by ${value}`);
                    }).catch((error) => {
                        res.send(error)
                    });
                }).catch((error) => {
                    res.send(error)
                });
        } else {
            res.send(`Saved`);
        }
    },

    getRedisValue: (key, res) => {
        getRedisValue(key).then(redisValue => {
            res.send(`Current "${key}" value is: ${redisValue}`)
        }).catch((error) => {
            res.send(error)
        });
    },
};

function clearRedisValue(key,value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err, success) => {
            if (success) {
                resolve(value)
            } else {
                reject(`ERROR: For "${key}" wasn't cleared value`)
            }
        })
    })
}

function increaseRedisValue(key, value, reqValue) {
    return new Promise((resolve, reject) => {
        const reqCountValue = reqValue;
        let countValue = value;
        countValue += reqCountValue;
        client.set(key, countValue, (err, success) => {
            if (success) {
                resolve(value)
            } else {
                reject(`ERROR: For "${key}" wasn't increased value "${value}"`)
            }
        })
    })
}

function getRedisValue(key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
            if (reply) {
                resolve(Number(reply));
            } else {
                reject(`ERROR: Key "${key}" does not exist`)
            }
        })
    })
}

