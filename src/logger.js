const fs = require('fs');
module.exports = {
    saveLog : (reqData) => {
        saveLog(reqData)
            .then(()=>console.log("Log record was saved"))
            .catch((err)=> console.log(err));

    },
    saveJsonData : (reqData, file) => {
        verifyIfJsonFileExists(file)
            .then(()=>saveJson(reqData, file)
                .catch((err)=>console.log(err)))

            .catch(()=>createJsonFile(file)
                .then(()=>saveJson(reqData, file)
                    .catch((err)=>console.log(err)))
                .catch((err)=>console.log(err))
            )
    },
};

function saveLog(reqData, file) {
    return new Promise((resolve, reject) => {
        const log = fs.createWriteStream(file, {flags: 'a'});
        log.write(`${new Date().toLocaleString()}, Request body:${JSON.stringify(reqData.body)}\n`);
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

function saveJson(reqData, file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            let json = JSON.parse(data);
            json.push(reqData.body);
            fs.writeFile(file, JSON.stringify(json), callback)
        });
        let callback = (err) => {
            if (err) reject(err);
            else
                resolve(callback);
        };
    })
}

function verifyIfJsonFileExists(file) {
    return new Promise((resolve, reject) => {
        fs.access(file, fs.F_OK, (err) => {
            if (err) {
                reject(file);
            }
            else resolve(file);
        })
    })
}

function createJsonFile(file) {
    return new Promise((resolve, reject) => {
        const log = fs.createWriteStream(file, {flags: 'a'});
        log.write(`[]`);
        log.end();
        log.on('finish', () => {
            resolve(file);
        });
        log.on('error', () => {
            reject(`${file} Unable to create file`)
        });
    })
}