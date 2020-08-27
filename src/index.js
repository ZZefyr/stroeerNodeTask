const server = require('./server.js');
const db = require('./database.js');



server.start();
server.parseJson();

/* Api POST - count value*/
server.apiPost('/track', (req, res) => {
    db.increaseRedisValue('count', req, res);
});

/* Api POST - clear value*/
server.apiPost('/clear/:key', (req, res) => {
    db.clearRedisValue(req, res)
});

/* Api GET - get count value*/
server.apiGet('/count', (req, res) => {
    db.getRedisValue('count', res);
});




