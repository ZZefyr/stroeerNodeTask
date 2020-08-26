const fs = require('fs');
module.exports = {
    saveLog : (req) => {
        saveLog(req)
            .then(()=>console.log("Log record was saved"))
            .catch((err)=> console.log(err));

    },
};

function saveLog(req) {
    return new Promise((resolve, reject) => {
        const log = fs.createWriteStream('log.txt', {flags: 'a'});
        log.write(`${new Date().toLocaleString()}, Request body:${JSON.stringify(req.body)}\n`);
        log.end();
        log.on('finish',  () => {
            const logFinished = true;
            resolve(logFinished);
        });
        log.on("error", (err => {
            reject(err);
        }));
    })
}