const fs = require('fs');
module.exports = {
    saveLog : (reqData,file) => {
        saveLog(reqData,file);

    },
    saveJsonData : (reqData, file) => {
            verifyIfJsonFileExists(file)
                .catch(createJsonFile)
                .then(readJson).catch(handleError)
                .then((data)=> saveJson(file,data,reqData)).catch(handleError)
                .then(()=>console.log('JSON data has been saved'))
        
    },
};

function saveLog(reqData, file) {
        const log = fs.createWriteStream(file, {flags: 'a'});
        log.write(`${new Date().toLocaleString()}, Request body:${JSON.stringify(reqData.body)}\n`);
        log.end();
        log.on('finish',  () => {
            console.log("Log has been saved");
        });
        log.on("error", (err => {
            console.log(err);
        }));
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

function saveJson(file, data, reqData) {
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

function handleError(err) {
    console.log(err)
}