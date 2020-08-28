const fs = require('fs');
module.exports = {
    saveReqLog : (reqData) => {
        saveReqLog(reqData, 'requests.log');

    },

    saveErrLog : (data) => {
        saveErrLog(data, 'error.log');
    },

    saveJsonData : (reqData) => {
        const file = 'data.json';
        verifyIfJsonFileExists(file)
            .catch(createJsonFile)
            .then(readJson).catch(handleError)
            .then((data)=> saveJsonToFile(file,data,reqData)).catch(handleError)
            .then(()=>console.log('JSON data has been saved'))
    },
};

function saveReqLog(reqData,logfile) {
    const log = fs.createWriteStream(logfile, {flags: 'a'});
    log.write(`${new Date().toLocaleString()}, Request body:${JSON.stringify(reqData.body)}\n`);
    log.end();
    log.on('finish',  () => {
        console.log("Log has been saved");
    });
    log.on("error", (err => {
        console.log(err);
    }));
}

function saveErrLog(data, logfile) {
    const log = fs.createWriteStream(logfile, {flags: 'a'});
    log.write(`${new Date().toLocaleString()}, ErrorLog:${data}\n`);
    log.end();
    log.on('finish',  () => {
        console.log("Err log has been saved");
    });
    log.on("error", (err => {
        console.log(err);
    }));
}

function verifyIfJsonFileExists(file) {
    return new Promise((resolve,reject) => {
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

function readJson(file){
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(data)
            }
        });
    })
}

function saveJsonToFile(file, data, reqData) {
    return new Promise((resolve, reject) => {
        let json = JSON.parse(data);
        json.push(reqData.body);
        fs.writeFile(file, JSON.stringify(json), (err)=> {
            if (err) {
                reject(err)
            }
            else {
                resolve();
            }
        })
    })}

function handleError(err) {
    console.log(err)
}