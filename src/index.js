const fs = require('fs');
const server = require('./server.js');
const db = require('./database.js');

server.parseJson();
server.start();

/* Api POST - count value*/
server.apiPost('/track', (req, res) => {
    saveLog(req);
    db.increaseRedisValue('count', req, res);
});

/* Api POST - clear value*/
server.apiPost('/clear/:key', (req, res) => {
    db.clearRedisValue(req, res)
});

/* Api GET - get count value*/
server.apiGet('/count', (req, res) => {
    db.getRedisValue('count', res)
});

function saveLog(req) {
    const log = fs.createWriteStream('log.txt', {flags: 'a'});
    log.write(`${new Date().toLocaleString()}, Request body:${JSON.stringify(req.body)}\n`);
    log.end();

    log.on('error',  (err) => {
        console.log(err);
    })
}
