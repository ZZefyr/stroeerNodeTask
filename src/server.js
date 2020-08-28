const express = require('express');
const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const db = require('./database.js');
const logger = require('./logger.js');


module.exports = {
    apiPost : (action, callback) => { return app.post(action,callback) },
    apiGet : (action, callback) => { return app.get(action,callback) },
    parseJson : ()=> {return app.use(express.json())} ,
    run : ()=> {
        let server = app.listen(SERVER_PORT, () => {
            console.log(`Listening on port ${SERVER_PORT}`);
            serverControl(server);
            })
        }
    };

function serverControl(server){
    //on terminate, close server and redis connection
    process.on(process.env.TERMINATION_SIGNAL, () => {
        console.info(`${process.env.TERMINATION_SIGNAL} signal received.`);
        db.closeRedisConnection()
            .then(()=> {
            console.log("Closing redis connection, closing server...");
            server.close()
        }).catch((error)=> {
            logger.saveErrLog(error)
        })
    })
}

