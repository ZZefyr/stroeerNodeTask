const logger = require('./logger.js');
const redis = require("redis");
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PW = process.env.REDIS_PW;

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
        //verify whether key, which should be cleared exists in redis
        getSavedValue(key)
        //if key exists, clear - set 0 as a value
            .then(() => clearRedisValue(key)
                .then(() => res.send(`"${key}" value was cleared`))
                .catch((error) => {
                    res.send(error);
                    logger.saveErrLog(error)
                }))
            .catch((error) =>{
                res.send(error);
                logger.saveErrLog(error)
        })
    },

    increaseRedisValue: (key, req, res) => {
        if (req.body.hasOwnProperty(key)) {
            //verify whether key, which should be increased exists in redis and get its value
            getSavedValue(key)
              //if key/value exists save value into variable called redis value and sum with requested value
                .then((redisValue) => increaseRedisValue(key, redisValue, Number(req.body[key]))
                    .then((value) => res.send(`Value was increased by ${value}`))
                    .catch((error) => {
                        res.send(error);
                        logger.saveErrLog(error)
                    }))
                .catch((error) => {
                    res.send(error);
                    logger.saveErrLog(error)
                });
        } else {
            res.send("Data saved");
        }
    },

    getRedisValue: (key, res) => {
        getSavedValue(key)
            .then(redisValue => res.send(`Current "${key}" value is: ${redisValue}`))
            .catch((error) => {
                res.send(error);
                logger.saveErrLog(error)
            })
    },

    closeRedisConnection: () => {
        return new Promise((resolve,reject)=>{
            //set value back to 0 and close connection to redis
            clearRedisValue('count',0)
                .then(client.quit((err) => {
                    if (err)
                       reject(err);
                    else
                        resolve()
                }));
        })

    }
};

function clearRedisValue(key) {
    return new Promise((resolve, reject) => {
        const value = 0;
        client.set(key, value, (err, success) => {
            if (success) {
                resolve()
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
                resolve(reqValue)
            } else {
                reject(`ERROR: For "${key}" wasn't increased value "${reqValue}"`)
            }
        })
    })
}

function getSavedValue(key) {
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

