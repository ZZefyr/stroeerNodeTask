const fs = require('fs');
module.exports = {
    saveLog : (req) => {
        const log = fs.createWriteStream('log.txt', {flags: 'a'});
        log.write(`${new Date().toLocaleString()}, Request body:${JSON.stringify(req.body)}\n`);
        log.end();

        log.on('error',  (err) => {
            console.log(err);
        })
    },
};