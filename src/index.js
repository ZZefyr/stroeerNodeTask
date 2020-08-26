const server = require('./server.js');
const db = require('./database.js');
const logger = require('./logger.js');


server.start();
server.parseJson();

/* Api POST - count value*/
server.apiPost('/track', (req, res) => {
    logger.saveLog(req);
    db.increaseRedisValue('count', req, res);
});

/* Api POST - clear value*/
server.apiPost('/clear/:key', (req, res) => {
    db.clearRedisValue(req, res)
});

/* Api GET - get count value*/
server.apiGet('/count', (req, res) => {
    db.getRedisValue('count', res).then(handleResult).catch(handleError)
});

function handleError(reason) {
    console.error('error', reason);
}

function handleResult(result) {
    console.log('done', result);
}

